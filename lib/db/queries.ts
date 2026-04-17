import { db } from "./client";
import { eq, and, desc, sql } from "drizzle-orm";
import * as schema from "./schema";

// Tenant queries
export async function getTenantBySlug(slug: string) {
  return db.query.tenants.findFirst({
    where: eq(schema.tenants.slug, slug),
  });
}

export async function getTenantById(id: string) {
  return db.query.tenants.findFirst({
    where: eq(schema.tenants.id, id),
    with: {
      users: true,
      knowledgeSources: {
        limit: 10,
        orderBy: desc(schema.knowledgeSources.createdAt),
      },
    },
  });
}

export async function createTenant(data: schema.NewTenant) {
  const [tenant] = await db.insert(schema.tenants).values(data).returning();
  return tenant;
}

// User queries
export async function getUserByEmail(email: string, tenantId: string) {
  return db.query.users.findFirst({
    where: and(
      eq(schema.users.email, email),
      eq(schema.users.tenantId, tenantId)
    ),
  });
}

export async function getUserById(id: string) {
  return db.query.users.findFirst({
    where: eq(schema.users.id, id),
    with: {
      tenant: true,
    },
  });
}

export async function createUser(data: schema.NewUser) {
  const [user] = await db.insert(schema.users).values(data).returning();
  return user;
}

export async function updateUser(id: string, data: Partial<schema.NewUser>) {
  const [user] = await db
    .update(schema.users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.users.id, id))
    .returning();
  return user;
}

// Knowledge source queries
export async function getKnowledgeSourcesByTenant(tenantId: string, limit = 100) {
  return db.query.knowledgeSources.findMany({
    where: eq(schema.knowledgeSources.tenantId, tenantId),
    limit,
    orderBy: desc(schema.knowledgeSources.createdAt),
  });
}

export async function createKnowledgeSource(data: schema.NewKnowledgeSource) {
  const [source] = await db.insert(schema.knowledgeSources).values(data).returning();
  return source;
}

export async function updateKnowledgeSource(
  id: string,
  data: Partial<schema.NewKnowledgeSource>
) {
  const [source] = await db
    .update(schema.knowledgeSources)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.knowledgeSources.id, id))
    .returning();
  return source;
}

// Vector search
export async function searchSimilarDocuments(
  tenantId: string,
  embedding: number[],
  limit = 5,
  threshold = 0.3
) {
  const results = await db.execute(sql`
    SELECT 
      ks.*,
      (ks.embedding <=> ${JSON.stringify(embedding)}::vector) as distance
    FROM knowledge_sources ks
    WHERE ks.tenant_id = ${tenantId}
      AND ks.status = 'processed'
      AND (ks.embedding <=> ${JSON.stringify(embedding)}::vector) < ${threshold}
    ORDER BY ks.embedding <=> ${JSON.stringify(embedding)}::vector
    LIMIT ${limit}
  `);
  return results.rows;
}

// Conversation queries
export async function getConversationsByUser(userId: string, tenantId: string) {
  return db.query.conversations.findMany({
    where: and(
      eq(schema.conversations.userId, userId),
      eq(schema.conversations.tenantId, tenantId)
    ),
    orderBy: desc(schema.conversations.updatedAt),
  });
}

export async function getConversationById(id: string) {
  return db.query.conversations.findFirst({
    where: eq(schema.conversations.id, id),
    with: {
      messages: {
        orderBy: schema.messages.createdAt,
      },
    },
  });
}

export async function createConversation(data: schema.NewConversation) {
  const [conversation] = await db
    .insert(schema.conversations)
    .values(data)
    .returning();
  return conversation;
}

export async function updateConversation(
  id: string,
  data: Partial<schema.NewConversation>
) {
  const [conversation] = await db
    .update(schema.conversations)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.conversations.id, id))
    .returning();
  return conversation;
}

// Message queries
export async function createMessage(data: schema.NewMessage) {
  const [message] = await db.insert(schema.messages).values(data).returning();
  return message;
}

export async function getMessagesByConversation(conversationId: string) {
  return db.query.messages.findMany({
    where: eq(schema.messages.conversationId, conversationId),
    orderBy: schema.messages.createdAt,
  });
}

// Citation queries
export async function createCitation(data: schema.NewCitation) {
  const [citation] = await db.insert(schema.citations).values(data).returning();
  return citation;
}

// Integration queries
export async function getIntegrationsByTenant(tenantId: string) {
  return db.query.integrations.findMany({
    where: eq(schema.integrations.tenantId, tenantId),
  });
}

export async function getIntegrationByProvider(tenantId: string, provider: string) {
  return db.query.integrations.findFirst({
    where: and(
      eq(schema.integrations.tenantId, tenantId),
      eq(schema.integrations.provider, provider)
    ),
  });
}

export async function createIntegration(data: schema.NewIntegration) {
  const [integration] = await db
    .insert(schema.integrations)
    .values(data)
    .returning();
  return integration;
}

export async function updateIntegration(
  id: string,
  data: Partial<schema.NewIntegration>
) {
  const [integration] = await db
    .update(schema.integrations)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.integrations.id, id))
    .returning();
  return integration;
}

// Audit log queries
export async function createAuditLog(data: schema.NewAuditLog) {
  const [log] = await db.insert(schema.auditLogs).values(data).returning();
  return log;
}

export async function getAuditLogsByTenant(tenantId: string, limit = 100) {
  return db.query.auditLogs.findMany({
    where: eq(schema.auditLogs.tenantId, tenantId),
    limit,
    orderBy: desc(schema.auditLogs.createdAt),
  });
}

// Verification token queries
export async function createVerificationToken(data: schema.NewVerificationToken) {
  const [token] = await db
    .insert(schema.verificationTokens)
    .values(data)
    .returning();
  return token;
}

export async function getVerificationToken(identifier: string, token: string) {
  return db.query.verificationTokens.findFirst({
    where: and(
      eq(schema.verificationTokens.identifier, identifier),
      eq(schema.verificationTokens.token, token)
    ),
  });
}

export async function deleteVerificationToken(id: string) {
  await db.delete(schema.verificationTokens).where(eq(schema.verificationTokens.id, id));
}
