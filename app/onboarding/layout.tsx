"use client";

import React from "react";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Corporate Brain
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Setup Wizard
            </span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
