"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface OmniboxProps {
  onSearch: (query: string) => void;
}

const SUGGESTIONS = [
  { label: "Search knowledge base...", action: "search" },
  { label: "Upload document", action: "upload" },
  { label: "Connect integration", action: "connect" },
  { label: "View analytics", action: "analytics" },
];

export function Omnibox({ onSearch }: OmniboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle ⌘K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setQuery("");
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % SUGGESTIONS.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + SUGGESTIONS.length) % SUGGESTIONS.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const suggestion = SUGGESTIONS[selectedIndex];
      if (suggestion.action === "search") {
        handleSubmit();
      } else {
        // Handle other actions
        setQuery(suggestion.label);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center space-x-2 px-4 py-2 rounded-lg",
          "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300",
          "hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        )}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <span className="text-sm">Search...</span>
        <kbd className="px-2 py-0.5 text-xs bg-white dark:bg-gray-600 rounded">
          ⌘K
        </kbd>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything or type a command..."
              className="w-full px-4 py-3 bg-transparent border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
              autoFocus
            />
          </form>

          <div className="py-2">
            <p className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Suggestions
            </p>
            {SUGGESTIONS.map((suggestion, index) => (
              <button
                key={suggestion.action}
                onClick={() => {
                  if (suggestion.action === "search") {
                    handleSubmit();
                  } else {
                    setQuery(suggestion.label);
                  }
                }}
                className={cn(
                  "w-full px-4 py-2 text-left text-sm",
                  "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                  index === selectedIndex && "bg-gray-100 dark:bg-gray-700"
                )}
              >
                <span className="text-gray-700 dark:text-gray-300">
                  {suggestion.label}
                </span>
              </button>
            ))}
          </div>

          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
            <span>↑↓ Navigate</span>
            <span className="mx-2">•</span>
            <span>↵ Select</span>
            <span className="mx-2">•</span>
            <span>esc Close</span>
          </div>
        </div>
      )}
    </div>
  );
}
