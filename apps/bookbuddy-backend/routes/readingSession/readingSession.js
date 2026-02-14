import express from 'express';
const router = express.Router();

import verifyToken from '../../middleware/verifyToken.js';

import readingSessionsController from '../../controllers/readingSessions/readingSessionsController.js';

router.post('/new-reading-session', verifyToken, readingSessionsController.createReadingSession);

export default router;
