import express, { type Request, type Response } from 'express';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || process.env.BETTER_AUTH_SECRET || 'dev-secret';
const createMiniMax = () => {
  const key = process.env.MINIMAX_API_KEY;
  if (!key) throw new Error('MINIMAX_API_KEY missing');
  return createOpenAI({ baseURL: 'https://api.minimax.chat/v1', apiKey: key });
};

const mm = createMiniMax();

interface AuthReq extends Request {
  UserId?: number;
}

async function getLastSession(userId: number) {
  return prisma.readingSession.findFirst({
    where: { userId },
    orderBy: { startedAt: 'desc' }
  });
}
async function getBook(id: number) {
  return prisma.userBook.findUnique({ where: { id } });
}

function verifyToken(req: AuthReq, res: Response, next: Function) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { UserId?: number; userId?: number };
    const userId = decoded.UserId ?? decoded.userId;
    if (!userId) return res.status(401).json({ error: 'Invalid token payload' });
    req.UserId = userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

router.post('/chatbot', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });
    const result = await generateText({
      model: mm('MiniMax-M2.1'),
      system: 'You are BookBuddy, a friendly book discussion companion.',
      messages: [{ role: 'user', content: message }]
    });
    res.json({ response: result.text });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Chat failed' });
  }
});

router.post('/readingSessionChatbot', verifyToken, async (req: AuthReq, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });
    const session = await getLastSession(req.UserId!);
    if (!session) return res.status(404).json({ error: 'No session' });
    const book = await getBook(session.userBookId);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    const result = await generateText({
      model: mm('MiniMax-M2.1'),
      system: `Discussing "${book.title}" by ${book.authors?.join(', ')}. Pages ${session.pageStart}-${session.pageEnd}.`,
      messages: [{ role: 'user', content: message }]
    });
    res.json({ response: result.text });
  } catch (error) {
    console.error('Session chat error:', error);
    res.status(500).json({ error: 'Chat failed' });
  }
});

export default router;
