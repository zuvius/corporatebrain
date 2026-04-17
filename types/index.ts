export * from "../lib/db/schema";

import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      tenantId: string;
      email: string;
      emailVerified: Date | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    tenantId: string;
  }

  interface JWT {
    role?: string;
    tenantId?: string;
  }
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: "admin" | "member";
  tenantId: string;
  image?: string;
}

export interface Conversation {
  id: string;
  tenantId: string;
  userId: string;
  title: string;
  model?: string;
  totalTokens: number;
  totalCost: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  messages?: Message[];
}

export interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  model?: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  cost?: number;
  latency?: number;
  createdAt: Date;
  citations?: Citation[];
}

export interface Citation {
  id: string;
  messageId: string;
  sourceId: string;
  source: KnowledgeSource;
  relevanceScore?: number;
  excerpt?: string;
}

export interface KnowledgeSource {
  id: string;
  tenantId: string;
  type: "pdf" | "docx" | "txt" | "url" | "slack" | "drive" | "notion";
  source: string;
  title?: string;
  content?: string;
  metadata: Record<string, any>;
  status: "pending" | "processing" | "processed" | "error";
  chunkIndex: number;
  totalChunks: number;
  createdAt: Date;
}

export interface Integration {
  id: string;
  tenantId: string;
  provider:
    | "slack"
    | "google-drive"
    | "notion"
    | "teams"
    | "zoom"
    | "gmail"
    | "github"
    | "salesforce";
  status: "connected" | "disconnected" | "error";
  settings: Record<string, any>;
  lastSyncedAt?: Date;
  createdAt: Date;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: "starter" | "pro" | "enterprise";
  settings: Record<string, any>;
  totalCost: number;
  createdAt: Date;
}
