"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface Node {
  id: string;
  name: string;
  type: "file" | "url" | "slack" | "notion" | "drive";
  connections: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

interface Connection {
  source: string;
  target: string;
  strength: number;
}

interface ContextMapVisualizationProps {
  nodes: Node[];
  connections: Connection[];
}

const TYPE_COLORS: Record<string, string> = {
  file: "#3B82F6",
  url: "#8B5CF6",
  slack: "#10B981",
  notion: "#F59E0B",
  drive: "#EC4899",
};

export function ContextMapVisualization({ nodes, connections }: ContextMapVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Clear previous content
    svg.selectAll("*").remove();

    // Create zoom behavior
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setZoom(event.transform.k);
      });

    svg.call(zoomBehavior);

    // Create main group
    const g = svg.append("g");

    // Create simulation
    const simulation = d3.forceSimulation<Node>(nodes)
      .force("link", d3.forceLink<Node, Connection>(connections)
        .id(d => d.id)
        .distance(100)
        .strength(d => d.strength)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide<Node>().radius(d => 30 + (d.connections ?? 0) * 2));

    // Draw links
    const link = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(connections)
      .enter()
      .append("line")
      .attr("stroke", "#9CA3AF")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", d => Math.sqrt(d.strength) * 2);

    // Draw nodes
    const node = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .call(d3.drag<SVGGElement, Node>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      )
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
      });

    // Add circles to nodes
    node.append("circle")
      .attr("r", d => 15 + d.connections * 2)
      .attr("fill", d => TYPE_COLORS[d.type] || "#6B7280")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))");

    // Add labels to nodes
    node.append("text")
      .text(d => d.name.length > 20 ? d.name.substring(0, 20) + "..." : d.name)
      .attr("x", d => 20 + d.connections * 2)
      .attr("y", 4)
      .attr("font-size", "12px")
      .attr("fill", "#374151")
      .attr("font-weight", "500")
      .style("pointer-events", "none");

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => ((d.source as unknown as Node).x ?? 0))
        .attr("y1", d => ((d.source as unknown as Node).y ?? 0))
        .attr("x2", d => ((d.target as unknown as Node).x ?? 0))
        .attr("y2", d => ((d.target as unknown as Node).y ?? 0));

      node.attr("transform", d => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    // Click background to deselect
    svg.on("click", () => setSelectedNode(null));

    return () => {
      simulation.stop();
    };
  }, [nodes, connections]);

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ background: "transparent" }}
      />

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => {
            const svg = d3.select(svgRef.current);
            svg.transition().call(
              (d3.zoom() as any).transform,
              d3.zoomIdentity.scale(zoom * 1.2)
            );
          }}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title="Zoom in"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button
          onClick={() => {
            const svg = d3.select(svgRef.current);
            svg.transition().call(
              (d3.zoom() as any).transform,
              d3.zoomIdentity.scale(zoom / 1.2)
            );
          }}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title="Zoom out"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <button
          onClick={() => {
            const svg = d3.select(svgRef.current);
            svg.transition().call(
              (d3.zoom() as any).transform,
              d3.zoomIdentity
            );
          }}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title="Reset zoom"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>

      {/* Selected node info */}
      {selectedNode && (
        <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {selectedNode.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Type: <span className="capitalize">{selectedNode.type}</span>
          </p>
          <p className="text-sm text-gray-500">
            Connections: {selectedNode.connections}
          </p>
          <button
            onClick={() => setSelectedNode(null)}
            className="mt-3 text-xs text-violet-600 hover:text-violet-700"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
