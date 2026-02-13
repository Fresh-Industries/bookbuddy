require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:8081",
  credentials: true,
}));
app.use(express.json());

// Routes
const authRoutes = require('./src/routes/auth');
const booksRoutes = require('./routes/books/books');
const usersRoutes = require('./routes/users/user');
const readingSessionsRoutes = require('./routes/readingSession/readingSession');
const aiRoutes = require('./src/routes/ai');

app.use('/v1/auth', authRoutes);
app.use('/v1/books', booksRoutes);
app.use('/v1/users', usersRoutes);
app.use('/v1/reading-sessions', readingSessionsRoutes);
app.use('/v1/ai', aiRoutes);

// Health check
app.get('/health', async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ status: "ok", database: "connected" });
  } catch (err: any) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

// Root endpoint
app.get('/', async (req, res) => {
  res.send('BookBuddy API v1 - Running');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = app;
