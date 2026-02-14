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
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Stats
router.get('/stats', verify, async (req: AuthReq, res: Response) => {
  try {
    let stats = await prisma.userStats.findUnique({ where: { userId: req.UserId! } });
    if (!stats) stats = await prisma.userStats.create({ data: { userId: req.UserId! } });
    res.json(stats);
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/update-streak', verify, async (req: AuthReq, res: Response) => {
  const today = new Date(); today.setHours(0,0,0,0);
  const { pagesRead = 0, minutesRead = 0 } = req.body;
  try {
    let stats = await prisma.userStats.findUnique({ where: { userId: req.UserId! } }) 
      || await prisma.userStats.create({ data: { userId: req.UserId! } });
    const last = stats?.lastReadDate ? new Date(stats.lastReadDate) : null;
    let streak = stats?.currentStreak || 0;
    if (last) {
      last.setHours(0,0,0,0);
      const diff = Math.floor((today.getTime() - last.getTime()) / 86400000);
      if (diff === 1) streak++;
      else if (diff > 1) streak = 1;
    } else streak = 1;
    const updated = await prisma.userStats.update({
      where: { userId: req.UserId! },
      data: { totalPagesRead: { increment: pagesRead }, totalMinutesRead: { increment: minutesRead }, currentStreak: streak, longestStreak: Math.max(streak, stats?.longestStreak || 0), lastReadDate: today }
    });
    res.json(updated);
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

router.get('/history', verify, async (req: AuthReq, res: Response) => {
  const start = new Date();
  if (req.query.period === 'week') start.setDate(start.getDate() - 7);
  else if (req.query.period === 'year') start.setFullYear(start.getFullYear() - 1);
  else start.setMonth(start.getMonth() - 1);
  const sessions = await prisma.readingSession.findMany({
    where: { userId: req.UserId!, startedAt: { gte: start } },
    include: { userBook: true }, orderBy: { startedAt: 'desc' }
  });
  const history = sessions.reduce((a, s) => {
    const d = s.startedAt.toISOString().split('T')[0];
    if (!a[d]) a[d] = { pages: 0, minutes: 0, books: 0 };
    a[d].pages += s.pageEnd - s.pageStart;
    a[d].minutes += s.timeSpent || 0;
    return a;
  }, {} as any);
  res.json(history);
});

export default router;
