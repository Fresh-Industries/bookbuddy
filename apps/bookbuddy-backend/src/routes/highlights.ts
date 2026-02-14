import express, { type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.BETTER_AUTH_SECRET || 'dev-secret';

interface AuthReq extends Request { UserId?: number; }

function verify(req: AuthReq, res: Response, next: Function) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    req.UserId = decoded.userId;
    next();
  } catch { res.status(401).json({ error: 'Invalid token' });
}

router.get('/book/:bookId', verify, async (req: AuthReq, res) => {
  try {
    const h = await prisma.highlight.findMany({ where: { userId: req.UserId!, userBookId: parseInt(req.params.bookId) }, orderBy: { pageNumber: 'asc' });
    res.json(h);
  } catch (e) { res.status(500).json({ error: 'Failed' });
});

router.get('/', verify, async (req: AuthReq, res) => {
  try {
    const h = await prisma.highlight.findMany({ where: { userId: req.UserId! }, include: { userBook: true }, orderBy: { createdAt: 'desc' });
    res.json(h);
  } catch (e) { res.status(500).json({ error: 'Failed' });
});

router.post('/', verify, async (req: AuthReq, res) => {
  const { userBookId, content, pageNumber, chapter, color, note } = req.body;
  try {
    const h = await prisma.highlight.create({ data: { userId: req.UserId!, userBookId: parseInt(userBookId), content, pageNumber: pageNumber || null, chapter: chapter || null, color: color || 'yellow', note: note || null } });
    res.json(h);
  } catch (e) { res.status(500).json({ error: 'Failed' });
});

router.put('/:id', verify, async (req: AuthReq, res) => {
  try {
    const h = await prisma.highlight.update({ where: { id: parseInt(req.params.id), userId: req.UserId! }, data: { color: req.body.color, note: req.body.note });
    res.json(h);
  } catch (e) { res.status(500).json({ error: 'Failed' });
});

router.delete('/:id', verify, async (req: AuthReq, res) => {
  try {
    await prisma.highlight.delete({ where: { id: parseInt(req.params.id), userId: req.UserId! });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: 'Failed' });
});

export default router;
