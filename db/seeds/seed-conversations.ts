import { db } from "../../lib/db/client";
import { conversations, messages } from "../../lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Seed: Conversations
 * Creates sample conversation with messages
 * Idempotent - checks before insert, skips if exists
 */

export interface SeedMessage {
  role: "user" | "assistant";
  content: string;
  model: string | null;
  promptTokens: number;
  completionTokens: number | null;
  totalTokens: number;
  cost: number | null;
  latency: number | null;
}

export async function seedConversations(tenantId: string, userId: string) {
  console.log("🌱 [seed-conversations] Starting...");

  const conversationData = {
    tenantId,
    userId,
    title: "Welcome to Corporate Brain",
    model: "gpt-4",
    totalTokens: 450,
    totalCost: 0.012,
    isActive: true,
  };

  try {
    // Idempotent check
    const existing = await db.query.conversations.findFirst({
      where: eq(conversations.title, conversationData.title),
    });

    let conversation;
    if (existing) {
      console.log(`  ⏭️  Conversation '${conversationData.title}' already exists, skipping`);
      conversation = existing;
    } else {
      [conversation] = await db.insert(conversations).values(conversationData).returning();
      console.log(`  ✅ Created conversation: ${conversation.title}`);
    }

    // Seed messages
    const messagesToSeed: SeedMessage[] = [
      {
        role: "user",
        content: "What is our company's vacation policy?",
        model: null,
        promptTokens: 12,
        completionTokens: null,
        totalTokens: 12,
        cost: null,
        latency: null,
      },
      {
        role: "assistant",
        content: "According to the Employee Handbook 2024, Acme Corporation offers:\n\n- 15 days of paid time off per year for full-time employees\n- 10 days of sick leave\n- 11 paid holidays\n- Unlimited mental health days (with manager approval)\n\nPTO accrues monthly and can be rolled over up to 5 days per year.",
        model: "gpt-4",
        promptTokens: 12,
        completionTokens: 78,
        totalTokens: 90,
        cost: 0.012,
        latency: 1250,
      },
    ];

    for (const messageData of messagesToSeed) {
      try {
        // Check if message exists (by content hash or similar unique field)
        const existingMessage = await db.query.messages.findFirst({
          where: eq(messages.content, messageData.content),
        });

        if (existingMessage) {
          console.log(`    ⏭️  Message already exists, skipping`);
          continue;
        }

        await db.insert(messages).values({
          conversationId: conversation.id,
          ...messageData,
        });
        console.log(`    ✅ Added message: ${messageData.role} (${messageData.totalTokens} tokens)`);
      } catch (error) {
        console.error(`    ❌ Failed to add message:`, error);
        // Continue with other messages
      }
    }

    console.log(`🌱 [seed-conversations] Completed`);
    return conversation;
  } catch (error) {
    console.error(`  ❌ Failed to seed conversation:`, error);
    throw error;
  }
}

export default seedConversations;
