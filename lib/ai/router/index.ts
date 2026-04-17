import { generateChatCompletion } from "@/lib/ai/client";
import { trackUsage } from "@/lib/ai/cost-tracker";

export type ModelTier = "fast" | "balanced" | "deep" | "creative";
export type TaskType = "chat" | "ingestion" | "analysis" | "coding" | "creative";

interface RouteConfig {
  tier: ModelTier;
  task: TaskType;
  contextWindow?: number;
  requiresCitations?: boolean;
}

interface ModelConfig {
  id: string;
  provider: "openai" | "anthropic" | "google";
  tier: ModelTier;
  contextWindow: number;
  costPer1KInput: number;
  costPer1KOutput: number;
  strengths: TaskType[];
}

// Model configurations with pricing
const MODELS: ModelConfig[] = [
  {
    id: "gpt-4o-mini",
    provider: "openai",
    tier: "fast",
    contextWindow: 128000,
    costPer1KInput: 0.15,
    costPer1KOutput: 0.6,
    strengths: ["chat", "ingestion"],
  },
  {
    id: "gpt-4o",
    provider: "openai",
    tier: "balanced",
    contextWindow: 128000,
    costPer1KInput: 2.5,
    costPer1KOutput: 10,
    strengths: ["chat", "analysis"],
  },
  {
    id: "claude-3-5-sonnet-20241022",
    provider: "anthropic",
    tier: "deep",
    contextWindow: 200000,
    costPer1KInput: 3,
    costPer1KOutput: 15,
    strengths: ["analysis", "coding"],
  },
  {
    id: "claude-3-opus-20240229",
    provider: "anthropic",
    tier: "deep",
    contextWindow: 200000,
    costPer1KInput: 15,
    costPer1KOutput: 75,
    strengths: ["analysis", "coding", "creative"],
  },
  {
    id: "gemini-1.5-flash",
    provider: "google",
    tier: "fast",
    contextWindow: 1000000,
    costPer1KInput: 0.075,
    costPer1KOutput: 0.3,
    strengths: ["chat", "ingestion"],
  },
  {
    id: "gemini-1.5-pro",
    provider: "google",
    tier: "balanced",
    contextWindow: 2000000,
    costPer1KInput: 3.5,
    costPer1KOutput: 10.5,
    strengths: ["analysis", "chat"],
  },
];

export function selectModel(config: RouteConfig): ModelConfig {
  const { tier, task, contextWindow = 4000 } = config;

  // Filter by tier and context window
  const candidates = MODELS.filter(
    (m) => m.tier === tier && m.contextWindow >= contextWindow
  );

  // Sort by task strength match
  const scored = candidates.map((model) => ({
    model,
    score: model.strengths.includes(task) ? 2 : 1,
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored[0]?.model || MODELS[0];
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface RouteResult {
  content: string;
  model: ModelConfig;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    cost: number;
  };
  citations?: Citation[];
}

interface Citation {
  sourceId: string;
  title: string;
  excerpt: string;
  relevanceScore: number;
}

export async function routeAndGenerate(
  messages: ChatMessage[],
  config: RouteConfig,
  tenantId: string
): Promise<RouteResult> {
  const model = selectModel(config);

  // Generate completion
  const result = await generateChatCompletion(model, messages);

  // Calculate cost
  const inputCost = (result.usage.prompt_tokens / 1000) * model.costPer1KInput;
  const outputCost =
    (result.usage.completion_tokens / 1000) * model.costPer1KOutput;
  const totalCost = inputCost + outputCost;

  // Track usage
  await trackUsage({
    tenantId,
    model: model.id,
    provider: model.provider,
    promptTokens: result.usage.prompt_tokens,
    completionTokens: result.usage.completion_tokens,
    totalTokens: result.usage.total_tokens,
    cost: totalCost,
    timestamp: new Date(),
  });

  return {
    content: result.content,
    model,
    usage: {
      promptTokens: result.usage.prompt_tokens,
      completionTokens: result.usage.completion_tokens,
      totalTokens: result.usage.total_tokens,
      cost: totalCost,
    },
  };
}

export function getModelForQuery(query: string): ModelTier {
  // Simple heuristic for model selection
  const codingKeywords = [
    "code",
    "function",
    "api",
    "programming",
    "javascript",
    "python",
  ];
  const analysisKeywords = [
    "analyze",
    "compare",
    "evaluate",
    "research",
    "strategy",
  ];

  const lowerQuery = query.toLowerCase();

  if (codingKeywords.some((k) => lowerQuery.includes(k))) {
    return "deep";
  }

  if (analysisKeywords.some((k) => lowerQuery.includes(k))) {
    return "balanced";
  }

  // Short queries → fast model
  if (query.length < 100) {
    return "fast";
  }

  return "balanced";
}
