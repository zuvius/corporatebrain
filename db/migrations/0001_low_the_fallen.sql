ALTER TABLE "knowledge_sources" ADD COLUMN "content_hash" varchar(64);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ks_hash_idx" ON "knowledge_sources" USING btree ("tenant_id","content_hash");