const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/verifyToken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get all highlights for a book
router.get('/book/:bookId', verifyToken, async (req, res) => {
  try {
    const { bookId } = req.params;
    
    const highlights = await prisma.highlight.findMany({
      where: {
        userId: req.UserId,
        userBookId: parseInt(bookId)
      },
      orderBy: { pageNumber: 'asc' }
    });

    res.json(highlights);
  } catch (error) {
    console.error('Error fetching highlights:', error);
    res.status(500).json({ error: 'Failed to fetch highlights' });
  }
});

// Get all user highlights
router.get('/', verifyToken, async (req, res) => {
  try {
    const highlights = await prisma.highlight.findMany({
      where: { userId: req.UserId },
      include: { userBook: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json(highlights);
  } catch (error) {
    console.error('Error fetching highlights:', error);
    res.status(500).json({ error: 'Failed to fetch highlights' });
  }
});

// Create highlight
router.post('/', verifyToken, async (req, res) => {
  try {
    const { userBookId, content, pageNumber, chapter, color, note } = req.body;

    const highlight = await prisma.highlight.create({
      data: {
        userId: req.UserId,
        userBookId: parseInt(userBookId),
        content,
        pageNumber,
        chapter,
        color: color || 'yellow',
        note
      }
    });

    res.json(highlight);
  } catch (error) {
    console.error('Error creating highlight:', error);
    res.status(500).json({ error: 'Failed to create highlight' });
  }
});

// Update highlight (change color or add note)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { color, note } = req.body;

    const highlight = await prisma.highlight.update({
      where: { id: parseInt(id), userId: req.UserId },
      data: { color, note }
    });

    res.json(highlight);
  } catch (error) {
    console.error('Error updating highlight:', error);
    res.status(500).json({ error: 'Failed to update highlight' });
  }
});

// Delete highlight
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.highlight.delete({
      where: { id: parseInt(id), userId: req.UserId }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting highlight:', error);
    res.status(500).json({ error: 'Failed to delete highlight' });
  }
});

module.exports = router;
