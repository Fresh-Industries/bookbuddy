const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/verifyToken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get user stats
router.get('/stats', verifyToken, async (req, res) => {
  try {
    let stats = await prisma.userStats.findUnique({
      where: { userId: req.UserId }
    });

    if (!stats) {
      stats = await prisma.userStats.create({
        data: { userId: req.UserId }
      });
    }

    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Update reading streak (call after reading session ends)
router.post('/update-streak', verifyToken, async (req, res) => {
  try {
    const { pagesRead, minutesRead } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let stats = await prisma.userStats.findUnique({
      where: { userId: req.UserId }
    });

    if (!stats) {
      stats = await prisma.userStats.create({
        data: { userId: req.UserId }
      });
    }

    const lastRead = stats.lastReadDate ? new Date(stats.lastReadDate) : null;
    let newStreak = stats.currentStreak;

    if (lastRead) {
      lastRead.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today - lastRead) / (1000 * 60 * 60 * 24));

      if (daysDiff === 0) {
        // Same day, just update stats
      } else if (daysDiff === 1) {
        // Consecutive day, increase streak
        newStreak += 1;
      } else {
        // Streak broken
        newStreak = 1;
      }
    } else {
      // First time reading
      newStreak = 1;
    }

    const updatedStats = await prisma.userStats.update({
      where: { userId: req.UserId },
      data: {
        totalPagesRead: { increment: pagesRead || 0 },
        totalMinutesRead: { increment: minutesRead || 0 },
        currentStreak: newStreak,
        longestStreak: Math.max(stats.longestStreak, newStreak),
        lastReadDate: today
      }
    });

    res.json(updatedStats);
  } catch (error) {
    console.error('Error updating streak:', error);
    res.status(500).json({ error: 'Failed to update streak' });
  }
});

// Get reading history for stats
router.get('/history', verifyToken, async (req, res) => {
  try {
    const { period } = req.query; // 'week', 'month', 'year'
    
    let startDate = new Date();
    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    const sessions = await prisma.readingSession.findMany({
      where: {
        userId: req.UserId,
        startedAt: { gte: startDate }
      },
      include: { userBook: true },
      orderBy: { startedAt: 'desc' }
    });

    // Group by date
    const history = sessions.reduce((acc, session) => {
      const date = session.startedAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { pages: 0, minutes: 0, books: 0 };
      }
      acc[date].pages += (session.pageEnd - session.pageStart);
      acc[date].minutes += session.timeSpent || 0;
      return acc;
    }, {});

    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;
