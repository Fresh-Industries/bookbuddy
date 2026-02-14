import express, { type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || process.env.BETTER_AUTH_SECRET || 'dev-secret';

interface AuthReq extends Request { UserId?: number; }

function verify(req: AuthReq, res: Response, next: Function) {
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

router.get('/', verify, async (req: AuthReq, res) => {
  const year = new Date().getFullYear();
  const goals = await prisma.readingGoal.findMany({
    where: { userId: req.UserId!, year },
    orderBy: { type: 'asc' }
  });
  res.json(goals);
});

router.post('/', verify, async (req: AuthReq, res) => {
  const { year, month, type, target } = req.body;
  const y = year || new Date().getFullYear();
  const goal = await prisma.readingGoal.upsert({
    where: { userId_year_month_type: { userId: req.UserId!, year: y, month: month || 0, type } },
    update: { target },
    create: { userId: req.UserId!, year: y, month, type, target }
  });
  res.json(goal);
});

router.put('/:id/progress', verify, async (req: AuthReq, res) => {
  const goal = await prisma.readingGoal.update({ where: { id: parseInt(req.params.id), userId: req.UserId }, data: { progress: req.body.progress } });
  res.json(goal);
});

router.delete('/:id', verify, async (req: AuthReq, res) => {
  await prisma.readingGoal.delete({
    where: { id: parseInt(req.params.id), userId: req.UserId }
  });
  res.json({ success: true });
});

export default router;
