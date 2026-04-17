"use client";

import { cn } from "@/lib/utils";

interface ActionButtonsProps {
  onAction: (action: string) => void;
}

const ACTIONS = [
  {
    id: "draft",
    label: "Draft Email",
    icon: "✉️",
  },
  {
    id: "create",
    label: "Create Doc",
    icon: "📝",
  },
  {
    id: "schedule",
    label: "Schedule",
    icon: "📅",
  },
  {
    id: "analyze",
    label: "Analyze",
    icon: "📊",
  },
];

export function ActionButtons({ onAction }: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {ACTIONS.map((action) => (
        <button
          key={action.id}
          onClick={() => onAction(action.id)}
          className={cn(
            "inline-flex items-center space-x-1 px-3 py-1.5 rounded-full",
            "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600",
            "text-sm text-gray-700 dark:text-gray-300 transition-colors"
          )}
        >
          <span>{action.icon}</span>
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
}
