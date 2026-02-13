const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/verifyToken');
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

// Get user preferences
router.get('/preferences', verifyToken, async (req, res) => {
  try {
    let preferences = await prisma.userPreference.findUnique({
      where: { userId: req.UserId }
    });

    if (!preferences) {
      preferences = await prisma.userPreference.create({
        data: { userId: req.UserId }
      });
    }

    res.json(preferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

// Update user preferences
router.put('/preferences', verifyToken, async (req, res) => {
  try {
    const { favoriteGenres, favoriteAuthors, dislikeGenres, readingSpeed } = req.body;

    const preferences = await prisma.userPreference.upsert({
      where: { userId: req.UserId },
      update: { favoriteGenres, favoriteAuthors, dislikeGenres, readingSpeed },
      create: {
        userId: req.UserId,
        favoriteGenres: favoriteGenres || [],
        favoriteAuthors: favoriteAuthors || [],
        dislikeGenres: dislikeGenres || [],
        readingSpeed: readingSpeed || 30
      }
    });

    res.json(preferences);
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Get AI-powered book recommendations
router.get('/recommendations', verifyToken, async (req, res) => {
  try {
    const preferences = await prisma.userPreference.findUnique({
      where: { userId: req.UserId }
    });

    const recentBooks = await prisma.userBook.findMany({
      where: { userId: req.UserId },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Build recommendation query based on preferences and reading history
    let queryParts = [];
    
    if (preferences?.favoriteGenres?.length > 0) {
      queryParts.push(preferences.favoriteGenres.join('+'));
    }
    
    if (recentBooks.length > 0) {
      const recentCategories = recentBooks
        .flatMap(b => b.categories || [])
        .slice(0, 3);
      if (recentCategories.length > 0) {
        queryParts.push(recentCategories.join('+'));
      }
    }

    if (queryParts.length === 0) {
      queryParts.push('bestselling fiction');
    }

    const query = queryParts[Math.floor(Math.random() * queryParts.length)];

    // Fetch from Google Books API
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10&key=${process.env.GOOGLE_API_KEY}`
    );

    const recommendations = response.data.items?.map(book => ({
      id: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors,
      description: book.volumeInfo.description,
      imageUrl: book.volumeInfo.imageLinks?.thumbnail,
      categories: book.volumeInfo.categories,
      averageRating: book.volumeInfo.averageRating
    })) || [];

    res.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// Update reading speed based on actual reading
router.post('/update-speed', verifyToken, async (req, res) => {
  try {
    const { pagesRead, minutesSpent } = req.body;

    if (!minutesSpent || minutesSpent === 0) {
      return res.json({ message: 'No time recorded' });
    }

    const calculatedSpeed = Math.round((pagesRead / minutesSpent) * 60); // pages per hour

    const preferences = await prisma.userPreference.upsert({
      where: { userId: req.UserId },
      update: { readingSpeed: calculatedSpeed },
      create: { userId: req.UserId, readingSpeed: calculatedSpeed }
    });

    res.json(preferences);
  } catch (error) {
    console.error('Error updating reading speed:', error);
    res.status(500).json({ error: 'Failed to update reading speed' });
  }
});

module.exports = router;
