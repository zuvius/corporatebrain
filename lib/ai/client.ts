import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";
import { AIModelConfig } from "./models";

// Lazy initialization to prevent errors when API keys are missing
let openaiClient: OpenAI | null = null;
let anthropicClient: Anthropic | null = null;
let googleAIClient: GoogleGenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY not configured");
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");
    anthropicClient = new Anthropic({ apiKey });
  }
  return anthropicClient;
}

function getGoogleAIClient(): GoogleGenAI {
  if (!googleAIClient) {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) throw new Error("GOOGLE_AI_API_KEY not configured");
    googleAIClient = new GoogleGenAI({ apiKey });
  }
  return googleAIClient;
}

export async function generateEmbeddings(text: string): Promise<number[]> {
  const client = getOpenAIClient();
  const response = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return response.data[0].embedding;
}

export async function generateChatCompletion(
  model: Pick<AIModelConfig, "id" | "provider">,
  messages: Array<{ role: string; content: string }>
) {
  switch (model.provider) {
    case "openai":
      return generateOpenAICompletion(model.id, messages);
    case "anthropic":
      return generateAnthropicCompletion(model.id, messages);
    case "google":
      return generateGoogleCompletion(model.id, messages);
    default:
      throw new Error(`Unsupported provider: ${model.provider}`);
  }
}

async function generateOpenAICompletion(
  modelId: string,
  messages: Array<{ role: string; content: string }>
) {
  const client = getOpenAIClient();
  const response = await client.chat.completions.create({
    model: modelId,
    messages: messages.map((m) => ({
      role: m.role as "system" | "user" | "assistant",
      content: m.content,
    })),
    temperature: 0.7,
    max_tokens: 2000,
  });

  return {
    content: response.choices[0]?.message?.content || "",
    usage: response.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
  };
}

async function generateAnthropicCompletion(
  modelId: string,
  messages: Array<{ role: string; content: string }>
) {
  const client = getAnthropicClient();
  const systemMessage = messages.find((m) => m.role === "system")?.content || "";
  const userMessages = messages.filter((m) => m.role !== "system");

  const response = await client.messages.create({
    model: modelId,
    max_tokens: 4096,
    system: systemMessage,
    messages: userMessages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  });

  const content = response.content
    .filter((c) => c.type === "text")
    .map((c) => (c as any).text)
    .join("");

  return {
    content,
    usage: {
      prompt_tokens: response.usage.input_tokens,
      completion_tokens: response.usage.output_tokens,
      total_tokens: response.usage.input_tokens + response.usage.output_tokens,
    },
  };
}

async function generateGoogleCompletion(
  modelId: string,
  messages: Array<{ role: string; content: string }>
) {
  const client = getGoogleAIClient();

  const systemMessage = messages.find((m) => m.role === "system")?.content || "";
  const userMessage = messages.filter((m) => m.role !== "system").pop()?.content || "";

  const result = await client.models.generateContent({
    model: modelId,
    contents: userMessage,
    config: {
      systemInstruction: systemMessage,
    },
  });

  const responseText = result.text || "";

  // Estimate tokens (Gemini doesn't provide exact counts)
  const promptTokens = Math.ceil(userMessage.length / 4);
  const completionTokens = Math.ceil(responseText.length / 4);

  return {
    content: responseText,
    usage: {
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_tokens: promptTokens + completionTokens,
    },
  };
}

export function buildSystemPrompt(context: string): string {
  return `You are a helpful AI assistant for a company's knowledge management system. You have access to the following company documents and information:

${context}

Instructions:
- Answer questions based on the provided context
- If the answer isn't in the context, say so clearly
- Cite specific sources when providing information
- Be concise but thorough
- Use professional language appropriate for a business setting`;
}
