"use client";

import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  model?: string;
  timestamp: Date;
}

interface Citation {
  id: string;
  title: string;
  excerpt: string;
  sourceType: "pdf" | "url" | "slack" | "notion";
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-3",
          isUser
            ? "bg-blue-600 text-white"
            : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-700",
        )}
      >
        {/* Message Content */}
        <div className="prose dark:prose-invert prose-sm max-w-none">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>

        {/* Model Badge (for AI messages) */}
        {!isUser && message.model && (
          <div className="mt-2 flex items-center space-x-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Model: {message.model}
            </span>
          </div>
        )}

        {/* Citations */}
        {!isUser && message.citations && message.citations.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Sources:
            </p>
            <div className="flex flex-wrap gap-2">
              {message.citations.map((citation) => (
                <span
                  key={citation.id}
                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  {getSourceIcon(citation.sourceType)}
                  <span className="ml-1 truncate max-w-[150px]">
                    {citation.title}
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div className="mt-2 text-xs opacity-50">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
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
