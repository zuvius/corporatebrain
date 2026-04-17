"use client";

interface Citation {
  id: string;
  title: string;
  excerpt: string;
  sourceType: "pdf" | "url" | "slack" | "notion";
}

interface CitationSidebarProps {
  citations: Citation[];
}

export function CitationSidebar({ citations }: CitationSidebarProps) {
  if (citations.length === 0) {
    return (
      <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Citations
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No citations yet. Start a conversation to see sources.
        </p>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Citations ({citations.length})
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {citations.map((citation) => (
          <div
            key={citation.id}
            className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
          >
            <div className="flex items-start space-x-2">
              <span className="text-lg">{getSourceIcon(citation.sourceType)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {citation.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {citation.excerpt}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getSourceIcon(type: Citation["sourceType"]): string {
  const icons: Record<Citation["sourceType"], string> = {
    pdf: "📄",
    url: "🌐",
    slack: "💬",
    notion: "📝",
  };
  return icons[type] || "📄";
}
