import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import { tenants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { id: string; tenantId: string };

    await db
      .update(tenants)
      .set({
        onboardingCompleted: true,
        onboardingStep: 4,
        updatedAt: new Date(),
      })
      .where(eq(tenants.id, user.tenantId));

    return NextResponse.json({
      success: true,
      message: "Onboarding completed",
      redirectTo: "/app",
    });
  } catch (error) {
    console.error("[Onboarding Complete] Error:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 },
    );
  }
}
