"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { getIntegrationIcon } from "./integration-icons";
import {
  Loader2,
  RefreshCw,
  Plug,
  Unplug,
  CheckCircle,
  AlertCircle,
  Plus,
} from "lucide-react";

interface IntegrationCardProps {
  provider: string;
  name: string;
  description: string;
  status: "connected" | "disconnected" | "error";
  lastSyncedAt?: Date;
  onConnect: () => void;
  onDisconnect: () => void;
  onSync: () => void;
}

export function IntegrationCard({
  provider,
  name,
  description,
  status,
  lastSyncedAt,
  onConnect,
  onDisconnect,
  onSync,
}: IntegrationCardProps) {
  const isConnected = status === "connected";
  const isFileUpload = provider === "file_upload";
  const [isSyncing, setIsSyncing] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    await onSync();
    setIsSyncing(false);
  };

  const formatLastSync = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600">
      {/* Premium gradient overlay on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
            {getIntegrationIcon(provider, 32)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          </div>
        </div>
        {!isFileUpload && (
          <div
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm",
              status === "connected" &&
                "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/50 dark:to-emerald-900/50 dark:text-green-200 border border-green-200 dark:border-green-700",
              status === "disconnected" &&
                "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 dark:from-gray-800 dark:to-slate-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700",
              status === "error" &&
                "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 dark:from-red-900/50 dark:to-rose-900/50 dark:text-red-200 border border-red-200 dark:border-red-700",
            )}
          >
            {status === "connected" && <CheckCircle className="w-3.5 h-3.5" />}
            {status === "error" && <AlertCircle className="w-3.5 h-3.5" />}
            <span className="capitalize">{status}</span>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between relative z-10">
        {!isFileUpload && (
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            {lastSyncedAt ? (
              <span>Synced {formatLastSync(lastSyncedAt)}</span>
            ) : (
              <span>Never synced</span>
            )}
          </div>
        )}
        {isFileUpload && <div />}

        <div className="flex items-center gap-2">
          {isFileUpload ? (
            /* File Upload Button */
            <div className="relative">
              <button
                onClick={onConnect}
                onMouseEnter={() => setShowTooltip("upload")}
                onMouseLeave={() => setShowTooltip(null)}
                className="group/btn relative px-5 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-xl flex items-center gap-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                <Plus className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                <span className="relative">Upload Files</span>
              </button>
              {showTooltip === "upload" && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-200">
                  Upload documents to knowledge base
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                </div>
              )}
            </div>
          ) : isConnected ? (
            <>
              {/* Sync Button with Tooltip */}
              <div className="relative">
                <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  onMouseEnter={() => setShowTooltip("sync")}
                  onMouseLeave={() => setShowTooltip(null)}
                  className="group/btn relative px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-200" />
                  {isSyncing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 group-hover/btn:rotate-180 transition-transform duration-500" />
                  )}
                  <span className="relative">
                    {isSyncing ? "Syncing..." : "Sync Now"}
                  </span>
                </button>
                {/* Tooltip */}
                {showTooltip === "sync" && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-200">
                    Fetch latest data from {name}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                  </div>
                )}
              </div>

              {/* Disconnect Button with Tooltip */}
              <div className="relative">
                <button
                  onClick={onDisconnect}
                  onMouseEnter={() => setShowTooltip("disconnect")}
                  onMouseLeave={() => setShowTooltip(null)}
                  className="group/btn relative px-4 py-2 bg-gradient-to-r from-red-50 to-rose-50 text-red-700 dark:from-red-900/20 dark:to-rose-900/20 dark:text-red-300 rounded-lg hover:from-red-100 hover:to-rose-100 dark:hover:from-red-900/30 dark:hover:to-rose-900/30 transition-all duration-200 text-sm font-medium border border-red-200 dark:border-red-800 flex items-center gap-2"
                >
                  <Unplug className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                  <span>Disconnect</span>
                </button>
                {showTooltip === "disconnect" && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-200">
                    Remove {name} integration
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Connect Button with Tooltip */
            <div className="relative">
              <button
                onClick={onConnect}
                onMouseEnter={() => setShowTooltip("connect")}
                onMouseLeave={() => setShowTooltip(null)}
                className="group/btn relative px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-xl flex items-center gap-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                <Plug className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                <span className="relative">Connect</span>
              </button>
              {showTooltip === "connect" && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-200">
                  Authenticate with {name}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
