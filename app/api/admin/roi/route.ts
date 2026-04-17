import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import { usageLogs, knowledgeSources } from "@/lib/db/schema";
import { eq, gte, sql, and } from "drizzle-orm";

interface ROIMetrics {
  hoursSaved: number;
  costSaved: number;
  productivityGain: number;
  queriesResolved: number;
  estimatedValue: number;
  roi: number;
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin =
      session.user.role === "admin" ||
      session.user.role === "owner";
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

    // Get usage stats for the period
    const [usageStats] = await db
      .select({
        totalQueries: sql<number>`COUNT(*)`,
        totalCost: sql<number>`COALESCE(SUM(${usageLogs.cost}), 0)`,
      })
      .from(usageLogs)
      .where(
        and(
          eq(usageLogs.tenantId, tenantId),
          gte(usageLogs.createdAt, startDate),
        ),
      );

    // Calculate ROI metrics
    const queries = usageStats?.totalQueries || 0;
    const cost = usageStats?.totalCost || 0;

    // Assumptions for ROI calculation:
    // - Average time to find information manually: 15 minutes
    // - Average hourly rate: $50
    // - Corporate Brain query time: 1 minute
    const TIME_SAVED_PER_QUERY_MINUTES = 14; // 15 - 1
    const HOURLY_RATE = 50;

    const hoursSaved = (queries * TIME_SAVED_PER_QUERY_MINUTES) / 60;
    const costSaved = hoursSaved * HOURLY_RATE;
    const estimatedValue = costSaved;
    const roi = cost > 0 ? ((estimatedValue - cost) / cost) * 100 : 0;

    const metrics: ROIMetrics = {
      hoursSaved: Math.round(hoursSaved * 10) / 10,
      costSaved: Math.round(costSaved * 100) / 100,
      productivityGain: Math.round((hoursSaved / (days * 8)) * 100 * 10) / 10, // % of work week saved
      queriesResolved: queries,
      estimatedValue: Math.round(estimatedValue * 100) / 100,
      roi: Math.round(roi * 10) / 10,
    };

    // Calculate trends (compare to previous period)
    const previousStartDate = new Date(
      startDate.getTime() - days * 24 * 60 * 60 * 1000,
    );

    const [previousStats] = await db
      .select({
        totalQueries: sql<number>`COUNT(*)`,
      })
      .from(usageLogs)
      .where(
        and(
          eq(usageLogs.tenantId, tenantId),
          gte(usageLogs.createdAt, previousStartDate),
          sql`${usageLogs.createdAt} < ${startDate}`,
        ),
      );

    const currentQueries = usageStats?.totalQueries || 0;
    const previousQueries = previousStats?.totalQueries || 0;
    const growthRate =
      previousQueries > 0
        ? ((currentQueries - previousQueries) / previousQueries) * 100
        : 0;

    // Knowledge base growth
    const dailyGrowth = await db
      .select({
        date: sql<string>`DATE(${knowledgeSources.createdAt})`,
        count: sql<number>`COUNT(*)`,
      })
      .from(knowledgeSources)
      .where(
        and(
          eq(knowledgeSources.tenantId, tenantId),
          gte(knowledgeSources.createdAt, startDate),
        ),
      )
      .groupBy(sql`DATE(${knowledgeSources.createdAt})`)
      .orderBy(sql`DATE(${knowledgeSources.createdAt})`);

    return NextResponse.json({
      metrics,
      period: {
        days,
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
      },
      trends: {
        queryGrowth: Math.round(growthRate * 10) / 10,
        previousPeriodQueries: previousQueries,
        currentPeriodQueries: currentQueries,
      },
      knowledgeGrowth: dailyGrowth,
      assumptions: {
        timeSavedPerQueryMinutes: TIME_SAVED_PER_QUERY_MINUTES,
        hourlyRate: HOURLY_RATE,
      },
    });
  } catch (error) {
    console.error("ROI calculation error:", error);
    return NextResponse.json(
      { error: "Failed to calculate ROI" },
      { status: 500 },
    );
  }
}
