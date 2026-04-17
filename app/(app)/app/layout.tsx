import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import {
  getKnowledgeSourcesByTenant,
  getConversationsByUser,
} from "@/lib/db/queries";
import { AppClientWrapper } from "@/components/app/app-client-wrapper";
import { VerificationBanner } from "@/components/verification-banner";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.tenantId) {
    redirect("/auth/signin");
  }

  const [dbSources, dbConversations] = await Promise.all([
    getKnowledgeSourcesByTenant(session.user.tenantId, 10),
    getConversationsByUser(session.user.id, session.user.tenantId),
  ]);

  // Map DB types to component types
  const sources = dbSources.map((s) => ({
    ...s,
    name: s.title || s.source || "Untitled",
    type: (s.type === "file" || s.type === "url" || s.type === "crawl"
      ? s.type
      : "file") as "file" | "url" | "crawl",
    status: (s.status === "processing" ||
    s.status === "ready" ||
    s.status === "error"
      ? s.status
      : "processing") as "processing" | "ready" | "error",
  }));

  const conversations = dbConversations.map((c) => ({
    ...c,
    title: c.title || "Untitled Conversation",
  }));

  const isVerified = !!session.user.emailVerified;

  return (
    <>
      {!isVerified && <VerificationBanner email={session.user.email} />}
      <AppClientWrapper
        sources={sources}
        conversations={conversations}
        user={{
          id: session.user.id,
          name: session.user.name ?? null,
          email: session.user.email,
          tenantId: session.user.tenantId,
          role: session.user.role,
          image: session.user.image,
        }}
        tenantId={session.user.tenantId}
        isVerified={isVerified}
      >
        {children}
      </AppClientWrapper>
    </>
  );
}
