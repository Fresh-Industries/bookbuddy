const express = require('express');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config(); 
const port = process.env.PORT || 3001;
const prisma = new PrismaClient(); 
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());


// Routes
const authRoutes = require('./routes/auth/auth');
const booksRoutes = require('./routes/books/books');
const usersRoutes = require('./routes/users/user');
const readingSessionsRoutes = require('./routes/readingSession/readingSession');
const aiRoutes = require('./routes/ai/ai');


app.use('/v1/auth', authRoutes);
app.use('/v1/books', booksRoutes);
app.use('/v1/users', usersRoutes);
app.use('/v1/reading-sessions', readingSessionsRoutes);
app.use('/v1/ai', aiRoutes);


app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

app.get('/', async (req, res) => {
  try {
    // Simulate a basic check to the database (you can remove this if you only want the message)
    await prisma.$connect();

    res.send('Connected to database successfully'); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Error connecting to database');
  } finally {
     // Always disconnect for API endpoints if not maintaining a persistent connection
     await prisma.$disconnect();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




