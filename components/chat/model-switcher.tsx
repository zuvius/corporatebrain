"use client";

import { cn } from "@/lib/utils";

interface ModelSwitcherProps {
  selected: "fast" | "deep";
  onChange: (model: "fast" | "deep") => void;
}

export function ModelSwitcher({ selected, onChange }: ModelSwitcherProps) {
  return (
    <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
      <button
        onClick={() => onChange("fast")}
        className={cn(
          "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
          selected === "fast"
            ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white",
        )}
      >
        <span className="flex items-center space-x-1">
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
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span>Fast</span>
        </span>
      </button>
      <button
        onClick={() => onChange("deep")}
        className={cn(
          "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
          selected === "deep"
            ? "bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white",
        )}
      >
        <span className="flex items-center space-x-1">
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
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <span>Deep</span>
        </span>
      </button>
    </div>
  );
}
