"use client";

import { useState } from "react";
import {
  X,
  Globe,
  Loader2,
  Link2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface UrlIngestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function UrlIngestModal({
  isOpen,
  onClose,
  onSuccess,
}: UrlIngestModalProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [options, setOptions] = useState({
    onlyMainContent: true,
    waitFor: 0,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/ingest/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          options,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to ingest URL");
      }

      setSuccess(
        `URL ingestion started! Source ID: ${data.sourceId.slice(0, 8)}...`,
      );
      setUrl("");

      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to ingest URL");
    } finally {
      setIsLoading(false);
    }
  };

  const isValidUrl = (value: string) => {
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol);
    } catch {
      return false;
    }
  };

  const showUrlPreview = url && isValidUrl(url);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 m-4 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
            <Globe className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Add URL Source
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Scrape any website for your knowledge base
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2 animate-in slide-in-from-top-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-2 animate-in slide-in-from-top-2">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            <p className="text-sm text-green-700 dark:text-green-300">
              {success}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Website URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Link2 className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/article"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                required
              />
            </div>
            {showUrlPreview && (
              <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                <Globe className="h-3 w-3" />
                Will scrape: {new URL(url).hostname}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Scraping Options
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={options.onlyMainContent}
                onChange={(e) =>
                  setOptions({ ...options, onlyMainContent: e.target.checked })
                }
                className="h-4 w-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Only Main Content
                </p>
                <p className="text-xs text-gray-500">
                  Remove navigation, headers, footers
                </p>
              </div>
            </label>

            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Wait Time
                </p>
                <p className="text-xs text-gray-500">
                  Milliseconds to wait for dynamic content
                </p>
              </div>
              <input
                type="number"
                value={options.waitFor}
                onChange={(e) =>
                  setOptions({
                    ...options,
                    waitFor: parseInt(e.target.value) || 0,
                  })
                }
                className="w-20 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                min="0"
                max="10000"
                step="100"
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Powered by Firecrawl</strong> - Converts any website into
              LLM-ready markdown. JavaScript-rendered sites are supported.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Scraping...
                </>
              ) : (
                <>
                  <Globe className="h-5 w-5" />
                  Scrape URL
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
