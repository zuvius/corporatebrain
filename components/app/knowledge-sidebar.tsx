"use client";

import { useState } from "react";
import { Database, MessageSquare, ChevronDown, Plus, FileText, Link2, Globe, LayoutDashboard, Settings, Trash2, RefreshCw, Puzzle, Network, HelpCircle, User } from "lucide-react";
import Link from "next/link";
import { ConfirmDialog, ToastContainer, useToast } from "@/components/ui/premium-dialog";

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
}

interface KnowledgeSidebarProps {
  sources: KnowledgeSource[];
  conversations: Conversation[];
  user: User;
  currentPath?: string;
  onAddSourceClick?: () => void;
  onConversationClick?: (conversationId: string) => void;
  onNewChat?: () => void;
  onSourceDeleted?: (sourceId: string) => void;
  activeConversationId?: string;
}

export function KnowledgeSidebar({ 
  sources, 
  conversations, 
  user, 
  currentPath = "/app", 
  onAddSourceClick,
  onConversationClick,
  onNewChat,
  onSourceDeleted,
  activeConversationId
}: KnowledgeSidebarProps) {
  const isAdmin = user.role === "admin";
  const [activeTab, setActiveTab] = useState<"sources" | "chat">("sources");
  const [expandedSections, setExpandedSections] = useState({
    sources: true,
    recent: true,
  });
  
  // Premium dialog state
  const { toasts, addToast, removeToast } = useToast();
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    sourceId: string | null;
    sourceName: string;
  }>({ isOpen: false, sourceId: null, sourceName: "" });
  const [isDeleting, setIsDeleting] = useState(false);
  const [, setIsReindexing] = useState<string | null>(null);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <aside className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">CB</span>
          </div>
          <span className="font-semibold text-gray-900">Corporate Brain</span>
        </div>
        
        {/* User info */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100">
          <div className="h-6 w-6 rounded-full bg-violet-100 flex items-center justify-center">
            <span className="text-violet-600 text-xs font-semibold">
              {user.name?.[0] || user.email[0].toUpperCase()}
            </span>
          </div>
          <span className="text-sm text-gray-700 truncate">{user.name || user.email}</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("sources")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
            activeTab === "sources" 
              ? "text-violet-600 border-b-2 border-violet-600 bg-violet-50" 
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Database className="h-4 w-4" />
          Sources
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
            activeTab === "chat" 
              ? "text-violet-600 border-b-2 border-violet-600 bg-violet-50" 
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          Chat History
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "sources" ? (
          <div className="p-4">
            {/* Knowledge Sources Section */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection("sources")}
                className="flex items-center justify-between w-full text-sm font-medium text-gray-700 mb-2"
              >
                <span>Knowledge Sources ({sources.length})</span>
                <ChevronDown 
                  className={`h-4 w-4 transition-transform ${expandedSections.sources ? "" : "-rotate-90"}`}
                />
              </button>
              
              {expandedSections.sources && (
                <div className="space-y-2">
                  {sources.length === 0 ? (
                    <div className="text-center py-6 px-4 bg-gray-100 rounded-lg">
                      <Database className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No knowledge sources yet</p>
                      <button 
                        onClick={onAddSourceClick}
                        className="mt-3 flex items-center gap-1 text-sm text-violet-600 hover:text-violet-700 mx-auto"
                      >
                        <Plus className="h-4 w-4" />
                        Add your first source
                      </button>
                    </div>
                  ) : (
                    sources.map(source => (
                      <SourceItem 
                        key={source.id} 
                        source={source} 
                        onDelete={() => {
                          setConfirmDialog({
                            isOpen: true,
                            sourceId: source.id,
                            sourceName: source.name,
                          });
                        }}
                        onReindex={async () => {
                          setIsReindexing(source.id);
                          try {
                            const res = await fetch(`/api/knowledge-sources/${source.id}`, { 
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ action: 'reindex' })
                            });
                            if (res.ok) {
                              addToast({
                                type: 'success',
                                title: 'Reindexing started',
                                message: `"${source.name}" is being reindexed.`,
                                duration: 4000,
                              });
                              // Don't reload - let the status update via polling
                            } else {
                              throw new Error('Failed to reindex');
                            }
                          } catch (e) {
                            addToast({
                              type: 'error',
                              title: 'Reindex failed',
                              message: `Could not reindex "${source.name}". Please try again.`,
                              duration: 5000,
                            });
                          } finally {
                            setIsReindexing(null);
                          }
                        }}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4">
            {/* Chat History Section */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection("recent")}
                className="flex items-center justify-between w-full text-sm font-medium text-gray-700 mb-2"
              >
                <span>Recent Conversations ({conversations.length})</span>
                <ChevronDown 
                  className={`h-4 w-4 transition-transform ${expandedSections.recent ? "" : "-rotate-90"}`}
                />
              </button>
              
              {expandedSections.recent && (
                <div className="space-y-1">
                  {conversations.length === 0 ? (
                    <div className="text-center py-6 px-4 bg-gray-100 rounded-lg">
                      <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No conversations yet</p>
                      <p className="text-xs text-gray-400 mt-1">Start chatting to see history</p>
                    </div>
                  ) : (
                    conversations.map(conversation => (
                      <div 
                        key={conversation.id} 
                        onClick={() => onConversationClick?.(conversation.id)}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                          activeConversationId === conversation.id
                            ? "bg-violet-100 text-violet-900"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <MessageSquare className={`h-4 w-4 ${activeConversationId === conversation.id ? "text-violet-600" : "text-gray-400"}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${activeConversationId === conversation.id ? "text-violet-900" : "text-gray-900"}`}>
                            {conversation.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(conversation.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Member Navigation - Available to all users */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Tools</p>
        <nav className="space-y-1">
          <Link
            href="/app/integrations"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              currentPath.startsWith("/app/integrations")
                ? "bg-violet-100 text-violet-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Puzzle className="h-4 w-4" />
            Integrations
          </Link>
          <Link
            href="/app/context-map"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              currentPath.startsWith("/app/context-map")
                ? "bg-violet-100 text-violet-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Network className="h-4 w-4" />
            Context Map
          </Link>
          <Link
            href="/app/settings"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              currentPath.startsWith("/app/settings")
                ? "bg-violet-100 text-violet-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <User className="h-4 w-4" />
            Profile & Settings
          </Link>
          <Link
            href="/app/help"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              currentPath.startsWith("/app/help")
                ? "bg-violet-100 text-violet-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            Help & Support
          </Link>
        </nav>
      </div>

      {/* Admin Navigation - Only for admins */}
      {isAdmin && (
        <div className="p-4 border-t border-gray-200 bg-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Admin</p>
          <nav className="space-y-1">
            <Link
              href="/admin"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                currentPath.startsWith("/admin")
                  ? "bg-violet-100 text-violet-700"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin Dashboard
            </Link>
            <Link
              href="/admin/users"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                currentPath.startsWith("/admin/users")
                  ? "bg-violet-100 text-violet-700"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Settings className="h-4 w-4" />
              User Management
            </Link>
          </nav>
        </div>
      )}

      {/* New Chat Button */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <button 
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </button>
      </div>

      {/* Premium Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Knowledge Source"
        message={`Are you sure you want to delete "${confirmDialog.sourceName}"? This action cannot be undone.`}
        type="danger"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={isDeleting}
        onConfirm={async () => {
          if (!confirmDialog.sourceId) return;
          setIsDeleting(true);
          try {
            const res = await fetch(`/api/knowledge-sources/${confirmDialog.sourceId}`, { 
              method: 'DELETE' 
            });
            if (res.ok) {
              addToast({
                type: 'success',
                title: 'Source deleted',
                message: `"${confirmDialog.sourceName}" has been removed.`,
                duration: 4000,
              });
              // Call the callback to update local state without full reload
              if (confirmDialog.sourceId) {
                onSourceDeleted?.(confirmDialog.sourceId);
              }
            } else {
              throw new Error('Failed to delete');
            }
          } catch (e) {
            addToast({
              type: 'error',
              title: 'Delete failed',
              message: `Could not delete "${confirmDialog.sourceName}". Please try again.`,
              duration: 5000,
            });
          } finally {
            setIsDeleting(false);
            setConfirmDialog({ isOpen: false, sourceId: null, sourceName: "" });
          }
        }}
        onCancel={() => setConfirmDialog({ isOpen: false, sourceId: null, sourceName: "" })}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </aside>
  );
}

// Source Item Component with actions
interface SourceItemProps {
  source: KnowledgeSource;
  onDelete: () => void;
  onReindex: () => void;
}

function SourceItem({ source, onDelete, onReindex }: SourceItemProps) {
  const [showActions, setShowActions] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const getSourceIcon = (type: string) => {
    switch (type) {
      case "file": return <FileText className="h-4 w-4" />;
      case "url": return <Link2 className="h-4 w-4" />;
      case "crawl": return <Globe className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready": return "bg-emerald-500";
      case "processing": return "bg-amber-500 animate-pulse";
      case "error": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div 
      className="group flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="text-gray-500">{getSourceIcon(source.type)}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{source.name}</p>
        <p className="text-xs text-gray-500">{source.type}</p>
      </div>
      <div className="flex items-center gap-1">
        <div className={`h-2 w-2 rounded-full ${getStatusColor(source.status)}`} />
        
        {/* Action Menu with Premium Tooltips */}
        {showActions && source.status !== "processing" && (
          <div className="flex items-center gap-1">
            {/* Reindex Button with Tooltip */}
            <div className="relative">
              <button
                onClick={onReindex}
                onMouseEnter={() => setActiveTooltip('reindex')}
                onMouseLeave={() => setActiveTooltip(null)}
                className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-100 dark:hover:bg-violet-900/30 rounded-lg transition-all duration-200 hover:scale-110"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              {activeTooltip === 'reindex' && (
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-800 text-white text-xs font-medium rounded-lg shadow-xl whitespace-nowrap z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-1.5">
                    <RefreshCw className="h-3 w-3" />
                    Reindex document
                  </div>
                  <div className="absolute top-1/2 left-full -translate-y-1/2 border-4 border-transparent border-l-gray-900 dark:border-l-gray-800" />
                </div>
              )}
            </div>

            {/* Delete Button with Tooltip */}
            <div className="relative">
              <button
                onClick={onDelete}
                onMouseEnter={() => setActiveTooltip('delete')}
                onMouseLeave={() => setActiveTooltip(null)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200 hover:scale-110"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              {activeTooltip === 'delete' && (
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-800 text-white text-xs font-medium rounded-lg shadow-xl whitespace-nowrap z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-1.5">
                    <Trash2 className="h-3 w-3" />
                    Delete source
                  </div>
                  <div className="absolute top-1/2 left-full -translate-y-1/2 border-4 border-transparent border-l-gray-900 dark:border-l-gray-800" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
