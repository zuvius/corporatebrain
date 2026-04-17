import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import { tenants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const workspaceSchema = z.object({
  name: z.string().min(1).max(255),
  teamSize: z.string().min(1),
  useCase: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { id: string; tenantId: string };
    const body = await req.json();
    
    const result = workspaceSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, teamSize, useCase } = result.data;

    await db
      .update(tenants)
      .set({
        name,
        teamSize,
        useCase,
        onboardingStep: 3,
        updatedAt: new Date(),
      })
      .where(eq(tenants.id, user.tenantId));

    return NextResponse.json({
      success: true,
      message: "Workspace settings saved",
      nextStep: 3,
    });
  } catch (error) {
    console.error("[Onboarding Workspace] Error:", error);
    return NextResponse.json(
      { error: "Failed to save workspace settings" },
      { status: 500 }
    );
  }
}
