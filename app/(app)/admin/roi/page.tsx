"use client";

import { useEffect, useState } from "react";

interface ROIMetrics {
  metrics: {
    hoursSaved: number;
    costSaved: number;
    productivityGain: number;
    queriesResolved: number;
    estimatedValue: number;
    roi: number;
  };
  period: {
    days: number;
    startDate: string;
    endDate: string;
  };
  trends: {
    queryGrowth: number;
    previousPeriodQueries: number;
    currentPeriodQueries: number;
  };
  assumptions: {
    timeSavedPerQueryMinutes: number;
    hourlyRate: number;
  };
}

export default function ROIDashboard() {
  const [data, setData] = useState<ROIMetrics | null>(null);
  const [days, setDays] = useState(30);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchROIData();
  }, [days]);

  const fetchROIData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/roi?days=${days}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch ROI data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-500">Loading ROI data...</p>
        </div>
      </div>
    );
  }

  const { metrics, trends, assumptions } = data;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              ROI Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track the value and productivity gains from Corporate Brain
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

        {/* ROI Hero Card */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Return on Investment</p>
              <p className="text-5xl font-bold mt-2">{metrics.roi}%</p>
              <p className="text-green-100 mt-2">
                For every $1 spent, you saved ${(metrics.roi / 100 + 1).toFixed(2)} in productivity
              </p>
            </div>
            <div className="text-right">
              <p className="text-green-100 text-sm font-medium">Total Value Generated</p>
              <p className="text-4xl font-bold mt-2">${metrics.estimatedValue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <MetricCard
            title="Time Saved"
            value={`${metrics.hoursSaved} hours`}
            subtitle="Equivalent to full work days"
            color="blue"
          />
          <MetricCard
            title="Cost Savings"
            value={`$${metrics.costSaved.toLocaleString()}`}
            subtitle="Based on hourly rates"
            color="green"
          />
          <MetricCard
            title="Productivity Boost"
            value={`${metrics.productivityGain}%`}
            subtitle="Of work week saved"
            color="purple"
          />
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Query Volume
            </h3>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {metrics.queriesResolved.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">queries resolved</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${trends.queryGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {trends.queryGrowth >= 0 ? "↑" : "↓"} {Math.abs(trends.queryGrowth)}%
                </p>
                <p className="text-xs text-gray-500">vs previous period</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Previous period:</span>
                <span className="text-gray-900 dark:text-white">{trends.previousPeriodQueries.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Calculation Method
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Time saved per query:</span>
                <span className="font-medium">{assumptions.timeSavedPerQueryMinutes} minutes</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Assumed hourly rate:</span>
                <span className="font-medium">${assumptions.hourlyRate}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Manual search time:</span>
                <span className="font-medium">15 minutes</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Corporate Brain time:</span>
                <span className="font-medium">1 minute</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="flex space-x-4">
          <a
            href="/admin"
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            ← Back to Dashboard
          </a>
          <a
            href="/admin/costs"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Cost Breakdown →
          </a>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  color: "blue" | "green" | "purple";
}) {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    green: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    purple: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
  };

  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color]}`}>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}
