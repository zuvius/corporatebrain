import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const dbUrl =
  process.env.DATABASE_URL ||
  "postgresql://corp_brain:corpbrain123@localhost:5432/corporate_brain";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl,
  },
  verbose: true,
  strict: true,
});
