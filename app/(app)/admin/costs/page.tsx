"use client";

import { useEffect, useState } from "react";

interface CostData {
  summary: {
    period: {
      days: number;
      startDate: string;
      endDate: string;
    };
    totalCost: number;
    dailyAverage: number;
    projectedMonthly: number;
    projectedYearly: number;
    queryMetrics: {
      totalQueries: number;
      avgCostPerQuery: number;
      avgTokensPerQuery: number;
    };
  };
  providerTotals: Array<{
    provider: string;
    totalCost: number;
    totalTokens: number;
    queryCount: number;
  }>;
  modelTotals: Array<{
    model: string;
    totalCost: number;
    totalTokens: number;
    queryCount: number;
  }>;
  dailyBreakdown: Array<{
    date: string;
    model: string;
    provider: string;
    cost: number;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    queryCount: number;
  }>;
}

export default function CostCommandCenter() {
  const [data, setData] = useState<CostData | null>(null);
  const [days, setDays] = useState(30);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCostData();
  }, [days]);

  const fetchCostData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/costs?days=${days}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch cost data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-500">Loading cost data...</p>
        </div>
      </div>
    );
  }

  const { summary, providerTotals, modelTotals } = data;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Cost Command Center
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Monitor and optimize your AI spending
            </p>
          </div>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        {/* Cost Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <CostCard
            title="Total Cost"
            value={`$${summary.totalCost.toFixed(2)}`}
            subtitle={`Past ${summary.period.days} days`}
            color="red"
          />
          <CostCard
            title="Daily Average"
            value={`$${summary.dailyAverage.toFixed(2)}`}
            subtitle="Per day spend"
            color="orange"
          />
          <CostCard
            title="Projected Monthly"
            value={`$${summary.projectedMonthly.toFixed(2)}`}
            subtitle="If usage continues"
            color="blue"
          />
          <CostCard
            title="Avg Cost/Query"
            value={`$${summary.queryMetrics.avgCostPerQuery.toFixed(3)}`}
            subtitle={`${summary.queryMetrics.totalQueries.toLocaleString()} queries`}
            color="green"
          />
        </div>

        {/* Provider Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Cost by Provider
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {providerTotals.map((provider) => (
              <div
                key={provider.provider}
                className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {provider.provider.replace("_", " ")}
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    ${provider.totalCost.toFixed(2)}
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {provider.queryCount.toLocaleString()} queries ·{" "}
                  {provider.totalTokens.toLocaleString()} tokens
                </div>
                <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{
                      width: `${(provider.totalCost / summary.totalCost) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Cost by Model
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
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    % of Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {modelTotals.map((model) => (
                  <tr
                    key={model.model}
                    className="border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                      {model.model}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                      {model.queryCount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                      {model.totalTokens.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900 dark:text-white font-medium">
                      ${model.totalCost.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {((model.totalCost / summary.totalCost) * 100).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cost Optimization Tips */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
            💡 Cost Optimization Tips
          </h3>
          <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
            <li>• Use "Fast" model for simple queries to reduce costs by ~80%</li>
            <li>• Enable caching for frequently asked questions</li>
            <li>• Review expensive queries in the Model Breakdown above</li>
            <li>• Consider batching multiple questions in single conversations</li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="flex space-x-4">
          <a
            href="/admin"
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            ← Back to Dashboard
          </a>
          <a
            href="/admin/roi"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            View ROI Analysis →
          </a>
        </div>
      </div>
    </div>
  );
}

function CostCard({
  title,
  value,
  subtitle,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  color: "red" | "orange" | "blue" | "green";
}) {
  const colorClasses = {
    red: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
    orange: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
    blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    green: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
  };

  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color]}`}>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}
