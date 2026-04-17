import { NextRequest, NextResponse } from "next/server";
import { createMagicLink } from "@/lib/auth/magic-link";
import { sendMagicLinkEmail } from "@/lib/email/send";
import { z } from "zod";

const requestSchema = z.object({
  email: z.string().email(),
  tenantSlug: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, tenantSlug } = requestSchema.parse(body);

    // Create magic link
    const magicLink = await createMagicLink(email, tenantSlug);

    // Send email
    await sendMagicLinkEmail({
      to: email,
      code: magicLink.token,
      tenantSlug: magicLink.tenantSlug,
    });

    return NextResponse.json({
      success: true,
      message: "Magic link sent to your email",
    });
  } catch (error) {
    console.error("Magic link creation failed:", error);

    // Don't reveal if email exists
    return NextResponse.json({
      success: true,
      message: "If an account exists, a magic link has been sent",
    });
  }
}
