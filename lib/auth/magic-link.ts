import { generateRandomString } from "../utils/crypto";
import { db } from "@/lib/db/client";
import { verificationTokens } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";

const TOKEN_EXPIRY_MINUTES = 15;

export async function createMagicLink(email: string, tenantSlug: string = "default") {
  // Generate 6-digit code
  const token = generateRandomString(6, "0123456789");
  
  // Hash the identifier (email)
  const identifier = await hashIdentifier(email);
  
  // Calculate expiry
  const expires = new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000);
  
  // Delete any existing tokens for this email
  await db.delete(verificationTokens)
    .where(eq(verificationTokens.identifier, identifier));
  
  // Store hashed token
  await db.insert(verificationTokens).values({
    identifier,
    token: await hashToken(token),
    type: "magic_link",
    expires,
    attempts: 0,
  });
  
  return {
    token,
    email,
    tenantSlug,
    expires,
  };
}

export async function verifyMagicLink(email: string, token: string) {
  const identifier = await hashIdentifier(email);
  
  // Find token
  const [storedToken] = await db
    .select()
    .from(verificationTokens)
    .where(
      and(
        eq(verificationTokens.identifier, identifier),
        eq(verificationTokens.type, "magic_link"),
        gt(verificationTokens.expires, new Date())
      )
    )
    .limit(1);
  
  if (!storedToken) {
    return { valid: false, error: "Token not found or expired" };
  }
  
  // Check attempts
  if (storedToken.attempts >= 3) {
    await db.delete(verificationTokens)
      .where(eq(verificationTokens.id, storedToken.id));
    return { valid: false, error: "Too many attempts. Please request a new code." };
  }
  
  // Verify token (constant-time comparison)
  const tokenMatch = await verifyToken(token, storedToken.token);
  
  if (!tokenMatch) {
    // Increment attempts
    await db
      .update(verificationTokens)
      .set({ attempts: storedToken.attempts + 1 })
      .where(eq(verificationTokens.id, storedToken.id));
    
    return { 
      valid: false, 
      error: `Invalid code. ${2 - storedToken.attempts} attempts remaining.` 
    };
  }
  
  // Token valid - delete it
  await db.delete(verificationTokens)
    .where(eq(verificationTokens.id, storedToken.id));
  
  return { valid: true, email };
}

async function hashIdentifier(email: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(email.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyToken(input: string, hashed: string): Promise<boolean> {
  const inputHash = await hashToken(input);
  // Constant-time comparison
  if (inputHash.length !== hashed.length) return false;
  let result = 0;
  for (let i = 0; i < inputHash.length; i++) {
    result |= inputHash.charCodeAt(i) ^ hashed.charCodeAt(i);
  }
  return result === 0;
}
