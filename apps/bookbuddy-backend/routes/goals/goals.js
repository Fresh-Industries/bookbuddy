const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/verifyToken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get user's reading goals
router.get('/', verifyToken, async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    
    const goals = await prisma.readingGoal.findMany({
      where: {
        userId: req.UserId,
        year: currentYear
      },
      orderBy: { type: 'asc' }
    });

    res.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

// Create or update a reading goal
router.post('/', verifyToken, async (req, res) => {
  try {
    const { year, month, type, target } = req.body;
    const currentYear = year || new Date().getFullYear();

    const goal = await prisma.readingGoal.upsert({
      where: {
        userId_year_month_type: {
          userId: req.UserId,
          year: currentYear,
          month: month || 0,
          type
        }
      },
      update: { target },
      create: {
        userId: req.UserId,
        year: currentYear,
        month,
        type,
        target
      }
    });

    res.json(goal);
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

// Update goal progress
router.put('/:id/progress', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;

    const goal = await prisma.readingGoal.update({
      where: { id: parseInt(id), userId: req.UserId },
      data: { progress }
    });

    res.json(goal);
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ error: 'Failed to update goal' });
  }
});

// Delete goal
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.readingGoal.delete({
      where: { id: parseInt(id), userId: req.UserId }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
});

module.exports = router;
