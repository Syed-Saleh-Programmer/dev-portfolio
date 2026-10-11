"use client";

import React, { useEffect, useRef } from "react";

interface FluidPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  maxAge: number;
  size: number;
}

export function FluidCursorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let points: FluidPoint[] = [];
    let lastX = 0;
    let lastY = 0;
    let isMoving = false;
    let idleTimer: NodeJS.Timeout;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const onPointerMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const dx = x - lastX;
      const dy = y - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      lastX = x;
      lastY = y;

      if (speed > 1) {
        // Spawn subtle fluid points proportional to movement
        points.push({
          x,
          y,
          vx: dx * 0.15,
          vy: dy * 0.15,
          age: 0,
          maxAge: 35 + Math.random() * 20,
          size: Math.min(Math.max(speed * 1.5, 20), 70),
        });

        if (points.length > 50) {
          points.shift();
        }

        if (!isMoving) {
          isMoving = true;
          loop();
        }

        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          // let existing particles fade out
        }, 150);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const loop = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (points.length === 0) {
        isMoving = false;
        return;
      }

      const isDark = document.documentElement.classList.contains("dark");
      // Subtle monochrome tones - absolutely NO neon
      const baseR = isDark ? 255 : 30;
      const baseG = isDark ? 255 : 41;
      const baseB = isDark ? 255 : 59;

      for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        p.age++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;

        const progress = p.age / p.maxAge;
        if (progress >= 1) {
          points.splice(i, 1);
          continue;
        }

        const alpha = (1 - progress) * (isDark ? 0.04 : 0.03);
        const radius = p.size * (1 + progress * 0.8);

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        grad.addColorStop(0, `rgba(${baseR}, ${baseG}, ${baseB}, ${alpha})`);
        grad.addColorStop(1, `rgba(${baseR}, ${baseG}, ${baseB}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(idleTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
