const express = require('express');
const router = express.Router();

const verifyToken = require('../../middleware/verifyToken');

const readingSessionsController = require('../../controllers/readingSessions/readingSessionsController');

router.post('/new-reading-session', verifyToken, readingSessionsController.createReadingSession);

module.exports = router;