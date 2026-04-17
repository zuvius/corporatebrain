import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import { verificationTokens, users } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { randomBytes } from "crypto";

const RATE_LIMIT_HOURS = 1;
const MAX_RESENDS_PER_DAY = 5;

export async function POST() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { id: string; email: string; emailVerified: string | null };

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json({ error: "Email already verified" }, { status: 400 });
    }

    // Rate limiting: Check recent resends
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentTokens = await db.query.verificationTokens.findMany({
      where: and(
        eq(verificationTokens.identifier, user.email),
        eq(verificationTokens.type, "email_verification"),
        gt(verificationTokens.createdAt, oneDayAgo)
      ),
    });

    if (recentTokens.length >= MAX_RESENDS_PER_DAY) {
      return NextResponse.json(
        { error: "Too many requests. Please try again tomorrow." },
        { status: 429 }
      );
    }

    // Check last resend time
    const lastHourAgo = new Date(Date.now() - RATE_LIMIT_HOURS * 60 * 60 * 1000);
    const recentToken = recentTokens.find(t => new Date(t.createdAt) > lastHourAgo);
    
    if (recentToken) {
      const minutesLeft = Math.ceil(
        (new Date(recentToken.createdAt).getTime() + RATE_LIMIT_HOURS * 60 * 60 * 1000 - Date.now()) / 60000
      );
      return NextResponse.json(
        { error: `Please wait ${minutesLeft} minutes before requesting another email.` },
        { status: 429 }
      );
    }

    // Generate new token
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Save token
    await db.insert(verificationTokens).values({
      identifier: user.email,
      token,
      type: "email_verification",
      expires,
      attempts: 0,
    });

    // TODO: Send email (implement email service)
    // For now, log the verification URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verifyUrl = `${baseUrl}/api/auth/verify?token=${token}`;
    console.log("[Email Verification] URL:", verifyUrl);

    return NextResponse.json({
      success: true,
      message: "Verification email sent. Please check your inbox.",
    });
  } catch (error) {
    console.error("[Resend Verification] Error:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
