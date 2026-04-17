"use client";

import { useEffect, useState } from "react";
import { IntegrationCard } from "@/components/integrations/integration-card";
import { UploadModal } from "@/components/app/upload-modal";
import { Link2, Puzzle } from "lucide-react";

interface Integration {
  id: string;
  provider: string;
  status: "connected" | "disconnected" | "error";
  lastSyncedAt?: string;
}

const INTEGRATION_CONFIGS: Record<
  string,
  { name: string; description: string }
> = {
  slack: {
    name: "Slack",
    description: "Sync messages and files from your Slack workspaces",
  },
  google_drive: {
    name: "Google Drive",
    description: "Access documents, PDFs, and files from Google Drive",
  },
  gmail: {
    name: "Gmail",
    description: "Sync emails and attachments from Gmail",
  },
  notion: {
    name: "Notion",
    description: "Import pages and databases from Notion",
  },
  microsoft_teams: {
    name: "Microsoft Teams",
    description: "Sync messages and channels from Teams",
  },
  url: {
    name: "Custom URL",
    description: "Sync content from any public URL or API endpoint",
  },
  file_upload: {
    name: "File Upload",
    description: "Upload PDF, DOCX, TXT, and other documents directly",
  },
};

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const response = await fetch("/api/integrations");
      const data = await response.json();
      setIntegrations(data.integrations || []);
    } catch (error) {
      console.error("Failed to fetch integrations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = (provider: string) => {
    if (provider === "file_upload") {
      setIsUploadModalOpen(true);
      return;
    }
    // Redirect to OAuth endpoint
    window.location.href = `/api/auth/oauth/${provider}`;
  };

  const handleDisconnect = async (provider: string) => {
    try {
      const response = await fetch(`/api/integrations?provider=${provider}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setMessage({
          type: "success",
          text: `${provider} disconnected successfully`,
        });
        fetchIntegrations();
      } else {
        throw new Error("Failed to disconnect");
      }
    } catch (error) {
      setMessage({ type: "error", text: `Failed to disconnect ${provider}` });
    }
  };

  const handleSync = async (integrationId: string, provider: string) => {
    try {
      const response = await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ integrationId, provider }),
      });
      if (response.ok) {
        setMessage({ type: "success", text: `${provider} sync started` });
        fetchIntegrations();
      } else {
        throw new Error("Failed to sync");
      }
    } catch (error) {
      setMessage({ type: "error", text: `Failed to sync ${provider}` });
    }
  };

  const getIntegrationStatus = (provider: string) => {
    const integration = integrations.find((i) => i.provider === provider);
    return integration
      ? {
          status: integration.status,
          lastSyncedAt: integration.lastSyncedAt
            ? new Date(integration.lastSyncedAt)
            : undefined,
          id: integration.id,
        }
      : {
          status: "disconnected" as const,
          lastSyncedAt: undefined,
          id: undefined,
        };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-500">Loading integrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-900 dark:to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Premium Header */}
        <div className="mb-10 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-3xl" />
          <div className="relative flex items-center gap-4 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-blue-500/25">
              <Puzzle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent">
                Integrations
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
                <Link2 className="w-4 h-4" />
                Connect your tools to sync data into Corporate Brain
              </p>
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          {Object.entries(INTEGRATION_CONFIGS).map(([provider, config]) => {
            const { status, lastSyncedAt, id } = getIntegrationStatus(provider);
            return (
              <IntegrationCard
                key={provider}
                provider={provider}
                name={config.name}
                description={config.description}
                status={status}
                lastSyncedAt={lastSyncedAt}
                onConnect={() => handleConnect(provider)}
                onDisconnect={() => handleDisconnect(provider)}
                onSync={() => id && handleSync(id, provider)}
              />
            );
          })}
        </div>

        {/* File Upload Modal */}
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUploadComplete={() => {
            setIsUploadModalOpen(false);
            setMessage({
              type: "success",
              text: "Files uploaded successfully!",
            });
          }}
          tenantId=""
        />

        {/* Info Section with Premium Styling */}
        <div className="mt-10 p-6 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/50 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            About Integrations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Data synced automatically every 24 hours",
              "Manual sync available anytime",
              "All data processed and indexed for search",
              "Disconnect anytime to stop syncing",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-sm text-blue-700 dark:text-blue-300"
              >
                <span className="w-5 h-5 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-xs font-medium shrink-0">
                  {i + 1}
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
