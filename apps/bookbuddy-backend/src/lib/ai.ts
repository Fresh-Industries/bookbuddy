import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

// Create MiniMax client (compatible with OpenAI API)
const minimax = createOpenAI({
  apiKey: process.env.MINIMAX_API_KEY,
  baseURL: "https://api.minimax.chat/v1",
});

// Create OpenAI client (fallback)
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create Anthropic client for Claude
const anthropic = createOpenAI({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: "https://api.anthropic.com/v1",
});

export type ModelProvider = "minimax" | "openai" | "anthropic";

export interface AIConfig {
  model: string;
  temperature?: number;
  maxTokens?: number;
}

const DEFAULT_MODEL = "MiniMax-M2.5";

export async function generateWithAI(
  prompt: string,
  options: {
    model?: string;
    provider?: ModelProvider;
    temperature?: number;
    maxTokens?: number;
  } = {}
) {
  const { provider = "minimax", temperature = 0.7, maxTokens = 4096 } = options;
  const model = options.model || DEFAULT_MODEL;

  const client = provider === "openai" ? openai : provider === "anthropic" ? anthropic : minimax;

  const result = await generateText({
    model: client(model),
    prompt,
    temperature,
    maxTokens,
  });

  return result.text;
}

export async function chatWithAI(
  messages: { role: string; content: string }[],
  options: {
    model?: string;
    provider?: ModelProvider;
    temperature?: number;
    maxTokens?: number;
  } = {}
) {
  const { provider = "minimax", temperature = 0.7, maxTokens = 4096 } = options;
  const model = options.model || DEFAULT_MODEL;

  const client = provider === "openai" ? openai : provider === "anthropic" ? anthropic : minimax;

  const result = await generateText({
    model: client(model),
    messages: messages as any,
    temperature,
    maxTokens,
  });

  return result.text;
}

// Book-specific AI helpers
export async function generateBookSummary(bookTitle: string, bookDescription?: string) {
  const prompt = `Summarize the book "${bookTitle}".${bookDescription ? `\n\nDescription: ${bookDescription}` : ""}\n\nProvide a concise summary (2-3 paragraphs).`;
  
  return generateWithAI(prompt, {
    model: "MiniMax-M2.5",
    provider: "minimax",
  });
}

export async function generateReadingInsights(bookTitle: string, userNotes: string[]) {
  const prompt = `Based on the book "${bookTitle}", analyze the following reading notes and provide insights:\n\n${userNotes.join("\n")}\n\nProvide: 1) Key themes, 2) Actionable takeaways, 3) Questions for reflection.`;
  
  return generateWithAI(prompt, {
    model: "MiniMax-M2.5",
    provider: "minimax",
  });
}

export async function generateBookRecommendations(books: { title: string; author: string }[]) {
  const bookList = books.map(b => `- ${b.title} by ${b.author}`).join("\n");
  
  const prompt = `Based on these books the user has read:\n\n${bookList}\n\nRecommend 3 similar books they might enjoy. Explain why each recommendation fits their taste.`;
  
  return generateWithAI(prompt, {
    model: "MiniMax-M2.5",
    provider: "minimax",
  });
}

export { minimax, openai, anthropic };
