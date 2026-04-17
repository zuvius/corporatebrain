"use client";

import { useEffect, useState } from "react";
import { IntegrationCard } from "@/components/integrations/integration-card";

interface Integration {
  id: string;
  provider: string;
  status: "connected" | "disconnected" | "error";
  lastSyncedAt?: string;
}

const INTEGRATION_CONFIGS: Record<
  string,
  { name: string; description: string; icon: string }
> = {
  slack: {
    name: "Slack",
    description: "Sync messages and files from your Slack workspaces",
    icon: "💬",
  },
  google_drive: {
    name: "Google Drive",
    description: "Access documents, PDFs, and files from Google Drive",
    icon: "📁",
  },
  notion: {
    name: "Notion",
    description: "Import pages and databases from Notion",
    icon: "📝",
  },
  microsoft_teams: {
    name: "Microsoft Teams",
    description: "Sync messages and channels from Teams",
    icon: "🏢",
  },
};

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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
    } catch {
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
    } catch {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Integrations
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect your tools to sync data into Corporate Brain
          </p>
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

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
            About Integrations
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Data is synced automatically every 24 hours</li>
            <li>• Manual sync available anytime</li>
            <li>• All data is processed and indexed for search</li>
            <li>• You can disconnect anytime to stop syncing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
