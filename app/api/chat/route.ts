import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import { messages, conversations, knowledgeSources } from "@/lib/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { routeAndGenerate, getModelForQuery } from "@/lib/ai/router";
import { generateEmbeddings } from "@/lib/ai/client";
import { buildSystemPrompt } from "@/lib/ai/client";
import { requireVerification, TEASER_LIMITS } from "@/lib/auth/verification";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { 
      id: string; 
      tenantId: string; 
      emailVerified: string | null;
      email: string;
    };
    const isVerified = !!user.emailVerified;

    const body = await req.json();
    const { conversationId, message, tenantId } = body;

    const effectiveTenantId = tenantId || user.tenantId;
    const userId = user.id;

    // Check teaser mode limits for unverified users
    let teaserModeUsed = false;
    if (!isVerified) {
      // Count user's existing conversations
      const userConversations = await db
        .select({ count: sql<number>`count(*)` })
        .from(conversations)
        .where(eq(conversations.userId, userId));
      
      const conversationCount = userConversations[0]?.count || 0;
      
      // If they already have conversations, they've used their free question
      if (conversationCount >= TEASER_LIMITS.maxAIQuestions) {
        return NextResponse.json(
          {
            error: "Teaser limit reached. You've used your free AI question.",
            code: "TEASER_LIMIT_REACHED",
            teaser: true,
            previewMessage: "Verify your email to ask unlimited questions.",
            verifyUrl: "/auth/resend-verification",
          },
          { status: 403 }
        );
      }
      
      teaserModeUsed = true;
    }

    // Get or create conversation
    let convId = conversationId;
    if (!convId) {
      const [newConv] = await db
        .insert(conversations)
        .values({
          tenantId: effectiveTenantId,
          userId: userId as string,
          title: message.slice(0, 50) + "...",
          model: "auto",
        })
        .returning({ id: conversations.id });
      convId = newConv.id;
    }

    // Store user message
    await db.insert(messages).values({
      conversationId: convId,
      role: "user",
      content: message,
    });

    // Retrieve conversation history
    const history = await db
      .select({
        role: messages.role,
        content: messages.content,
      })
      .from(messages)
      .where(eq(messages.conversationId, convId))
      .orderBy(desc(messages.createdAt))
      .limit(10);

    // Search relevant knowledge sources
    const queryEmbedding = await generateEmbeddings(message);
    const relevantSources = await db
      .select({
        id: knowledgeSources.id,
        title: knowledgeSources.title,
        content: knowledgeSources.content,
      })
      .from(knowledgeSources)
      .where(
        and(
          eq(knowledgeSources.tenantId, effectiveTenantId),
          eq(knowledgeSources.status, "indexed"),
          sql`embedding <-> ${queryEmbedding} < 0.3`
        )
      )
      .orderBy(sql`embedding <-> ${queryEmbedding}`)
      .limit(5);

    // Build context
    const context = relevantSources
      .map((s) => `Source: ${s.title}\n${s.content?.slice(0, 500)}`)
      .join("\n\n");

    const systemPrompt = buildSystemPrompt(context);

    // Prepare messages for AI
    const chatMessages = [
      { role: "system" as const, content: systemPrompt },
      ...history.reverse().map((h) => ({
        role: h.role as "user" | "assistant",
        content: h.content,
      })),
      { role: "user" as const, content: message },
    ];

    // Route and generate response
    const modelTier = getModelForQuery(message);
    const result = await routeAndGenerate(
      chatMessages,
      { tier: modelTier, task: "chat", requiresCitations: true },
      effectiveTenantId
    );

    // Store assistant response
    await db.insert(messages).values({
      conversationId: convId,
      role: "assistant",
      content: result.content,
      model: result.model.id,
      promptTokens: result.usage.promptTokens,
      completionTokens: result.usage.completionTokens,
      totalTokens: result.usage.totalTokens,
      cost: result.usage.cost,
    });

    return NextResponse.json({
      conversationId: convId,
      message: result.content,
      model: result.model.id,
      cost: result.usage.cost,
      tokens: result.usage.totalTokens,
      citations: relevantSources.map((s) => ({
        id: s.id,
        title: s.title,
      })),
      teaser: teaserModeUsed,
      ...(teaserModeUsed && {
        teaserMessage: "✨ You just experienced AI-powered search! Verify your email to ask unlimited questions and unlock all features.",
        remainingQuestions: 0,
        verifyUrl: "/auth/resend-verification",
      }),
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      // List user's conversations
      const convs = await db
        .select({
          id: conversations.id,
          title: conversations.title,
          model: conversations.model,
          createdAt: conversations.createdAt,
          updatedAt: conversations.updatedAt,
        })
        .from(conversations)
        .where(eq(conversations.userId, session.user.id as string))
        .orderBy(desc(conversations.updatedAt));

      return NextResponse.json({ conversations: convs });
    }

    // Get conversation messages
    const msgs = await db
      .select({
        id: messages.id,
        role: messages.role,
        content: messages.content,
        model: messages.model,
        createdAt: messages.createdAt,
      })
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);

    return NextResponse.json({ messages: msgs });
  } catch (error) {
    console.error("Get conversation error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve conversation" },
      { status: 500 }
    );
  }
}
