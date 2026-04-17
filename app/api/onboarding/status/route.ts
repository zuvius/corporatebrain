import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import { tenants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { id: string; tenantId: string };

    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.id, user.tenantId),
      columns: {
        id: true,
        name: true,
        onboardingStep: true,
        onboardingCompleted: true,
        teamSize: true,
        useCase: true,
      },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    return NextResponse.json({
      onboardingStep: tenant.onboardingStep,
      onboardingCompleted: tenant.onboardingCompleted,
      workspace: {
        name: tenant.name,
        teamSize: tenant.teamSize,
        useCase: tenant.useCase,
      },
    });
  } catch (error) {
    console.error("[Onboarding Status] Error:", error);
    return NextResponse.json(
      { error: "Failed to get onboarding status" },
      { status: 500 },
    );
  }
}
