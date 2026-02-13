import { Router } from "express";
import { generateBookSummary, generateReadingInsights, generateBookRecommendations, chatWithAI } from "../lib/ai";
import { PROMPTS, CHAT_SYSTEM } from "../lib/prompts";
import { z } from "zod";

const router = Router();

// Schema for AI requests
const chatSchema = z.object({
  messages: z.array(z.object({
    role: z.string(),
    content: z.string(),
  })),
  model: z.string().optional(),
  temperature: z.number().optional(),
  maxTokens: z.number().optional(),
});

const summarySchema = z.object({
  title: z.string(),
  description: z.string().optional(),
});

const insightsSchema = z.object({
  title: z.string(),
  notes: z.array(z.string()),
});

const recommendationsSchema = z.object({
  books: z.array(z.object({
    title: z.string(),
    author: z.string(),
  })),
});

// Chat endpoint - uses CHAT_SYSTEM prompt
router.post("/chat", async (req, res) => {
  try {
    const { messages, model, temperature, maxTokens } = chatSchema.parse(req.body);
    
    // Build messages with system prompt
    const fullMessages = [
      { role: "system", content: CHAT_SYSTEM },
      ...messages,
    ];
    
    const response = await chatWithAI(fullMessages, { model, temperature, maxTokens });
    
    res.json({ response });
  } catch (error: any) {
    console.error("AI Chat error:", error);
    res.status(500).json({ error: error.message || "Failed to generate response" });
  }
});

// Book summary - uses BOOK_SUMMARY_SYSTEM prompt
router.post("/summary", async (req, res) => {
  try {
    const { title, description } = summarySchema.parse(req.body);
    
    const prompt = PROMPTS.summarize(title, description);
    const summary = await generateBookSummary(title, description);
    
    res.json({ summary });
  } catch (error: any) {
    console.error("Summary error:", error);
    res.status(500).json({ error: error.message || "Failed to generate summary" });
  }
});

// Reading insights - uses READING_INSIGHTS_SYSTEM prompt
router.post("/insights", async (req, res) => {
  try {
    const { title, notes } = insightsSchema.parse(req.body);
    
    const insights = await generateReadingInsights(title, notes);
    
    res.json({ insights });
  } catch (error: any) {
    console.error("Insights error:", error);
    res.status(500).json({ error: error.message || "Failed to generate insights" });
  }
});

// Book recommendations - uses BOOK_RECOMMENDATIONS_SYSTEM prompt
router.post("/recommendations", async (req, res) => {
  try {
    const { books } = recommendationsSchema.parse(req.body);
    
    const recommendations = await generateBookRecommendations(books);
    
    res.json({ recommendations });
  } catch (error: any) {
    console.error("Recommendations error:", error);
    res.status(500).json({ error: error.message || "Failed to generate recommendations" });
  }
});

export default router;
