import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { verificationTokens, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Invalid verification link" },
        { status: 400 },
      );
    }

    // Find token
    const verificationToken = await db.query.verificationTokens.findFirst({
      where: and(
        eq(verificationTokens.token, token),
        eq(verificationTokens.type, "email_verification"),
      ),
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid or expired verification link" },
        { status: 400 },
      );
    }

    // Check if expired
    if (new Date() > new Date(verificationToken.expires)) {
      return NextResponse.json(
        { error: "Verification link has expired. Please request a new one." },
        { status: 400 },
      );
    }

    // Find user by email (identifier)
    const user = await db.query.users.findFirst({
      where: eq(users.email, verificationToken.identifier),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already verified
    if (user.emailVerified) {
      // Clean up token anyway
      await db
        .delete(verificationTokens)
        .where(eq(verificationTokens.id, verificationToken.id));

      return NextResponse.json({
        success: true,
        alreadyVerified: true,
        message: "Your email is already verified! Redirecting to app...",
        redirectTo: "/app",
      });
    }

    // Mark email as verified
    await db
      .update(users)
      .set({ emailVerified: new Date() })
      .where(eq(users.id, user.id));

    // Delete used token
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.id, verificationToken.id));

    return NextResponse.json({
      success: true,
      message: "Email verified successfully! You now have full access.",
      redirectTo: "/app",
    });
  } catch (error) {
    console.error("[Verify Email] Error:", error);
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 },
    );
  }
}
