import { db } from "../../lib/db/client";
import { users } from "../../lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

/**
 * Seed: Users
 * Creates default admin and member users for a tenant
 * Idempotent - checks before insert, skips if exists
 */

export interface SeedUser {
  email: string;
  name: string;
  password: string;
  role: "admin" | "member";
  emailVerified: Date;
}

export async function seedUsers(tenantId: string) {
  console.log("🌱 [seed-users] Starting...");

  const usersToSeed: SeedUser[] = [
    {
      email: "admin@acme.com",
      name: "Admin User",
      password: await bcrypt.hash("password123", 10),
      role: "admin",
      emailVerified: new Date(),
    },
    {
      email: "member@acme.com",
      name: "Team Member",
      password: await bcrypt.hash("password123", 10),
      role: "member",
      emailVerified: new Date(),
    },
  ];

  const createdUsers = [];

  for (const userData of usersToSeed) {
    try {
      // Idempotent check - query by unique email
      const existing = await db.query.users.findFirst({
        where: eq(users.email, userData.email),
      });

      if (existing) {
        console.log(`  ⏭️  User ${userData.email} already exists, skipping`);
        createdUsers.push(existing);
        continue;
      }

      // Insert with tenant association
      const [user] = await db.insert(users).values({
        tenantId,
        email: userData.email,
        name: userData.name,
        password: userData.password,
        role: userData.role,
        emailVerified: userData.emailVerified,
      }).returning();

      console.log(`  ✅ Created user: ${user.email} (${user.role})`);
      createdUsers.push(user);
    } catch (error) {
      console.error(`  ❌ Failed to seed user ${userData.email}:`, error);
      // Continue with other users - never crash
    }
  }

  console.log(`🌱 [seed-users] Completed: ${createdUsers.length} users ready`);
  return createdUsers;
}

export default seedUsers;
