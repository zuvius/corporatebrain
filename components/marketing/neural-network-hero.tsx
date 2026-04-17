"use client";

import { useEffect, useRef, useCallback } from "react";

type NodeType = "input" | "processing" | "output";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: NodeType;
  pulsePhase: number;
  pulseSpeed: number;
  layer: number; // 0 = background, 1 = mid, 2 = foreground
  energy: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

export function NeuralNetworkHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const nodesRef = useRef<Node[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });
  const timeRef = useRef(0);

  const initNodes = useCallback((width: number, height: number) => {
    const nodes: Node[] = [];
    const baseCount = Math.floor((width * height) / 35000);
    
    // Create nodes in layers
    for (let layer = 0; layer < 3; layer++) {
      const layerCount = Math.floor(baseCount * (layer === 1 ? 0.5 : 0.25));
      
      for (let i = 0; i < layerCount; i++) {
        const types: NodeType[] = ["input", "processing", "output"];
        const type = types[Math.floor(Math.random() * types.length)];
        
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (0.3 - layer * 0.1),
          vy: (Math.random() - 0.5) * (0.3 - layer * 0.1),
          radius: (Math.random() * 3 + 2) * (layer === 2 ? 1.5 : 1),
          type,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03,
          layer,
          energy: Math.random(),
        });
      }
    }
    return nodes;
  }, []);

  const getNodeColor = (node: Node, time: number) => {
    const pulse = Math.sin(time * node.pulseSpeed + node.pulsePhase) * 0.5 + 0.5;
    const baseColors = {
      input: { r: 99, g: 102, b: 241 },    // Indigo
      processing: { r: 139, g: 92, b: 246 }, // Purple
      output: { r: 236, g: 72, b: 153 },    // Pink
    };
    const color = baseColors[node.type];
    const intensity = 0.4 + pulse * 0.6;
    const alpha = node.layer === 2 ? intensity : intensity * 0.6;
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
  };

  const getGlowColor = (node: Node) => {
    const glowColors = {
      input: "rgba(99, 102, 241,",
      processing: "rgba(139, 92, 246,",
      output: "rgba(236, 72, 153,",
    };
    return glowColors[node.type];
  };

  const createParticle = (x: number, y: number, color: string): Particle => ({
    x,
    y,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    life: 0,
    maxLife: 30 + Math.random() * 20,
    color,
  });

  const createRipple = (x: number, y: number): Ripple => ({
    x,
    y,
    radius: 0,
    maxRadius: 150 + Math.random() * 100,
    opacity: 0.6,
  });

  const drawBezierCurve = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
    width: number,
    time: number,
    energyFlow: number
  ) => {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const controlX = midX + Math.sin(time * 0.001 + x1 * 0.01) * 30;
    const controlY = midY + Math.cos(time * 0.001 + y1 * 0.01) * 30;

    // Draw main curve
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(controlX, controlY, x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();

    // Draw energy flow particles on the line
    if (energyFlow > 0) {
      const particlePos = (time * 0.002) % 1;
      const t = particlePos;
      const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * controlX + t * t * x2;
      const py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * controlY + t * t * y2;
      
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fillStyle = color.replace(/[\d.]+\)$/, "1)");
      ctx.fill();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      nodesRef.current = initNodes(canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      // Create ripple on significant mouse movement
      const dx = mouseRef.current.x - mouseRef.current.prevX;
      const dy = mouseRef.current.y - mouseRef.current.prevY;
      const speed = Math.sqrt(dx * dx + dy * dy);
      
      if (speed > 20 && Math.random() > 0.7) {
        ripplesRef.current.push(createRipple(e.clientX, e.clientY));
      }
    };

    const handleClick = (e: MouseEvent) => {
      ripplesRef.current.push(createRipple(e.clientX, e.clientY));
      
      // Create burst of particles
      for (let i = 0; i < 8; i++) {
        particlesRef.current.push(createParticle(
          e.clientX,
          e.clientY,
          `hsl(${280 + Math.random() * 60}, 80%, 60%)`
        ));
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    const animate = () => {
      if (!ctx || !canvas) return;
      timeRef.current += 1;
      const time = timeRef.current;

      // Clear with gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#0f172a");
      gradient.addColorStop(0.5, "#1e1b4b");
      gradient.addColorStop(1, "#312e81");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const nodes = nodesRef.current;
      const mouse = mouseRef.current;

      // Update and draw ripples first (background layer)
      ripplesRef.current = ripplesRef.current.filter((ripple) => {
        ripple.radius += 3;
        ripple.opacity -= 0.015;

        if (ripple.opacity > 0) {
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(139, 92, 246, ${ripple.opacity})`;
          ctx.lineWidth = 2;
          ctx.stroke();
          return true;
        }
        return false;
      });

      // Sort nodes by layer for proper depth rendering
      const sortedNodes = [...nodes].sort((a, b) => a.layer - b.layer);

      // Group nodes by layer for connection drawing
      const layers: Node[][] = [[], [], []];
      sortedNodes.forEach((node) => {
        layers[node.layer].push(node);
      });

      // Draw connections between nodes in same and adjacent layers
      const drawLayerConnections = (layerNodes: Node[], maxDist: number, baseOpacity: number) => {
        for (let i = 0; i < layerNodes.length; i++) {
          for (let j = i + 1; j < layerNodes.length; j++) {
            const dx = layerNodes[i].x - layerNodes[j].x;
            const dy = layerNodes[i].y - layerNodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDist) {
              const opacity = (1 - dist / maxDist) * baseOpacity;
              const color = getGlowColor(layerNodes[i]);
              
              drawBezierCurve(
                ctx,
                layerNodes[i].x,
                layerNodes[i].y,
                layerNodes[j].x,
                layerNodes[j].y,
                `${color} ${opacity})`,
                0.5 + layerNodes[i].layer * 0.3,
                time,
                layerNodes[i].energy
              );
            }
          }
        }
      };

      // Draw connections for each layer
      layers.forEach((layer, index) => {
        drawLayerConnections(layer, 120 - index * 20, 0.15 + index * 0.05);
      });

      // Draw cross-layer connections
      for (let i = 0; i < layers.length - 1; i++) {
        layers[i].forEach((node1) => {
          layers[i + 1].forEach((node2) => {
            const dx = node1.x - node2.x;
            const dy = node1.y - node2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
              const opacity = (1 - dist / 150) * 0.1;
              drawBezierCurve(
                ctx,
                node1.x,
                node1.y,
                node2.x,
                node2.y,
                `rgba(139, 92, 246, ${opacity})`,
                0.3,
                time,
                0
              );
            }
          });
        });
      }

      // Draw mouse connections with energy flow
      layers[2].forEach((node) => {
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 250) {
          const opacity = (1 - dist / 250) * 0.5;
          drawBezierCurve(
            ctx,
            node.x,
            node.y,
            mouse.x,
            mouse.y,
            `rgba(236, 72, 153, ${opacity})`,
            1.5,
            time,
            1
          );

          // Chance to spawn particle
          if (Math.random() > 0.98) {
            particlesRef.current.push(createParticle(
              node.x,
              node.y,
              getGlowColor(node) + " 1)"
            ));
          }
        }
      });

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        const lifeRatio = particle.life / particle.maxLife;
        const opacity = 1 - lifeRatio;

        if (particle.life < particle.maxLife) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 2 * (1 - lifeRatio * 0.5), 0, Math.PI * 2);
          ctx.fillStyle = particle.color.replace(/[\d.]+\)$/, `${opacity})`);
          ctx.fill();
          
          // Draw trail
          ctx.beginPath();
          ctx.moveTo(particle.x - particle.vx * 3, particle.y - particle.vy * 3);
          ctx.lineTo(particle.x, particle.y);
          ctx.strokeStyle = particle.color.replace(/[\d.]+\)$/, `${opacity * 0.5})`);
          ctx.lineWidth = 1;
          ctx.stroke();
          
          return true;
        }
        return false;
      });

      // Update and draw nodes
      sortedNodes.forEach((node) => {
        // Mouse interaction - nodes attracted to mouse
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 200 && dist > 0) {
          const force = (200 - dist) / 200 * 0.015;
          node.vx += (dx / dist) * force;
          node.vy += (dy / dist) * force;
        }

        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges with padding
        const padding = 50;
        if (node.x < padding || node.x > canvas.width - padding) node.vx *= -0.8;
        if (node.y < padding || node.y > canvas.height - padding) node.vy *= -0.8;

        // Keep in bounds
        node.x = Math.max(padding, Math.min(canvas.width - padding, node.x));
        node.y = Math.max(padding, Math.min(canvas.height - padding, node.y));

        // Damping
        node.vx *= 0.995;
        node.vy *= 0.995;

        // Update pulse
        node.pulsePhase += node.pulseSpeed;

        // Draw glow effect
        const pulse = Math.sin(node.pulsePhase) * 0.5 + 0.5;
        const glowRadius = node.radius * (2 + pulse);
        const glowAlpha = 0.3 * pulse * (node.layer === 2 ? 1 : 0.5);
        
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, glowRadius * 3
        );
        gradient.addColorStop(0, getGlowColor(node) + ` ${glowAlpha})`);
        gradient.addColorStop(0.5, getGlowColor(node) + ` ${glowAlpha * 0.3})`);
        gradient.addColorStop(1, getGlowColor(node) + " 0)");
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowRadius * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw core node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * (0.8 + pulse * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = getNodeColor(node, time);
        ctx.fill();

        // Draw bright center
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initNodes]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full cursor-crosshair"
      style={{ 
        background: "linear-gradient(135deg, #0a0f1e 0%, #151030 50%, #1e1b4b 100%)",
      }}
    />
  );
}
