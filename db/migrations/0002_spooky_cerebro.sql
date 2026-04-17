ALTER TABLE "tenants" ADD COLUMN "onboarding_step" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "onboarding_completed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "team_size" varchar(50);--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "use_case" varchar(100);