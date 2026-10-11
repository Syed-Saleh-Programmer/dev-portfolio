"use client";

import React, { useRef, useState, useCallback } from "react";

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  onClick?: () => void;
  roundedClassName?: string;
}

export function InteractiveCard({
  children,
  className = "",
  style = {},
  id,
  onClick,
  roundedClassName = "rounded-2xl",
}: InteractiveCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 });

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt: max 1.8 degrees (matching home page InteractiveBentoCard)
    const rotateX = ((y - centerY) / centerY) * -1.8;
    const rotateY = ((x - centerX) / centerX) * 1.8;

    setTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.006, 1.006, 1.006)`
    );
    setSpotlight({ x, y, opacity: 1 });
  }, []);

  const handlePointerLeave = useCallback(() => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <div
      ref={cardRef}
      id={id}
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        transform,
        transition: "transform 0.18s cubic-bezier(0.2, 0, 0.2, 1)",
        ...style,
      }}
      className={`relative group overflow-hidden ${className}`}
    >
      {/* Subtle Radial Cursor Spotlight */}
      <div
        className={`pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 ${roundedClassName}`}
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(450px circle at ${spotlight.x}px ${spotlight.y}px, var(--card-spotlight, rgba(255, 255, 255, 0.05)), transparent 80%)`,
        }}
      />
      {/* Subtle Specular Top Glass Highlight */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 dark:via-white/12 to-transparent ${roundedClassName} z-10`}
      />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
