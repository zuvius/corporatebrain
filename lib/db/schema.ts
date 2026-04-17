import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  jsonb,
  index,
  boolean,
  integer,
  real,
  vector,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Tenants - Multi-tenancy
export const tenants = pgTable("tenants", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  plan: varchar("plan", { length: 50 }).default("starter").notNull(),
  settings: jsonb("settings").default("{}").notNull(),
  totalCost: real("total_cost").default(0),
  // Onboarding fields
  onboardingStep: integer("onboarding_step").default(1).notNull(),
  onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
  teamSize: varchar("team_size", { length: 50 }),
  useCase: varchar("use_case", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tenantsRelations = relations(tenants, ({ many }) => ({
  users: many(users),
  knowledgeSources: many(knowledgeSources),
  conversations: many(conversations),
  integrations: many(integrations),
}));

// Users
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .references(() => tenants.id, { onDelete: "cascade" })
      .notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }),
    password: varchar("password", { length: 255 }),
    role: varchar("role", { length: 50 }).default("member").notNull(),
    emailVerified: timestamp("email_verified"),
    image: varchar("image", { length: 500 }),
    lastLoginAt: timestamp("last_login_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    tenantEmailIdx: index("tenant_email_idx").on(table.tenantId, table.email),
  }),
);

export const usersRelations = relations(users, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [users.tenantId],
    references: [tenants.id],
  }),
  conversations: many(conversations),
  auditLogs: many(auditLogs),
}));

// Verification Tokens (for email verification, password reset)
export const verificationTokens = pgTable(
  "verification_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    type: varchar("type", { length: 50 }).notNull(),
    expires: timestamp("expires").notNull(),
    attempts: integer("attempts").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    identifierIdx: index("identifier_idx").on(table.identifier),
    tokenIdx: index("token_idx").on(table.token),
  }),
);

// Knowledge Sources (Documents, Chunks)
export const knowledgeSources = pgTable(
  "knowledge_sources",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .references(() => tenants.id, { onDelete: "cascade" })
      .notNull(),
    type: varchar("type", { length: 50 }).notNull(),
    source: varchar("source", { length: 100 }).notNull(),
    contentHash: varchar("content_hash", { length: 64 }), // SHA-256 hash for duplicate detection
    title: varchar("title", { length: 500 }),
    content: text("content"),
    metadata: jsonb("metadata").default("{}").notNull(),
    status: varchar("status", { length: 50 }).default("pending").notNull(),
    errorMessage: text("error_message"),
    vectorId: varchar("vector_id", { length: 255 }),
    chunkIndex: integer("chunk_index").default(0),
    totalChunks: integer("total_chunks").default(1),
    tokenCount: integer("token_count"),
    embedding: vector("embedding", { dimensions: 1536 }),
    processedAt: timestamp("processed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    tenantIdx: index("ks_tenant_idx").on(table.tenantId),
    statusIdx: index("ks_status_idx").on(table.status),
    sourceIdx: index("ks_source_idx").on(table.tenantId, table.source),
    hashIdx: index("ks_hash_idx").on(table.tenantId, table.contentHash), // For duplicate detection
    vectorIdx: index("ks_vector_idx").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  }),
);

export const knowledgeSourcesRelations = relations(
  knowledgeSources,
  ({ one, many }) => ({
    tenant: one(tenants, {
      fields: [knowledgeSources.tenantId],
      references: [tenants.id],
    }),
    citations: many(citations),
  }),
);

// Conversations (Chat Sessions)
export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .references(() => tenants.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    title: varchar("title", { length: 255 }),
    model: varchar("model", { length: 100 }),
    totalTokens: integer("total_tokens").default(0),
    totalCost: real("total_cost").default(0),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    tenantUserIdx: index("conv_tenant_user_idx").on(
      table.tenantId,
      table.userId,
    ),
    createdAtIdx: index("conv_created_idx").on(table.createdAt),
  }),
);

export const conversationsRelations = relations(
  conversations,
  ({ one, many }) => ({
    tenant: one(tenants, {
      fields: [conversations.tenantId],
      references: [tenants.id],
    }),
    user: one(users, {
      fields: [conversations.userId],
      references: [users.id],
    }),
    messages: many(messages),
  }),
);

// Messages (Individual chat messages)
export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id")
      .references(() => conversations.id, { onDelete: "cascade" })
      .notNull(),
    role: varchar("role", { length: 50 }).notNull(),
    content: text("content").notNull(),
    model: varchar("model", { length: 100 }),
    promptTokens: integer("prompt_tokens"),
    completionTokens: integer("completion_tokens"),
    totalTokens: integer("total_tokens"),
    cost: real("cost"),
    latency: integer("latency"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    conversationIdx: index("msg_conversation_idx").on(table.conversationId),
    createdAtIdx: index("msg_created_idx").on(table.createdAt),
  }),
);

export const messagesRelations = relations(messages, ({ one, many }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  citations: many(citations),
}));

// Citations (Links between messages and sources)
export const citations = pgTable(
  "citations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    messageId: uuid("message_id")
      .references(() => messages.id, { onDelete: "cascade" })
      .notNull(),
    sourceId: uuid("source_id")
      .references(() => knowledgeSources.id, { onDelete: "cascade" })
      .notNull(),
    relevanceScore: real("relevance_score"),
    excerpt: text("excerpt"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    messageIdx: index("cite_message_idx").on(table.messageId),
    sourceIdx: index("cite_source_idx").on(table.sourceId),
  }),
);

export const citationsRelations = relations(citations, ({ one }) => ({
  message: one(messages, {
    fields: [citations.messageId],
    references: [messages.id],
  }),
  source: one(knowledgeSources, {
    fields: [citations.sourceId],
    references: [knowledgeSources.id],
  }),
}));

// Integrations (OAuth connections)
export const integrations = pgTable(
  "integrations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .references(() => tenants.id, { onDelete: "cascade" })
      .notNull(),
    provider: varchar("provider", { length: 50 }).notNull(),
    status: varchar("status", { length: 50 }).default("disconnected").notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    tokenExpiresAt: timestamp("token_expires_at"),
    scopes: text("scopes"),
    settings: jsonb("settings").default("{}").notNull(),
    lastSyncedAt: timestamp("last_synced_at"),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    tenantProviderIdx: index("int_tenant_provider_idx").on(
      table.tenantId,
      table.provider,
    ),
  }),
);

export const integrationsRelations = relations(integrations, ({ one }) => ({
  tenant: one(tenants, {
    fields: [integrations.tenantId],
    references: [tenants.id],
  }),
}));

// Audit Logs (Security logging)
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").references(() => tenants.id, {
      onDelete: "cascade",
    }),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    action: varchar("action", { length: 100 }).notNull(),
    resource: varchar("resource", { length: 100 }).notNull(),
    resourceId: varchar("resource_id", { length: 255 }),
    details: jsonb("details").default("{}").notNull(),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    tenantIdx: index("audit_tenant_idx").on(table.tenantId),
    userIdx: index("audit_user_idx").on(table.userId),
    actionIdx: index("audit_action_idx").on(table.action),
    createdAtIdx: index("audit_created_idx").on(table.createdAt),
  }),
);

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  tenant: one(tenants, {
    fields: [auditLogs.tenantId],
    references: [tenants.id],
  }),
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

// Usage Logs (AI cost tracking)
export const usageLogs = pgTable(
  "usage_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .references(() => tenants.id, { onDelete: "cascade" })
      .notNull(),
    conversationId: uuid("conversation_id").references(() => conversations.id, {
      onDelete: "set null",
    }),
    model: varchar("model", { length: 100 }).notNull(),
    provider: varchar("provider", { length: 50 }).notNull(),
    promptTokens: integer("prompt_tokens").notNull(),
    completionTokens: integer("completion_tokens").notNull(),
    totalTokens: integer("total_tokens").notNull(),
    cost: real("cost").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    tenantIdx: index("usage_tenant_idx").on(table.tenantId),
    modelIdx: index("usage_model_idx").on(table.model),
    createdAtIdx: index("usage_created_idx").on(table.createdAt),
  }),
);

export const usageLogsRelations = relations(usageLogs, ({ one }) => ({
  tenant: one(tenants, {
    fields: [usageLogs.tenantId],
    references: [tenants.id],
  }),
  conversation: one(conversations, {
    fields: [usageLogs.conversationId],
    references: [conversations.id],
  }),
}));

// Type exports
export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type VerificationToken = typeof verificationTokens.$inferSelect;
export type NewVerificationToken = typeof verificationTokens.$inferInsert;
export type KnowledgeSource = typeof knowledgeSources.$inferSelect;
export type NewKnowledgeSource = typeof knowledgeSources.$inferInsert;
export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type Citation = typeof citations.$inferSelect;
export type NewCitation = typeof citations.$inferInsert;
export type Integration = typeof integrations.$inferSelect;
export type NewIntegration = typeof integrations.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
export type UsageLog = typeof usageLogs.$inferSelect;
export type NewUsageLog = typeof usageLogs.$inferInsert;
