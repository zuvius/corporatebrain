import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db/client";
import { getUserByEmail, getTenantBySlug, getUserById } from "@/lib/db/queries";
import bcrypt from "bcryptjs";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  tenantSlug: z.string().optional(),
});

export const authConfig: NextAuthConfig = {
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        tenantSlug: { label: "Tenant", type: "text" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password, tenantSlug } = parsed.data;

        // Look up tenant by slug to get tenant ID
        const effectiveTenantSlug = tenantSlug || "acme";
        const tenant = await getTenantBySlug(effectiveTenantSlug);
        if (!tenant) return null;

        // Query user with tenant ID (UUID)
        const user = await getUserByEmail(email, tenant.id);
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tenantId: user.tenantId,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as string;
        session.user.tenantId = token.tenantId as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.tenantId = user.tenantId;
      }

      if (token.sub && (!token.role || !token.tenantId)) {
        const dbUser = await getUserById(token.sub);

        if (dbUser) {
          token.role = dbUser.role;
          token.tenantId = dbUser.tenantId;
        }
      }

      return token;
    },
    async signIn({ user: _user, account, profile: _profile }) {
      // Allow OAuth sign-ins
      if (account?.provider !== "credentials") {
        return true;
      }
      return true;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};
