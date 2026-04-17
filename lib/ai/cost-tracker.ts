import { db } from "@/lib/db/client";
import { usageLogs } from "@/lib/db/schema";

// Model pricing in dollars per 1K tokens
const MODEL_PRICING: Record<string, { prompt: number; completion: number }> = {
  "gpt-4": { prompt: 0.03, completion: 0.06 },
  "gpt-4-turbo": { prompt: 0.01, completion: 0.03 },
  "gpt-3.5-turbo": { prompt: 0.0005, completion: 0.0015 },
  "claude-3-opus": { prompt: 0.015, completion: 0.075 },
  "claude-3-sonnet": { prompt: 0.003, completion: 0.015 },
};

export function calculateCost(
  model: string,
  promptTokens: number,
  completionTokens: number,
): number {
  const pricing = MODEL_PRICING[model];
  if (!pricing) {
    return 0;
  }

  const promptCost = (promptTokens / 1000) * pricing.prompt;
  const completionCost = (completionTokens / 1000) * pricing.completion;

  return parseFloat((promptCost + completionCost).toFixed(4));
}

interface UsageEvent {
  tenantId: string;
  model: string;
  provider: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
  timestamp: Date;
  conversationId?: string;
}

export async function trackUsage(event: UsageEvent): Promise<void> {
  try {
    await db.insert(usageLogs).values({
      tenantId: event.tenantId,
      model: event.model,
      provider: event.provider,
      promptTokens: event.promptTokens,
      completionTokens: event.completionTokens,
      totalTokens: event.totalTokens,
      cost: event.cost,
      conversationId: event.conversationId,
      createdAt: event.timestamp,
    });

    console.log(
      `[Cost] ${event.model}: $${event.cost.toFixed(4)} | ` +
        `${event.totalTokens} tokens | Tenant: ${event.tenantId.slice(0, 8)}`,
    );
  } catch (error) {
    console.error("Failed to track usage:", error);
    // Don't throw - tracking failures shouldn't break the chat
  }
}

export async function getTenantUsageStats(
  tenantId: string,
  startDate: Date,
  endDate: Date,
) {
  // Aggregate usage by model
  const stats = await db.query.usageLogs.findMany({
    where: (logs, { and, eq, gte, lte }) =>
      and(
        eq(logs.tenantId, tenantId),
        gte(logs.createdAt, startDate),
        lte(logs.createdAt, endDate),
      ),
  });

  interface ModelStats {
    cost: number;
    tokens: number;
    queries: number;
  }

  interface AggregatedStats {
    totalCost: number;
    totalTokens: number;
    queryCount: number;
    byModel: Record<string, ModelStats>;
  }

  const initialStats: AggregatedStats = {
    totalCost: 0,
    totalTokens: 0,
    queryCount: 0,
    byModel: {},
  };

  const aggregated = stats.reduce(
    (acc: AggregatedStats, log: (typeof stats)[0]) => {
      acc.totalCost += log.cost;
      acc.totalTokens += log.totalTokens;
      acc.queryCount += 1;

      if (!acc.byModel[log.model]) {
        acc.byModel[log.model] = {
          cost: 0,
          tokens: 0,
          queries: 0,
        };
      }
      acc.byModel[log.model].cost += log.cost;
      acc.byModel[log.model].tokens += log.totalTokens;
      acc.byModel[log.model].queries += 1;

      return acc;
    },
    initialStats,
  );

  return aggregated;
}
