"use client";

import React from "react";

export function AnimatedThinkingWave({ text = "Buddy is thinking with Groq OSS..." }: { text?: string }) {
  return (
    <div className="flex items-center gap-3 p-3.5 px-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-lg max-w-fit">
      {/* Animated Sound/Neural Wave SVG */}
      <svg
        width="36"
        height="24"
        viewBox="0 0 48 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="waveGrad" x1="0" y1="0" x2="48" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#a855f7" />
            <stop offset="0.5" stopColor="#ec4899" />
            <stop offset="1" stopColor="#38bdf8" />
          </linearGradient>
        </defs>

        {/* 5 Animated Equalizer Bars */}
        <rect x="4" y="8" width="4" height="16" rx="2" fill="url(#waveGrad)">
          <animate
            attributeName="height"
            values="10;24;14;22;10"
            keyTimes="0;0.25;0.5;0.75;1"
            dur="1.2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            values="11;4;9;5;11"
            keyTimes="0;0.25;0.5;0.75;1"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </rect>

        <rect x="13" y="4" width="4" height="24" rx="2" fill="url(#waveGrad)">
          <animate
            attributeName="height"
            values="24;12;26;16;24"
            keyTimes="0;0.25;0.5;0.75;1"
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            values="4;10;3;8;4"
            keyTimes="0;0.25;0.5;0.75;1"
            dur="1s"
            repeatCount="indefinite"
          />
        </rect>

        <rect x="22" y="6" width="4" height="20" rx="2" fill="url(#waveGrad)">
          <animate
            attributeName="height"
            values="16;28;8;22;16"
            keyTimes="0;0.25;0.5;0.75;1"
            dur="0.9s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            values="8;2;12;5;8"
            keyTimes="0;0.25;0.5;0.75;1"
            dur="0.9s"
            repeatCount="indefinite"
          />
        </rect>

        <rect x="31" y="8" width="4" height="16" rx="2" fill="url(#waveGrad)">
          <animate
            attributeName="height"
            values="20;10;24;14;20"
            keyTimes="0;0.25;0.5;0.75;1"
            dur="1.1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            values="6;11;4;9;6"
            keyTimes="0;0.25;0.5;0.75;1"
            dur="1.1s"
            repeatCount="indefinite"
          />
        </rect>

        <rect x="40" y="10" width="4" height="12" rx="2" fill="url(#waveGrad)">
          <animate
            attributeName="height"
            values="10;22;12;18;10"
            keyTimes="0;0.25;0.5;0.75;1"
            dur="1.3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            values="11;5;10;7;11"
            keyTimes="0;0.25;0.5;0.75;1"
            dur="1.3s"
            repeatCount="indefinite"
          />
        </rect>
      </svg>

      <span className="text-xs font-mono text-[var(--text-secondary)] tracking-tight">
        {text}
      </span>
    </div>
  );
}
