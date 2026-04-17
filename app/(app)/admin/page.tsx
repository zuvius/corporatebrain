"use client";

import { useEffect, useState } from "react";

interface DashboardStats {
  overview: {
    totalCost: number;
    totalTokens: number;
    totalQueries: number;
    integrationsTotal: number;
    integrationsActive: number;
    knowledgeSourcesTotal: number;
    knowledgeSourcesIndexed: number;
    conversationsTotal: number;
    conversationsThisWeek: number;
  };
  dailyUsage: Array<{
    date: string;
    cost: number;
    tokens: number;
  }>;
  modelBreakdown: Array<{
    model: string;
    cost: number;
    tokens: number;
    queries: number;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/admin/dashboard");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setStats(data);
    } catch {
      setError("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 text-red-800 p-4 rounded-lg">{error}</div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const { overview } = stats;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitor your Corporate Brain usage, costs, and performance
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Cost (30d)"
            value={`$${overview.totalCost.toFixed(2)}`}
            trend="Based on usage"
            color="blue"
          />
          <StatCard
            title="AI Queries"
            value={overview.totalQueries.toLocaleString()}
            trend={`${overview.conversationsThisWeek} this week`}
            color="green"
          />
          <StatCard
            title="Active Integrations"
            value={`${overview.integrationsActive}/${overview.integrationsTotal}`}
            trend="Connected sources"
            color="purple"
          />
          <StatCard
            title="Knowledge Sources"
            value={`${overview.knowledgeSourcesIndexed}/${overview.knowledgeSourcesTotal}`}
            trend="Indexed and ready"
            color="orange"
          />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <a
            href="/admin/roi"
            className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center text-xl">
                📊
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                ROI Dashboard
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View productivity gains and cost savings from Corporate Brain
            </p>
          </a>

          <a
            href="/admin/costs"
            className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-xl">
                💰
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Cost Command Center
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Detailed cost breakdown and spending projections
            </p>
          </a>

          <a
            href="/app/integrations"
            className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center text-xl">
                🔌
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Integrations
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage connected apps and data sources
            </p>
          </a>
        </div>

        {/* Model Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            AI Model Usage (30 days)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Model
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Queries
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Tokens
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.modelBreakdown.map((model) => (
                  <tr
                    key={model.model}
                    className="border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                      {model.model}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                      {model.queries.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                      {model.tokens.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900 dark:text-white font-medium">
                      ${model.cost.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  trend,
  color,
}: {
  title: string;
  value: string;
  trend: string;
  color: "blue" | "green" | "purple" | "orange";
}) {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    green:
      "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    purple:
      "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
    orange:
      "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
  };

  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color]}`}>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {title}
      </p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
        {value}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{trend}</p>
    </div>
  );
}
