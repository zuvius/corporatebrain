import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { users, tenants, verificationTokens } from "@/lib/db/schema";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { signIn } from "@/lib/auth/auth";

// Simple slugify function
function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const result = signupSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    // Generate tenant name from user's name
    const tenantName = `${name}'s Workspace`;
    const tenantSlug = `${slugify(name)}-${Math.random().toString(36).substring(2, 8)}`;

    // Check if email already exists (globally)
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create tenant (workspace)
    const [tenant] = await db
      .insert(tenants)
      .values({
        name: tenantName,
        slug: tenantSlug,
        plan: "starter",
        settings: {},
        onboardingStep: 1,
        onboardingCompleted: false,
      })
      .returning();

    // Generate verification token
    const verificationToken = randomBytes(32).toString("hex");
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create user with tenantId - email NOT verified
    const [user] = await db
      .insert(users)
      .values({
        tenantId: tenant.id,
        email,
        name,
        password: hashedPassword,
        role: "admin", // First user is admin
        emailVerified: null, // Unverified until they click email link
      })
      .returning();

    // Save verification token
    await db.insert(verificationTokens).values({
      identifier: email,
      token: verificationToken,
      type: "email_verification",
      expires: tokenExpires,
      attempts: 0,
    });

    // TODO: Send verification email
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verifyUrl = `${baseUrl}/api/auth/verify?token=${verificationToken}`;
    console.log("[Signup] Verification URL:", verifyUrl);

    // Auto-sign in the user
    try {
      await signIn("credentials", {
        email,
        password,
        tenantSlug: tenant.slug,
        redirect: false,
      });
    } catch (signInError) {
      console.error("Auto-signin failed:", signInError);
      // Continue anyway - user created successfully
    }

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          tenantId: tenant.id,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Signup] Error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
