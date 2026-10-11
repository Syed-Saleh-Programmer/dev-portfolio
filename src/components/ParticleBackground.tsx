"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  pulseOffset: number;
  pulseSpeed: number;
  colorType: "neutral" | "cyan" | "purple" | "emerald";
}

interface TrailSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  maxLife: number;
  life: number;
  colorType: "cyan" | "purple" | "white";
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Mouse tracking
    let mouseX = -9999;
    let mouseY = -9999;
    let prevMouseX = -9999;
    let prevMouseY = -9999;
    let isMouseOver = false;

    // Particles & Sparks storage
    let particles: Particle[] = [];
    const trailSparks: TrailSpark[] = [];

    // Ambient floating orbs for soft background depth
    const ambientOrbs = [
      {
        x: width * 0.25,
        y: height * 0.35,
        vx: 0.12,
        vy: 0.08,
        radius: 360,
        colorDark: "rgba(99, 102, 241, 0.045)",
        colorLight: "rgba(99, 102, 241, 0.025)",
      },
      {
        x: width * 0.75,
        y: height * 0.65,
        vx: -0.1,
        vy: -0.07,
        radius: 400,
        colorDark: "rgba(45, 212, 191, 0.038)",
        colorLight: "rgba(14, 165, 233, 0.022)",
      },
      {
        x: width * 0.5,
        y: height * 0.85,
        vx: 0.08,
        vy: -0.09,
        radius: 320,
        colorDark: "rgba(168, 85, 247, 0.035)",
        colorLight: "rgba(168, 85, 247, 0.02)",
      },
    ];

    const getParticleCount = (w: number) => {
      if (w < 640) return 38;
      if (w < 1024) return 60;
      return 85;
    };

    const initParticles = () => {
      const count = getParticleCount(width);
      particles = [];

      for (let i = 0; i < count; i++) {
        const colorRand = Math.random();
        let colorType: Particle["colorType"] = "neutral";
        if (colorRand > 0.85) colorType = "purple";
        else if (colorRand > 0.7) colorType = "cyan";
        else if (colorRand > 0.6) colorType = "emerald";

        const isSpecialNode = Math.random() > 0.88;
        const radius = isSpecialNode
          ? 2.6 + Math.random() * 0.9
          : 1.0 + Math.random() * 1.4;

        const speedMultiplier = prefersReducedMotion ? 0 : 0.35;

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * speedMultiplier,
          vy: (Math.random() - 0.5) * speedMultiplier,
          radius,
          baseAlpha: isSpecialNode
            ? 0.45 + Math.random() * 0.35
            : 0.2 + Math.random() * 0.45,
          pulseOffset: Math.random() * Math.PI * 2,
          pulseSpeed: 0.0015 + Math.random() * 0.002,
          colorType,
        });
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);

      // Re-bound particles if resized
      particles.forEach((p) => {
        if (p.x > width) p.x = Math.random() * width;
        if (p.y > height) p.y = Math.random() * height;
      });

      // Adjust particle count if drastic size change
      const targetCount = getParticleCount(width);
      if (Math.abs(particles.length - targetCount) > 15) {
        initParticles();
      }
    };

    resize();
    initParticles();
    window.addEventListener("resize", resize);

    // Mouse movement
    const onPointerMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      if (prevMouseX !== -9999 && !prefersReducedMotion) {
        const dx = x - prevMouseX;
        const dy = y - prevMouseY;
        const speed = Math.sqrt(dx * dx + dy * dy);

        // Spawn interactive micro stardust sparks when moving
        if (speed > 2.5 && trailSparks.length < 40) {
          const sparkCount = Math.min(Math.floor(speed * 0.15) + 1, 3);
          for (let s = 0; s < sparkCount; s++) {
            const angle = Math.random() * Math.PI * 2;
            const sparkSpeed = Math.random() * 0.8 + 0.2;
            const colorRand = Math.random();

            trailSparks.push({
              x: x + (Math.random() - 0.5) * 16,
              y: y + (Math.random() - 0.5) * 16,
              vx: Math.cos(angle) * sparkSpeed + dx * 0.04,
              vy: Math.sin(angle) * sparkSpeed + dy * 0.04,
              radius: 1.0 + Math.random() * 1.6,
              alpha: 0.7,
              maxLife: 35 + Math.floor(Math.random() * 25),
              life: 0,
              colorType:
                colorRand > 0.6 ? "cyan" : colorRand > 0.3 ? "purple" : "white",
            });
          }
        }
      }

      prevMouseX = x;
      prevMouseY = y;
      mouseX = x;
      mouseY = y;
      isMouseOver = true;
    };

    const onPointerLeave = () => {
      isMouseOver = false;
      mouseX = -9999;
      mouseY = -9999;
      prevMouseX = -9999;
      prevMouseY = -9999;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave);

    // Animation Loop
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = Math.min(currentTime - lastTime, 40);
      lastTime = currentTime;

      const isDark = document.documentElement.classList.contains("dark");

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Subtle Ambient Glowing Orbs
      ambientOrbs.forEach((orb) => {
        if (!prefersReducedMotion) {
          orb.x += orb.vx * (delta / 16);
          orb.y += orb.vy * (delta / 16);

          if (orb.x < -orb.radius * 0.5) orb.vx = Math.abs(orb.vx);
          if (orb.x > width + orb.radius * 0.5) orb.vx = -Math.abs(orb.vx);
          if (orb.y < -orb.radius * 0.5) orb.vy = Math.abs(orb.vy);
          if (orb.y > height + orb.radius * 0.5) orb.vy = -Math.abs(orb.vy);
        }

        const orbGrad = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius
        );
        const color = isDark ? orb.colorDark : orb.colorLight;
        orbGrad.addColorStop(0, color);
        orbGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw Constellation Interconnection Lines
      const maxConnectDist = width < 768 ? 85 : 110;
      const connectDistSq = maxConnectDist * maxConnectDist;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connectDistSq) {
            const dist = Math.sqrt(distSq);
            const lineAlpha =
              (1 - dist / maxConnectDist) * (isDark ? 0.12 : 0.08);

            ctx.beginPath();
            ctx.strokeStyle = isDark
              ? `rgba(226, 232, 240, ${lineAlpha})`
              : `rgba(71, 85, 105, ${lineAlpha})`;
            ctx.lineWidth = 0.65;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Faint interactive line to mouse if nearby
        if (isMouseOver && !prefersReducedMotion) {
          const dxM = mouseX - p1.x;
          const dyM = mouseY - p1.y;
          const distMSq = dxM * dxM + dyM * dyM;
          const mouseConnectDist = 125;

          if (distMSq < mouseConnectDist * mouseConnectDist) {
            const distM = Math.sqrt(distMSq);
            const mouseLineAlpha =
              (1 - distM / mouseConnectDist) * (isDark ? 0.22 : 0.15);

            ctx.beginPath();
            ctx.strokeStyle = isDark
              ? `rgba(165, 180, 252, ${mouseLineAlpha})`
              : `rgba(99, 102, 241, ${mouseLineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.stroke();
          }
        }
      }

      // 3. Update & Draw Particles
      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          // Subtle mouse deflection
          if (isMouseOver) {
            const dx = p.x - mouseX;
            const dy = p.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const repulseRadius = 135;

            if (dist < repulseRadius && dist > 1) {
              const force = (1 - dist / repulseRadius) * 0.45;
              p.x += (dx / dist) * force * (delta / 16);
              p.y += (dy / dist) * force * (delta / 16);
            }
          }

          p.x += p.vx * (delta / 16);
          p.y += p.vy * (delta / 16);

          // Wrap edges
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;
        }

        // Shimmering alpha calculation
        const pulse = Math.sin(currentTime * p.pulseSpeed + p.pulseOffset);
        const currentAlpha = Math.min(
          Math.max(p.baseAlpha + pulse * 0.18, 0.08),
          0.9
        );

        // Pick color based on theme & particle type
        let fillR = isDark ? 245 : 51;
        let fillG = isDark ? 245 : 65;
        let fillB = isDark ? 250 : 85;

        if (p.colorType === "cyan") {
          fillR = isDark ? 96 : 14;
          fillG = isDark ? 165 : 165;
          fillB = isDark ? 250 : 233;
        } else if (p.colorType === "purple") {
          fillR = isDark ? 192 : 124;
          fillG = isDark ? 132 : 58;
          fillB = isDark ? 252 : 237;
        } else if (p.colorType === "emerald") {
          fillR = isDark ? 52 : 16;
          fillG = isDark ? 211 : 185;
          fillB = isDark ? 153 : 129;
        }

        ctx.fillStyle = `rgba(${fillR}, ${fillG}, ${fillB}, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Extra subtle halo glow for larger nodes
        if (p.radius > 2.4) {
          const haloGrad = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            p.radius * 2.8
          );
          haloGrad.addColorStop(
            0,
            `rgba(${fillR}, ${fillG}, ${fillB}, ${currentAlpha * 0.35})`
          );
          haloGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = haloGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 4. Update & Draw Dynamic Cursor Trail Sparks
      for (let s = trailSparks.length - 1; s >= 0; s--) {
        const spark = trailSparks[s];
        spark.life++;
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vx *= 0.95;
        spark.vy *= 0.95;

        const lifeRatio = spark.life / spark.maxLife;
        if (lifeRatio >= 1) {
          trailSparks.splice(s, 1);
          continue;
        }

        const sparkAlpha = (1 - lifeRatio) * spark.alpha;
        let sR = isDark ? 255 : 30;
        let sG = isDark ? 255 : 41;
        let sB = isDark ? 255 : 59;

        if (spark.colorType === "cyan") {
          sR = isDark ? 125 : 14;
          sG = isDark ? 211 : 165;
          sB = isDark ? 252 : 233;
        } else if (spark.colorType === "purple") {
          sR = isDark ? 216 : 147;
          sG = isDark ? 180 : 51;
          sB = isDark ? 254 : 234;
        }

        ctx.fillStyle = `rgba(${sR}, ${sG}, ${sB}, ${sparkAlpha})`;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.radius * (1 - lifeRatio * 0.4), 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    // Pause rendering when tab is not visible to save CPU/battery
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onPointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: "100vw", height: "100vh" }}
      aria-hidden="true"
    />
  );
}
