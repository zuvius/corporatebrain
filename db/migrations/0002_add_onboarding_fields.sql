-- Add onboarding fields to tenants table
ALTER TABLE "tenants" 
  ADD COLUMN IF NOT EXISTS "onboarding_step" INTEGER DEFAULT 1 NOT NULL,
  ADD COLUMN IF NOT EXISTS "onboarding_completed" BOOLEAN DEFAULT FALSE NOT NULL,
  ADD COLUMN IF NOT EXISTS "team_size" VARCHAR(50),
  ADD COLUMN IF NOT EXISTS "use_case" VARCHAR(100);
