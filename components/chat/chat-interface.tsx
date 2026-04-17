"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./chat-message";
import { Omnibox } from "./omnibox";
import { CitationSidebar } from "./citation-sidebar";
import { ModelSwitcher } from "./model-switcher";
import { ContextMap } from "./context-map";
import { ActionButtons } from "./action-buttons";

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

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showContextMap, setShowContextMap] = useState(false);
  const [selectedModel, setSelectedModel] = useState<"fast" | "deep">("fast");
  const [currentCitations, setCurrentCitations] = useState<Citation[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          conversationId,
          model: selectedModel,
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        citations: data.citations,
        model: data.model,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setConversationId(data.conversationId);
      setCurrentCitations(data.citations || []);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Context Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Context
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="font-medium mb-2">Conversations</p>
            <ul className="space-y-1">
              <li className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                Current Chat
              </li>
            </ul>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            <p className="font-medium mb-2">Sources</p>
            <ul className="space-y-1">
              <li className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                📄 Documents
              </li>
              <li className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                🌐 URLs
              </li>
              <li className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                💬 Slack
              </li>
            </ul>
          </div>
        </div>
        <button
          onClick={() => setShowContextMap(!showContextMap)}
          className="m-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          {showContextMap ? "Hide" : "Show"} Context Map
        </button>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Corporate Brain
            </h1>
            <Omnibox onSearch={handleSendMessage} />
          </div>
          <div className="flex items-center space-x-4">
            <ModelSwitcher
              selected={selectedModel}
              onChange={setSelectedModel}
            />
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600" />
          </div>
        </header>

        {/* Context Map (Toggleable) */}
        {showContextMap && (
          <div className="h-64 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <ContextMap />
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <p className="text-lg mb-2">Welcome to Corporate Brain</p>
              <p className="text-sm">
                Ask anything about your company knowledge
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}
          {isLoading && (
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto">
            <ActionButtons
              onAction={(_action) => {
                // TODO: Add action handling
                void _action;
              }}
            />
            <div className="mt-2 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask anything... (⌘K for commands)"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.querySelector(
                    'input[type="text"]',
                  ) as HTMLInputElement;
                  if (input) {
                    handleSendMessage(input.value);
                    input.value = "";
                  }
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Citation Sidebar */}
      <CitationSidebar citations={currentCitations} />
    </div>
  );
}
