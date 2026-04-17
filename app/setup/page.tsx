import { db } from "@/lib/db/client";
import { users, tenants } from "@/lib/db/schema";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

/**
 * First-run setup wizard
 * Only accessible when no users exist in the database
 * Creates the first admin user and default tenant
 */

async function getUserCount() {
  const count = await db.query.users.findMany({
    columns: { id: true },
    limit: 1,
  });
  return count.length;
}

async function setupAdmin(formData: FormData) {
  "use server";

  // Check if users already exist
  const existingUsers = await getUserCount();
  if (existingUsers > 0) {
    throw new Error("Setup already completed. Users already exist.");
  }

  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;
  const company = formData.get("company") as string;

  if (!email || !name || !password || !company) {
    throw new Error("All fields are required");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  // Create tenant
  const [tenant] = await db
    .insert(tenants)
    .values({
      name: company,
      slug: company.toLowerCase().replace(/\s+/g, "-"),
      plan: "starter",
      settings: JSON.stringify({
        maxUsers: 10,
        maxStorage: 1073741824,
        allowedModels: ["gpt-4", "claude-3", "gemini-pro"],
      }),
    })
    .returning();

  // Create admin user
  await db.insert(users).values({
    tenantId: tenant.id,
    email,
    name,
    password: await bcrypt.hash(password, 10),
    role: "admin",
    emailVerified: new Date(),
  });

  revalidatePath("/setup");
  redirect("/auth/signin");
}

export default async function SetupPage() {
  // Check if setup is already done
  const userCount = await getUserCount();

  if (userCount > 0) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h1 className="text-3xl font-bold text-center">🧠 Corporate Brain</h1>
          <h2 className="mt-6 text-center text-xl font-semibold text-gray-900">
            Initial Setup
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create your admin account to get started
          </p>
        </div>

        <form action={setupAdmin} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-gray-700"
              >
                Company Name
              </label>
              <input
                id="company"
                name="company"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Acme Corporation"
              />
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Admin Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="admin@yourcompany.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password (min 8 characters)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Admin Account
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            This page is only accessible when no users exist. After setup, it
            will redirect to the main application.
          </p>
        </div>
      </div>
    </div>
  );
}
