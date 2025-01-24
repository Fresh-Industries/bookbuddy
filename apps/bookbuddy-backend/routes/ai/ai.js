const express = require('express');
const router = express.Router();

const verifyToken = require('../../middleware/verifyToken');


const aiController = require('../../controllers/ai/aiController');

router.post('/chatbot',aiController.Generalchatbot);
router.post('/readingSessionChatbot', verifyToken ,aiController.ReadingSessionchatbot);

module.exports = router;