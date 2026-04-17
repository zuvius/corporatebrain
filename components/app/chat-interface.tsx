"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot, User, FileText, ExternalLink } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Array<{
    id: string;
    name: string;
    type: string;
    snippet?: string;
  }>;
  createdAt: Date;
}

interface ChatInterfaceProps {
  tenantId: string;
  initialConversationId?: string;
}

interface Citation {
  id: string;
  title: string;
}

interface ChatResponse {
  conversationId: string;
  message: string;
  model: string;
  cost: number;
  tokens: number;
  citations: Citation[];
}

export function ChatInterface({ tenantId, initialConversationId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your Corporate Brain assistant. I can help you find information from your knowledge sources. What would you like to know?",
      createdAt: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(initialConversationId);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Load conversation history when initialConversationId changes
  useEffect(() => {
    if (initialConversationId) {
      setConversationId(initialConversationId);
      loadConversation(initialConversationId);
    }
  }, [initialConversationId]);

  const loadConversation = async (convId: string) => {
    try {
      const response = await fetch(`/api/chat?conversationId=${convId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.messages && data.messages.length > 0) {
          setMessages(
            data.messages.map((m: any) => ({
              id: m.id,
              role: m.role,
              content: m.content,
              createdAt: new Date(m.createdAt),
            }))
          );
        }
      }
    } catch (err) {
      console.error("Failed to load conversation:", err);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      createdAt: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          conversationId,
          tenantId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get response");
      }

      const data: ChatResponse = await response.json();

      // Store conversation ID for continuing this conversation
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        sources: data.citations?.map(c => ({
          id: c.id,
          name: c.title,
          type: "file",
          snippet: undefined,
        })),
        createdAt: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setError(err instanceof Error ? err.message : "Failed to get response");
      
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error processing your request. Please try again.",
        createdAt: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">Chat</h1>
            <p className="text-sm text-gray-500">
              {conversationId ? "Conversation active" : "Ask anything about your knowledge base"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {error && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-sm text-red-700">Error</span>
            </div>
          )}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-50 rounded-lg">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-sm text-violet-700">AI Ready</span>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="px-6 py-2 bg-red-50 border-b border-red-100">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex gap-4 ${message.role === "assistant" ? "bg-gray-50 -mx-6 px-6 py-4" : ""}`}
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              {message.role === "assistant" ? (
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              ) : (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">
                  {message.role === "assistant" ? "Corporate Brain" : "You"}
                </span>
                <span className="text-xs text-gray-400">
                  {hasMounted ? message.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                </span>
              </div>
              
              <div className="prose prose-sm max-w-none text-gray-700">
                {message.content}
              </div>

              {/* Sources */}
              {message.sources && message.sources.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Sources</p>
                  <div className="flex flex-wrap gap-2">
                    {message.sources.map(source => (
                      <div
                        key={source.id}
                        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-violet-300 transition-colors cursor-pointer group"
                      >
                        <FileText className="h-4 w-4 text-violet-500" />
                        <div className="max-w-[200px]">
                          <p className="text-sm font-medium text-gray-700 truncate">{source.name}</p>
                          {source.snippet && (
                            <p className="text-xs text-gray-400 truncate">{source.snippet}</p>
                          )}
                        </div>
                        <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-violet-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-4 bg-gray-50 -mx-6 px-6 py-4">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">Corporate Brain</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-2 w-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-2 w-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm text-gray-500">Searching your knowledge base...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-4">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask anything about your knowledge base..."
              rows={1}
              className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
        
        <p className="mt-2 text-xs text-center text-gray-400">
          AI can make mistakes. Please verify important information.
        </p>
      </div>
    </div>
  );
}
