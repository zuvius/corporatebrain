import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { getKnowledgeSourcesByTenant, getConversationsByUser } from "@/lib/db/queries";
import { AppClientWrapper } from "@/components/app/app-client-wrapper";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user as any;

  if (!user?.tenantId) {
    redirect("/auth/signin");
  }

  const [dbSources, dbConversations] = await Promise.all([
    getKnowledgeSourcesByTenant(user.tenantId, 10),
    getConversationsByUser(user.id, user.tenantId),
  ]);

  // Map DB types to component types
  const sources = dbSources.map(s => ({
    ...s,
    name: s.title || s.source || "Untitled",
    type: (s.type === "file" || s.type === "url" || s.type === "crawl" ? s.type : "file") as "file" | "url" | "crawl",
    status: (s.status === "processing" || s.status === "ready" || s.status === "error" ? s.status : "processing") as "processing" | "ready" | "error",
  }));

  const conversations = dbConversations.map(c => ({
    ...c,
    title: c.title || "Untitled Conversation",
  }));

  return (
    <AppClientWrapper
      sources={sources}
      conversations={conversations}
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        tenantId: user.tenantId,
        role: user.role,
        image: user.image,
      }}
      tenantId={user.tenantId}
    >
      {children}
    </AppClientWrapper>
  );
}
