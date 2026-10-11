"use client";

import React from "react";

export function AnimatedBuddyAvatar({ size = 42, isThinking = false }: { size?: number; isThinking?: boolean }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center shrink-0"
    >
      {/* Outer Pulsing Glow */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 blur-sm opacity-60 ${
          isThinking ? "animate-pulse" : ""
        }`}
      />

      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        <defs>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1e1833" />
            <stop offset="1" stopColor="#0f0c1c" />
          </linearGradient>
          <linearGradient id="antennaGrad" x1="50" y1="5" x2="50" y2="25" gradientUnits="userSpaceOnUse">
            <stop stopColor="#c084fc" />
            <stop offset="1" stopColor="#818cf8" />
          </linearGradient>
          <filter id="eyeGlow" x="0" y="0" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Antenna */}
        <line x1="50" y1="20" x2="50" y2="8" stroke="url(#antennaGrad)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="50" cy="7" r="4.5" fill="#c084fc">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Head Shell */}
        <rect x="15" y="20" width="70" height="62" rx="20" fill="url(#bodyGrad)" stroke="#3b2d5c" strokeWidth="2.5" />

        {/* Visor Screen */}
        <rect x="22" y="28" width="56" height="34" rx="12" fill="#080612" stroke="#251c3a" strokeWidth="1.5" />

        {/* Eyes (Animated Blinking & Glow) */}
        <g filter="url(#eyeGlow)">
          <ellipse cx="38" cy="45" rx="5" ry="6" fill="#38bdf8">
            <animate attributeName="ry" values="6;6;0.5;6;6" keyTimes="0;0.45;0.5;0.55;1" dur="4s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="62" cy="45" rx="5" ry="6" fill="#38bdf8">
            <animate attributeName="ry" values="6;6;0.5;6;6" keyTimes="0;0.45;0.5;0.55;1" dur="4s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* Cute Smile / Voice Wave */}
        {isThinking ? (
          <path d="M40 70 Q50 64 60 70" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" fill="none">
            <animate attributeName="d" values="M40 70 Q50 64 60 70; M40 68 Q50 74 60 68; M40 70 Q50 64 60 70" dur="1s" repeatCount="indefinite" />
          </path>
        ) : (
          <path d="M42 69 Q50 75 58 69" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        )}

        {/* Cheek Blush */}
        <circle cx="28" cy="52" r="3" fill="#f43f5e" fillOpacity="0.4" />
        <circle cx="72" cy="52" r="3" fill="#f43f5e" fillOpacity="0.4" />
      </svg>
    </div>
  );
}
