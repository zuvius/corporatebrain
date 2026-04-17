import { auth } from "./auth";

export interface TeaserLimits {
  maxIntegrations: number;
  allowedProviders: string[];
  maxDocumentsPerIntegration: number;
  maxDaysHistory: number;
  maxAIQuestions: number;
  canExport: boolean;
  canInvite: boolean;
  canWrite: boolean;
}

export interface VerificationResult {
  isVerified: boolean;
  isTeaserMode: boolean;
  email: string;
  error?: string;
  limits: TeaserLimits;
}

// Teaser mode limits for unverified users
export const TEASER_LIMITS: TeaserLimits = {
  maxIntegrations: 3,
  allowedProviders: ["notion", "gdrive", "confluence"], // Read-only safe providers
  maxDocumentsPerIntegration: 10,
  maxDaysHistory: 7,
  maxAIQuestions: 1,
  canExport: false,
  canInvite: false,
  canWrite: false,
};

export const FULL_ACCESS_LIMITS: TeaserLimits = {
  maxIntegrations: 10,
  allowedProviders: [
    "slack",
    "gdrive",
    "notion",
    "teams",
    "github",
    "confluence",
  ],
  maxDocumentsPerIntegration: 1000,
  maxDaysHistory: 365,
  maxAIQuestions: Infinity,
  canExport: true,
  canInvite: true,
  canWrite: true,
};

export async function requireVerification(
  requireFullAccess = true,
): Promise<VerificationResult> {
  const session = await auth();

  if (!session?.user) {
    return {
      isVerified: false,
      isTeaserMode: false,
      email: "",
      error: "Unauthorized",
      limits: TEASER_LIMITS,
    };
  }

  const isVerified = !!session.user.emailVerified;

  if (!isVerified) {
    return {
      isVerified: false,
      isTeaserMode: true,
      email: session.user.email,
      error: requireFullAccess
        ? "Email verification required. Please verify your email to access this feature."
        : undefined,
      limits: TEASER_LIMITS,
    };
  }

  return {
    isVerified: true,
    isTeaserMode: false,
    email: session.user.email,
    limits: FULL_ACCESS_LIMITS,
  };
}

export function getVerificationStatus(
  session: { user?: { email?: string; emailVerified?: Date | null } } | null,
  requireFullAccess = true,
): VerificationResult {
  if (!session?.user) {
    return {
      isVerified: false,
      isTeaserMode: false,
      email: "",
      error: "Unauthorized",
      limits: TEASER_LIMITS,
    };
  }

  const { email, emailVerified } = session.user;
  const isVerified = !!emailVerified;

  if (!isVerified) {
    return {
      isVerified: false,
      isTeaserMode: true,
      email: email || "",
      error: requireFullAccess ? "Email verification required" : undefined,
      limits: TEASER_LIMITS,
    };
  }

  return {
    isVerified: true,
    isTeaserMode: false,
    email: email || "",
    limits: FULL_ACCESS_LIMITS,
  };
}

export function canConnectIntegration(
  isVerified: boolean,
  currentIntegrationCount: number,
  provider: string,
): { allowed: boolean; reason?: string } {
  if (isVerified) {
    if (currentIntegrationCount >= FULL_ACCESS_LIMITS.maxIntegrations) {
      return { allowed: false, reason: "Integration limit reached" };
    }
    return { allowed: true };
  }

  // Teaser mode checks
  if (currentIntegrationCount >= TEASER_LIMITS.maxIntegrations) {
    return {
      allowed: false,
      reason: `Teaser mode: Maximum ${TEASER_LIMITS.maxIntegrations} integrations allowed. Verify email to connect more.`,
    };
  }

  if (!TEASER_LIMITS.allowedProviders.includes(provider)) {
    return {
      allowed: false,
      reason: `Teaser mode: ${provider} not available. Verify email to connect ${provider}.`,
    };
  }

  return { allowed: true };
}
