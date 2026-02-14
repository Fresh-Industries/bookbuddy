import 'dotenv/config';
import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

import authRoutes from '../routes/auth/auth.js';
import booksRoutes from '../routes/books/books.js';
import usersRoutes from '../routes/users/user.js';
import readingSessionsRoutes from '../routes/readingSession/readingSession.js';
import aiRoutes from './routes/ai.js';
import statsRoutes from './routes/stats.js';
import highlightsRoutes from './routes/highlights.js';
import goalsRoutes from './routes/goals.js';
import preferencesRoutes from './routes/preferences.js';

const prisma = new PrismaClient();
const app: Express = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8081',
  credentials: true,
}));
app.use(express.json());

app.use('/v1/auth', authRoutes);
app.use('/v1/books', booksRoutes);
app.use('/v1/users', usersRoutes);
app.use('/v1/reading-sessions', readingSessionsRoutes);
app.use('/v1/ai', aiRoutes);
app.use('/v1/stats', statsRoutes);
app.use('/v1/highlights', highlightsRoutes);
app.use('/v1/goals', goalsRoutes);
app.use('/v1/preferences', preferencesRoutes);

app.get('/health', async (_req: Request, res: Response) => {
  try {
    await prisma.$connect();
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ status: 'error', error: message });
  }
});

app.get('/', (_req: Request, res: Response) => {
  res.send('BookBuddy API v1 - Running');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
