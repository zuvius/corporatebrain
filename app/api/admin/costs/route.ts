import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import { usageLogs } from "@/lib/db/schema";
import { eq, gte, sql, and, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin =
      session.user.role === "admin" || session.user.role === "owner";
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    const tenantId = session.user.tenantId;
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "30");
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Get detailed cost breakdown
    const costBreakdown = await db
      .select({
        date: sql<string>`DATE(${usageLogs.createdAt})`,
        model: usageLogs.model,
        provider: usageLogs.provider,
        cost: sql<number>`COALESCE(SUM(${usageLogs.cost}), 0)`,
        promptTokens: sql<number>`COALESCE(SUM(${usageLogs.promptTokens}), 0)`,
        completionTokens: sql<number>`COALESCE(SUM(${usageLogs.completionTokens}), 0)`,
        totalTokens: sql<number>`COALESCE(SUM(${usageLogs.totalTokens}), 0)`,
        queryCount: sql<number>`COUNT(*)`,
      })
      .from(usageLogs)
      .where(
        and(
          eq(usageLogs.tenantId, tenantId),
          gte(usageLogs.createdAt, startDate),
        ),
      )
      .groupBy(
        sql`DATE(${usageLogs.createdAt})`,
        usageLogs.model,
        usageLogs.provider,
      )
      .orderBy(desc(sql`DATE(${usageLogs.createdAt})`));

    // Get provider totals
    const providerTotals = await db
      .select({
        provider: usageLogs.provider,
        totalCost: sql<number>`COALESCE(SUM(${usageLogs.cost}), 0)`,
        totalTokens: sql<number>`COALESCE(SUM(${usageLogs.totalTokens}), 0)`,
        queryCount: sql<number>`COUNT(*)`,
      })
      .from(usageLogs)
      .where(
        and(
          eq(usageLogs.tenantId, tenantId),
          gte(usageLogs.createdAt, startDate),
        ),
      )
      .groupBy(usageLogs.provider);

    // Get model totals
    const modelTotals = await db
      .select({
        model: usageLogs.model,
        totalCost: sql<number>`COALESCE(SUM(${usageLogs.cost}), 0)`,
        totalTokens: sql<number>`COALESCE(SUM(${usageLogs.totalTokens}), 0)`,
        queryCount: sql<number>`COUNT(*)`,
      })
      .from(usageLogs)
      .where(
        and(
          eq(usageLogs.tenantId, tenantId),
          gte(usageLogs.createdAt, startDate),
        ),
      )
      .groupBy(usageLogs.model)
      .orderBy(desc(sql`COALESCE(SUM(${usageLogs.cost}), 0)`));

    // Calculate projected monthly cost
    const [currentPeriod] = await db
      .select({
        totalCost: sql<number>`COALESCE(SUM(${usageLogs.cost}), 0)`,
      })
      .from(usageLogs)
      .where(
        and(
          eq(usageLogs.tenantId, tenantId),
          gte(usageLogs.createdAt, startDate),
        ),
      );

    const dailyAverage = (currentPeriod?.totalCost || 0) / days;
    const projectedMonthly = dailyAverage * 30;
    const projectedYearly = dailyAverage * 365;

    // Cost per query metrics
    const [queryMetrics] = await db
      .select({
        totalQueries: sql<number>`COUNT(*)`,
        avgCostPerQuery: sql<number>`COALESCE(AVG(${usageLogs.cost}), 0)`,
        avgTokensPerQuery: sql<number>`COALESCE(AVG(${usageLogs.totalTokens}), 0)`,
      })
      .from(usageLogs)
      .where(
        and(
          eq(usageLogs.tenantId, tenantId),
          gte(usageLogs.createdAt, startDate),
        ),
      );

    return NextResponse.json({
      summary: {
        period: {
          days,
          startDate: startDate.toISOString(),
          endDate: new Date().toISOString(),
        },
        totalCost: currentPeriod?.totalCost || 0,
        dailyAverage: Math.round(dailyAverage * 100) / 100,
        projectedMonthly: Math.round(projectedMonthly * 100) / 100,
        projectedYearly: Math.round(projectedYearly * 100) / 100,
        queryMetrics: {
          totalQueries: queryMetrics?.totalQueries || 0,
          avgCostPerQuery:
            Math.round((queryMetrics?.avgCostPerQuery || 0) * 1000) / 1000,
          avgTokensPerQuery: Math.round(queryMetrics?.avgTokensPerQuery || 0),
        },
      },
      providerTotals,
      modelTotals,
      dailyBreakdown: costBreakdown,
    });
  } catch (error) {
    console.error("Cost analysis error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cost data" },
      { status: 500 },
    );
  }
}
