import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { 
      id: string; 
      email: string; 
      emailVerified: string | null;
      name: string;
    };

    const isVerified = !!user.emailVerified;

    return NextResponse.json({
      isVerified,
      email: user.email,
      verifiedAt: user.emailVerified,
      features: {
        canChat: isVerified,
        canIntegrate: isVerified,
        canInvite: isVerified,
        canAccessAdmin: isVerified,
        canExport: isVerified,
      },
      previewFeatures: {
        canViewDashboard: true,
        canBrowseIntegrations: true,
        canSeeSampleResponses: !isVerified, // Only for unverified
      },
    });
  } catch (error) {
    console.error("[Verification Status] Error:", error);
    return NextResponse.json(
      { error: "Failed to check verification status" },
      { status: 500 }
    );
  }
}
