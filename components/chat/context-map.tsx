"use client";

import { useEffect, useRef, useState } from "react";

interface Node {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  label: string;
}

export function ContextMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Generate mock nodes
    const initialNodes: Node[] = Array.from({ length: 20 }, (_, i) => ({
      id: `node-${i}`,
      x: Math.random() * 800,
      y: Math.random() * 200,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 8 + 4,
      color: ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B"][Math.floor(Math.random() * 4)],
      label: ["PDF", "URL", "Slack", "Notion"][Math.floor(Math.random() * 4)],
    }));
    setNodes(initialNodes);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update node positions
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          let newX = node.x + node.vx;
          let newY = node.y + node.vy;

          // Bounce off walls
          if (newX < 0 || newX > canvas.width) node.vx *= -1;
          if (newY < 0 || newY > canvas.height) node.vy *= -1;

          // Keep in bounds
          newX = Math.max(node.radius, Math.min(canvas.width - node.radius, newX));
          newY = Math.max(node.radius, Math.min(canvas.height - node.radius, newY));

          return { ...node, x: newX, y: newY };
        })
      );

      // Draw edges between nearby nodes
      nodes.forEach((node1, i) => {
        nodes.slice(i + 1).forEach((node2) => {
          const dx = node2.x - node1.x;
          const dy = node2.y - node1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(node1.x, node1.y);
            ctx.lineTo(node2.x, node2.y);
            ctx.strokeStyle = `rgba(156, 163, 175, ${1 - distance / 100})`;
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Draw label
        ctx.fillStyle = "#374151";
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(node.label, node.x, node.y + node.radius + 12);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes]);

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        width={800}
        height={256}
        className="w-full h-full"
      />
    </div>
  );
}
