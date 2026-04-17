import { auth } from "@/lib/auth/auth";
import { generateEmbeddings, selectModel, buildSystemPrompt } from "@/lib/ai";
import {
  searchSimilarDocuments,
  createMessage,
  createConversation,
  updateConversation,
  createCitation,
} from "@/lib/db/queries";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

const querySchema = z.object({
  message: z.string().min(1),
  conversationId: z.string().uuid().optional(),
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = querySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { message, conversationId } = parsed.data;
    const tenantId = session.user.tenantId;
    const userId = session.user.id;

    // Get or create conversation
    let conversation;
    if (conversationId) {
      const existing = await getConversationById(conversationId);
      if (existing && existing.tenantId === tenantId) {
        conversation = existing;
      }
    }

    if (!conversation) {
      conversation = await createConversation({
        tenantId,
        userId,
        title: message.slice(0, 50) + (message.length > 50 ? "..." : ""),
        isActive: true,
      });
    }

    // Save user message
    await createMessage({
      conversationId: conversation.id,
      role: "user",
      content: message,
    });

    // Search for relevant context
    const queryEmbedding = await generateEmbeddings(message);
    const relevantDocs = await searchSimilarDocuments(
      tenantId,
      queryEmbedding,
      5,
    );

    // Build context from relevant documents
    const context = relevantDocs
      .map((doc: any) => `Source: ${doc.title}\n${doc.content}`)
      .join("\n\n---\n\n");

    // Select model based on context complexity
    const model = selectModel(message, context);

    // Build system prompt
    const systemPrompt = buildSystemPrompt(context);

    // Call AI
    const startTime = Date.now();
    const response = await openai.chat.completions.create({
      model: model.id,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });
    const latency = Date.now() - startTime;

    const aiContent = response.choices[0]?.message?.content || "No response";
    const tokens = response.usage || {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    };

    // Save AI response
    const aiMessage = await createMessage({
      conversationId: conversation.id,
      role: "assistant",
      content: aiContent,
      model: model.id,
      promptTokens: tokens.prompt_tokens,
      completionTokens: tokens.completion_tokens,
      totalTokens: tokens.total_tokens,
      latency,
    });

    // Create citations for sources
    for (const doc of relevantDocs as Array<{
      id: string;
      distance: number;
      content: string;
    }>) {
      await createCitation({
        messageId: aiMessage.id,
        sourceId: doc.id,
        relevanceScore: 1 - doc.distance,
        excerpt: doc.content.slice(0, 200),
      });
    }

    // Update conversation
    await updateConversation(conversation.id, {
      totalTokens: (conversation.totalTokens || 0) + tokens.total_tokens,
    });

    return NextResponse.json({
      success: true,
      data: {
        message: aiMessage,
        conversationId: conversation.id,
        citations: relevantDocs.map((doc: any) => ({
          id: doc.id,
          title: doc.title,
          relevance: 1 - doc.distance,
        })),
      },
    });
  } catch (error) {
    console.error("Query error:", error);
    return NextResponse.json(
      { error: "Failed to process query" },
      { status: 500 },
    );
  }
}

async function getConversationById(id: string) {
  // Import dynamically to avoid circular dependency
  const { getConversationById: getConv } = await import("@/lib/db/queries");
  return getConv(id);
}
