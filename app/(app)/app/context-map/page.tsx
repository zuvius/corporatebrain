"use client";

import { useEffect, useState } from "react";
import { ContextMapVisualization } from "@/components/app/context-map-visualization";
import { Loader2, Info } from "lucide-react";

interface KnowledgeNode {
  id: string;
  name: string;
  type: "file" | "url" | "slack" | "notion" | "drive";
  connections: number;
}

interface Connection {
  source: string;
  target: string;
  strength: number;
}

export default function ContextMapPage() {
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchKnowledgeGraph();
  }, []);

  const fetchKnowledgeGraph = async () => {
    try {
      const response = await fetch("/api/knowledge-graph");
      if (response.ok) {
        const data = await response.json();
        setNodes(data.nodes || []);
        setConnections(data.connections || []);
      }
    } catch (error) {
      console.error("Failed to fetch knowledge graph:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading knowledge graph...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Context Map
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Visualize connections between your knowledge sources
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Info className="h-4 w-4" />
              <span>{nodes.length} sources • {connections.length} connections</span>
            </div>
          </div>
        </div>
      </header>

      {/* Legend */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
        <div className="flex items-center gap-6 text-sm">
          <span className="text-gray-500">Source types:</span>
          <div className="flex items-center gap-4">
            <LegendItem color="#3B82F6" label="PDF / Document" />
            <LegendItem color="#8B5CF6" label="Web URL" />
            <LegendItem color="#10B981" label="Slack" />
            <LegendItem color="#F59E0B" label="Notion" />
            <LegendItem color="#EC4899" label="Google Drive" />
          </div>
        </div>
      </div>

      {/* Visualization */}
      <div className="flex-1 relative">
        {nodes.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-lg font-medium">No knowledge sources yet</p>
              <p className="text-sm mt-2">Upload documents or connect integrations to see your context map</p>
            </div>
          </div>
        ) : (
          <ContextMapVisualization nodes={nodes} connections={connections} />
        )}
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div 
        className="w-3 h-3 rounded-full" 
        style={{ backgroundColor: color }}
      />
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
    </div>
  );
}
