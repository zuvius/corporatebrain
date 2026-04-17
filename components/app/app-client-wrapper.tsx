"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChatInterface } from "./chat-interface";
import { KnowledgeSidebar } from "./knowledge-sidebar";
import { UploadModal } from "./upload-modal";
import { UrlIngestModal } from "./url-ingest-modal";
import { Upload, Link2 } from "lucide-react";

interface KnowledgeSource {
  id: string;
  name: string;
  type: "file" | "url" | "crawl";
  status: "processing" | "ready" | "error";
  createdAt: Date;
}

interface Conversation {
  id: string;
  title: string;
  updatedAt: Date;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  tenantId: string;
  role?: string;
  image?: string | null;
}

interface AppClientWrapperProps {
  sources: KnowledgeSource[];
  conversations: Conversation[];
  user: User;
  tenantId: string;
  children: React.ReactNode;
}

export function AppClientWrapper({ sources, conversations, user, tenantId, children }: AppClientWrapperProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(undefined);
  const [localSources, setLocalSources] = useState(sources);
  const pathname = usePathname();
  const router = useRouter();

  const handleUploadComplete = () => {
    router.refresh();
  };

  const handleUrlSuccess = () => {
    router.refresh();
  };

  const handleSourceDeleted = (sourceId: string) => {
    setLocalSources(prev => prev.filter(s => s.id !== sourceId));
    router.refresh();
  };

  const handleAddSourceClick = () => {
    setShowAddMenu(true);
  };

  const handleConversationClick = (conversationId: string) => {
    setActiveConversationId(conversationId);
    window.location.href = "/app";
  };

  const handleNewChat = () => {
    setActiveConversationId(undefined);
    window.location.href = "/app";
  };

  const isChatPage = pathname === "/app" || pathname === "/app/";

  return (
    <div className="flex h-screen">
      <KnowledgeSidebar 
        sources={localSources} 
        conversations={conversations}
        user={user}
        currentPath={pathname}
        onAddSourceClick={handleAddSourceClick}
        onConversationClick={handleConversationClick}
        onNewChat={handleNewChat}
        onSourceDeleted={handleSourceDeleted}
        activeConversationId={activeConversationId}
      />

      {/* Add Source Menu */}
      {showAddMenu && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setShowAddMenu(false)}
        >
          <div 
            className="absolute top-20 left-4 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-2 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Add Knowledge Source
            </p>
            <button
              onClick={() => {
                setShowAddMenu(false);
                setIsUploadModalOpen(true);
              }}
              className="w-full px-3 py-2.5 flex items-center gap-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Upload className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Upload Files</p>
                <p className="text-xs text-gray-500">PDF, DOCX, TXT</p>
              </div>
            </button>
            <button
              onClick={() => {
                setShowAddMenu(false);
                setIsUrlModalOpen(true);
              }}
              className="w-full px-3 py-2.5 flex items-center gap-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <div className="p-1.5 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                <Link2 className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Add URL</p>
                <p className="text-xs text-gray-500">Scrape website via Firecrawl</p>
              </div>
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-hidden">
        {isChatPage ? (
          <ChatInterface 
            tenantId={tenantId} 
            initialConversationId={activeConversationId}
          />
        ) : (
          <div className="h-full overflow-auto">
            {children}
          </div>
        )}
      </main>
      
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
        tenantId={tenantId}
      />

      <UrlIngestModal
        isOpen={isUrlModalOpen}
        onClose={() => setIsUrlModalOpen(false)}
        onSuccess={handleUrlSuccess}
      />
    </div>
  );
}
