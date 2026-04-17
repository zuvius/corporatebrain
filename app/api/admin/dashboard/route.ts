import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import {
  integrations,
  usageLogs,
  knowledgeSources,
  conversations,
} from "@/lib/db/schema";
import { eq, gte, sql, and, desc } from "drizzle-orm";

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin (simplified check - would need proper role check in production)
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
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get usage stats
    const [usageStats] = await db
      .select({
        totalCost: sql<number>`COALESCE(SUM(${usageLogs.cost}), 0)`,
        totalTokens: sql<number>`COALESCE(SUM(${usageLogs.totalTokens}), 0)`,
        totalQueries: sql<number>`COUNT(*)`,
      })
      .from(usageLogs)
      .where(
        and(
          eq(usageLogs.tenantId, tenantId),
          gte(usageLogs.createdAt, thirtyDaysAgo),
        ),
      );

    // Get active integrations count
    const [integrationsCount] = await db
      .select({
        total: sql<number>`COUNT(*)`,
        active: sql<number>`SUM(CASE WHEN ${integrations.status} = 'active' THEN 1 ELSE 0 END)`,
      })
      .from(integrations)
      .where(eq(integrations.tenantId, tenantId));

    // Get knowledge sources stats
    const [knowledgeStats] = await db
      .select({
        total: sql<number>`COUNT(*)`,
        indexed: sql<number>`SUM(CASE WHEN ${knowledgeSources.status} = 'indexed' THEN 1 ELSE 0 END)`,
        processing: sql<number>`SUM(CASE WHEN ${knowledgeSources.status} = 'processing' THEN 1 ELSE 0 END)`,
      })
      .from(knowledgeSources)
      .where(eq(knowledgeSources.tenantId, tenantId));

    // Get conversation stats
    const [conversationStats] = await db
      .select({
        total: sql<number>`COUNT(*)`,
        thisWeek: sql<number>`SUM(CASE WHEN ${conversations.updatedAt} >= ${sevenDaysAgo} THEN 1 ELSE 0 END)`,
      })
      .from(conversations)
      .where(eq(conversations.tenantId, tenantId));

    // Get daily usage for chart (last 7 days)
    const dailyUsage = await db
      .select({
        date: sql<string>`DATE(${usageLogs.createdAt})`,
        cost: sql<number>`COALESCE(SUM(${usageLogs.cost}), 0)`,
        tokens: sql<number>`COALESCE(SUM(${usageLogs.totalTokens}), 0)`,
      })
      .from(usageLogs)
      .where(
        and(
          eq(usageLogs.tenantId, tenantId),
          gte(usageLogs.createdAt, sevenDaysAgo),
        ),
      )
      .groupBy(sql`DATE(${usageLogs.createdAt})`)
      .orderBy(desc(sql`DATE(${usageLogs.createdAt})`));

    // Get model breakdown
    const modelBreakdown = await db
      .select({
        model: usageLogs.model,
        cost: sql<number>`COALESCE(SUM(${usageLogs.cost}), 0)`,
        tokens: sql<number>`COALESCE(SUM(${usageLogs.totalTokens}), 0)`,
        queries: sql<number>`COUNT(*)`,
      })
      .from(usageLogs)
      .where(
        and(
          eq(usageLogs.tenantId, tenantId),
          gte(usageLogs.createdAt, thirtyDaysAgo),
        ),
      )
      .groupBy(usageLogs.model);

    return NextResponse.json({
      overview: {
        totalCost: usageStats?.totalCost || 0,
        totalTokens: usageStats?.totalTokens || 0,
        totalQueries: usageStats?.totalQueries || 0,
        integrationsTotal: integrationsCount?.total || 0,
        integrationsActive: integrationsCount?.active || 0,
        knowledgeSourcesTotal: knowledgeStats?.total || 0,
        knowledgeSourcesIndexed: knowledgeStats?.indexed || 0,
        conversationsTotal: conversationStats?.total || 0,
        conversationsThisWeek: conversationStats?.thisWeek || 0,
      },
      dailyUsage,
      modelBreakdown,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 },
    );
  }
}
