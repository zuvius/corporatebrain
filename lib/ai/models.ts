export interface AIModelConfig {
  id: string;
  provider: "openai" | "anthropic" | "google";
  name: string;
  maxTokens: number;
  contextWindow: number;
  costPerInputToken: number;
  costPerOutputToken: number;
  strengths: string[];
}

export const AI_MODELS: Record<string, AIModelConfig> = {
  "gpt-4": {
    id: "gpt-4",
    provider: "openai",
    name: "GPT-4",
    maxTokens: 8192,
    contextWindow: 8192,
    costPerInputToken: 0.00003,
    costPerOutputToken: 0.00006,
    strengths: ["reasoning", "analysis", "complex tasks"],
  },
  "claude-3-opus": {
    id: "claude-3-opus-20240229",
    provider: "anthropic",
    name: "Claude 3 Opus",
    maxTokens: 4096,
    contextWindow: 200000,
    costPerInputToken: 0.000015,
    costPerOutputToken: 0.000075,
    strengths: ["long context", "analysis", "coding"],
  },
  "gemini-pro": {
    id: "gemini-pro",
    provider: "google",
    name: "Gemini Pro",
    maxTokens: 2048,
    contextWindow: 32000,
    costPerInputToken: 0.0000005,
    costPerOutputToken: 0.0000015,
    strengths: ["speed", "cost efficiency"],
  },
};

export function analyzeComplexity(query: string): number {
  let score = 0.5; // Base complexity

  // Length factor
  if (query.length > 200) score += 0.1;
  if (query.length > 500) score += 0.1;

  // Question type indicators
  const complexIndicators = [
    "analyze", "compare", "evaluate", "synthesize", "explain in detail",
    "what are the implications", "how does this affect", "why does",
    "pros and cons", "advantages and disadvantages",
  ];
  
  for (const indicator of complexIndicators) {
    if (query.toLowerCase().includes(indicator)) {
      score += 0.15;
      break;
    }
  }

  // Technical depth indicators
  const technicalIndicators = [
    "architecture", "implementation", "technical", "code", "algorithm",
    "system design", "infrastructure", "optimization",
  ];
  
  for (const indicator of technicalIndicators) {
    if (query.toLowerCase().includes(indicator)) {
      score += 0.1;
      break;
    }
  }

  return Math.min(score, 1.0);
}

export function selectModel(query: string, context: string): AIModelConfig {
  const complexity = analyzeComplexity(query);
  const contextSize = context.length;

  // Long context → Gemini Pro
  if (contextSize > 100000) {
    return AI_MODELS["gemini-pro"];
  }

  // High complexity → GPT-4
  if (complexity > 0.8) {
    return AI_MODELS["gpt-4"];
  }

  // Medium complexity → Claude 3 Opus
  if (complexity > 0.5) {
    return AI_MODELS["claude-3-opus"];
  }

  // Default → Gemini Pro (fast & cheap)
  return AI_MODELS["gemini-pro"];
}

export function calculateCost(
  model: AIModelConfig,
  inputTokens: number,
  outputTokens: number
): number {
  const inputCost = inputTokens * model.costPerInputToken;
  const outputCost = outputTokens * model.costPerOutputToken;
  return inputCost + outputCost;
}
