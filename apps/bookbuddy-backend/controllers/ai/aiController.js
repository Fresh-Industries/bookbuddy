const { generateText } = require('ai').generateText;
const { createOpenAI } = require('@ai-sdk/openai');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// MiniMax setup (OpenAI-compatible API)
const createMiniMaxClient = () => {
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    throw new Error('MINIMAX_API_KEY not configured');
  }
  
  return createOpenAI({
    baseURL: 'https://api.minimax.chat/v1',
    apiKey,
  });
};

const miniMax = createMiniMaxClient();

async function getLastReadingSession(userId) {
  return await prisma.readingSession.findFirst({
    where: { userId },
    orderBy: { startedAt: 'desc' },
  });
}

async function userBookById(bookId) {
  return await prisma.userBook.findUnique({
    where: { id: parseInt(bookId) },
  });
}

const ReadingSessionchatbot = async (req, res) => {
  console.log("Reading session chatbot called");
  const userId = req.UserId;
  const userInput = req.body.message;

  if (!userInput) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const lastSession = await getLastReadingSession(userId);
    if (!lastSession) {
      return res.status(404).json({ error: "No recent reading session found." });
    }

    const userBook = await userBookById(lastSession.userBookId);
    if (!userBook) {
      return res.status(404).json({ error: "Book not found." });
    }

    const systemPrompt = `You are a friendly book discussion assistant. The user just finished a reading session. 

Book: "${userBook.title}" by ${userBook.authors?.join(', ')}
Pages read: ${lastSession.pageStart} - ${lastSession.pageEnd}

Keep responses short and conversational. Ask engaging questions about what they read.`;

    const result = await generateText({
      model: miniMax('MiniMax-M2.1'),
      system: systemPrompt,
      messages: [{ role: 'user', content: userInput }],
    });

    res.status(200).json({ response: result.text });

  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
};

const Generalchatbot = async (req, res) => {
  console.log("General chatbot called");
  const userInput = req.body.message;

  if (!userInput) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const systemPrompt = `You are BookBuddy, an inclusive virtual book club companion. 

Your role:
- Discuss both fiction and nonfiction books
- Ask open-ended questions that encourage reflection
- Keep responses conversational and short
- Relate topics to real-world applications
- Respect diverse perspectives
- Recommend related books when appropriate

Format responses to be engaging and encourage discussion.`;

  try {
    const result = await generateText({
      model: miniMax('MiniMax-M2.1'),
      system: systemPrompt,
      messages: [{ role: 'user', content: userInput }],
    });

    res.status(200).json({ response: result.text });

  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
};

module.exports = {
  ReadingSessionchatbot,
  Generalchatbot
};
