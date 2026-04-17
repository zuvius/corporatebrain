// Load environment variables before any other imports
import { config } from "dotenv";
config();

// SAFETY: Prevent running in production
if (process.env.NODE_ENV === "production") {
  console.error("❌ ERROR: Database seeding is disabled in production!");
  console.error("   Seeding would create test data and hardcoded credentials.");
  console.error("   Use 'npm run db:migrate' instead for production deployments.");
  process.exit(1);
}

import { db } from "../../lib/db/client";
import { tenants, users, knowledgeSources, conversations, messages, integrations } from "../../lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

/**
 * Idempotent seed runner
 * Each seed checks if data exists before inserting
 */

async function seedTenants() {
  console.log("🌱 Seeding tenants...");
  
  const defaultTenant = {
    name: "Acme Corporation",
    slug: "acme",
    plan: "starter",
    settings: JSON.stringify({
      maxUsers: 10,
      maxStorage: 1073741824, // 1GB
      allowedModels: ["gpt-4", "claude-3", "gemini-pro"],
    }),
  };

  // Check if exists
  const existing = await db.query.tenants.findFirst({
    where: eq(tenants.slug, defaultTenant.slug),
  });

  if (existing) {
    console.log("  ⏭️  Tenant 'acme' already exists, skipping");
    return existing;
  }

  const [tenant] = await db.insert(tenants).values(defaultTenant).returning();
  console.log(`  ✅ Created tenant: ${tenant.name} (${tenant.id})`);
  return tenant;
}

async function seedUsers(tenantId: string) {
  console.log("🌱 Seeding users...");

  const adminUser = {
    tenantId,
    email: "admin@acme.com",
    name: "Admin User",
    password: await bcrypt.hash("password123", 10),
    role: "admin",
    emailVerified: new Date(),
  };

  const memberUser = {
    tenantId,
    email: "member@acme.com",
    name: "Team Member",
    password: await bcrypt.hash("password123", 10),
    role: "member",
    emailVerified: new Date(),
  };

  const usersToSeed = [adminUser, memberUser];
  const createdUsers = [];

  for (const userData of usersToSeed) {
    const existing = await db.query.users.findFirst({
      where: eq(users.email, userData.email),
    });

    if (existing) {
      console.log(`  ⏭️  User ${userData.email} already exists, skipping`);
      createdUsers.push(existing);
      continue;
    }

    const [user] = await db.insert(users).values(userData).returning();
    console.log(`  ✅ Created user: ${user.email} (${user.role})`);
    createdUsers.push(user);
  }

  return createdUsers;
}

async function seedKnowledgeSources(tenantId: string) {
  console.log("🌱 Seeding knowledge sources...");

  const sampleDocs = [
    {
      tenantId,
      type: "pdf",
      source: "upload",
      title: "Employee Handbook 2024",
      content: "Welcome to Acme Corporation. This handbook outlines our policies, benefits, and procedures...",
      metadata: JSON.stringify({
        fileName: "handbook.pdf",
        fileSize: 2457600,
        pages: 24,
        author: "HR Department",
      }),
      status: "processed",
      chunkIndex: 0,
      totalChunks: 1,
      tokenCount: 450,
    },
    {
      tenantId,
      type: "docx",
      source: "upload",
      title: "Q1 Sales Report",
      content: "Q1 2024 Sales Performance: Revenue increased by 23% compared to Q1 2023...",
      metadata: JSON.stringify({
        fileName: "q1-sales.docx",
        fileSize: 1024000,
        author: "Sales Team",
      }),
      status: "processed",
      chunkIndex: 0,
      totalChunks: 1,
      tokenCount: 320,
    },
    {
      tenantId,
      type: "txt",
      source: "slack",
      title: "Project Phoenix Discussion",
      content: "John: When is the Project Phoenix deadline?\nSarah: The deadline is March 15th...",
      metadata: JSON.stringify({
        channel: "#project-phoenix",
        date: "2024-01-15",
        participants: ["john", "sarah"],
      }),
      status: "processed",
      chunkIndex: 0,
      totalChunks: 1,
      tokenCount: 180,
    },
  ];

  const createdDocs = [];

  for (const docData of sampleDocs) {
    const existing = await db.query.knowledgeSources.findFirst({
      where: eq(knowledgeSources.title, docData.title),
    });

    if (existing) {
      console.log(`  ⏭️  Document '${docData.title}' already exists, skipping`);
      createdDocs.push(existing);
      continue;
    }

    const [doc] = await db.insert(knowledgeSources).values(docData).returning();
    console.log(`  ✅ Created document: ${doc.title}`);
    createdDocs.push(doc);
  }

  return createdDocs;
}

async function seedConversations(tenantId: string, userId: string) {
  console.log("🌱 Seeding conversations...");

  const sampleConversation = {
    tenantId,
    userId,
    title: "Welcome to Corporate Brain",
    model: "gpt-4",
    totalTokens: 450,
    totalCost: 0.012,
    isActive: true,
  };

  // Check if conversation exists
  const existing = await db.query.conversations.findFirst({
    where: eq(conversations.title, sampleConversation.title),
  });

  if (existing) {
    console.log(`  ⏭️  Conversation '${sampleConversation.title}' already exists, skipping`);
    return existing;
  }

  const [conversation] = await db
    .insert(conversations)
    .values(sampleConversation)
    .returning();

  console.log(`  ✅ Created conversation: ${conversation.title}`);

  // Add messages
  const messagesToSeed = [
    {
      conversationId: conversation.id,
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
      conversationId: conversation.id,
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
    const [message] = await db.insert(messages).values(messageData).returning();
    console.log(`    ✅ Added message: ${message.role} (${message.totalTokens} tokens)`);
  }

  return conversation;
}

async function seedIntegrations(tenantId: string) {
  console.log("🌱 Seeding integrations...");

  const sampleIntegrations = [
    {
      tenantId,
      provider: "slack",
      status: "disconnected",
      settings: JSON.stringify({ channels: ["#general", "#engineering"] }),
    },
    {
      tenantId,
      provider: "google-drive",
      status: "disconnected",
      settings: JSON.stringify({ folders: ["Company Docs", "Engineering"] }),
    },
    {
      tenantId,
      provider: "notion",
      status: "disconnected",
      settings: JSON.stringify({ pages: ["Wiki", "Projects"] }),
    },
  ];

  for (const integrationData of sampleIntegrations) {
    const existing = await db.query.integrations.findFirst({
      where: eq(integrations.provider, integrationData.provider),
    });

    if (existing) {
      console.log(`  ⏭️  Integration '${integrationData.provider}' already exists, skipping`);
      continue;
    }

    const [integration] = await db
      .insert(integrations)
      .values(integrationData)
      .returning();
    console.log(`  ✅ Created integration: ${integration.provider}`);
  }
}

async function main() {
  console.log("\n🚀 Starting database seed...\n");

  try {
    // Seed in order (respects foreign keys)
    const tenant = await seedTenants();
    const usersList = await seedUsers(tenant.id);
    await seedKnowledgeSources(tenant.id);
    await seedConversations(tenant.id, usersList[0].id);
    await seedIntegrations(tenant.id);

    console.log("\n✅ Seed completed successfully!");
    console.log("\n📋 Sample credentials:");
    console.log("  Admin: admin@acme.com / password123");
    console.log("  Member: member@acme.com / password123");
    console.log("  Tenant: acme");
    console.log("");
  } catch (error) {
    console.error("\n❌ Seed failed:", error);
    process.exit(1);
  }

  process.exit(0);
}

main();
