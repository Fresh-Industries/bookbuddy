import express, { type Request, type Response } from 'express';
import axios from 'axios';
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

router.get('/preferences', verify, async (req: AuthReq, res) => {
  let p = await prisma.userPreference.findUnique({ where: { userId: req.UserId! } });
  if (!p) p = await prisma.userPreference.create({ data: { userId: req.UserId! } });
  res.json(p);
});

router.put('/preferences', verify, async (req: AuthReq, res) => {
  const { favoriteGenres, favoriteAuthors, dislikeGenres, readingSpeed } = req.body;
  const p = await prisma.userPreference.upsert({
    where: { userId: req.UserId! },
    update: { favoriteGenres, favoriteAuthors, dislikeGenres, readingSpeed },
    create: { userId: req.UserId!, favoriteGenres: favoriteGenres || [], favoriteAuthors: favoriteAuthors || [], dislikeGenres: [], readingSpeed: readingSpeed || 30 }
  });
  res.json(p);
});

router.get('/recommendations', verify, async (req: AuthReq, res) => {
  const prefs = await prisma.userPreference.findUnique({ where: { userId: req.UserId! } });
  const books = await prisma.userBook.findMany({ where: { userId: req.UserId! }, orderBy: { createdAt: 'desc' }, take: 5 });
  let q: string[] = [];
  if (prefs?.favoriteGenres?.length) q.push(...prefs.favoriteGenres);
  if (books.length) q.push(...books.flatMap(b => b.categories || []).slice(0, 3));
  if (!q.length) q = ['bestselling fiction'];
  const query = q[Math.floor(Math.random() * q.length)];
  const key = process.env.GOOGLE_API_KEY;
  if (!key) return res.status(500).json({ error: 'GOOGLE_API_KEY missing' });
  const r = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10&key=${key}`);
  const recs = r.data.items?.map((b: any) => ({
    id: b.id, title: b.volumeInfo.title, authors: b.volumeInfo.authors,
    imageUrl: b.volumeInfo.imageLinks?.thumbnail, categories: b.volumeInfo.categories
  })) || [];
  res.json(recs);
});

router.post('/update-speed', verify, async (req: AuthReq, res) => {
  const { pagesRead = 0, minutesSpent = 0 } = req.body;
  if (!minutesSpent) return res.json({ message: 'No time' });
  const speed = Math.round((pagesRead / minutesSpent) * 60);
  const p = await prisma.userPreference.upsert({
    where: { userId: req.UserId! },
    update: { readingSpeed: speed },
    create: { userId: req.UserId!, readingSpeed: speed }
  });
  res.json(p);
});

export default router;
