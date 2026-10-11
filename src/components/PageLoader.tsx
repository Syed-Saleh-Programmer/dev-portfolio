"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if previously loaded in this tab session
    const hasLoaded = sessionStorage.getItem("saleh_loaded");
    if (hasLoaded) {
      setLoading(false);
      return;
    }

    // Smooth counter progress
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 14) + 6;
      if (current >= 100) {
        current = 100;
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
          sessionStorage.setItem("saleh_loaded", "true");
        }, 300);
      } else {
        setProgress(current);
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-50 flex flex-col justify-between p-6 sm:p-12 bg-[#060608] text-white select-none pointer-events-auto"
        >
          {/* Top Metadata */}
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span className="tracking-widest uppercase">Syed Muhammad Saleh</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Initializing Studio</span>
            </span>
          </div>

          {/* Center Title & Counter */}
          <div className="max-w-2xl my-auto space-y-4">
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white font-sans"
              >
                Architecture <span className="font-serif italic text-neutral-400">&amp;</span> Systems
              </motion.h1>
            </div>

            {/* Progress bar */}
            <div className="w-full h-[2px] bg-neutral-800 rounded-full overflow-hidden mt-6">
              <motion.div
                className="h-full bg-white transition-all duration-75 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Bottom Counter & Year */}
          <div className="flex items-end justify-between font-mono">
            <div className="text-xs text-neutral-500">
              <span>Next.js 15 • TinaCMS • High-Performance Web</span>
            </div>
            <div className="text-5xl sm:text-7xl font-light tracking-tighter text-white tabular-nums">
              {progress.toString().padStart(3, "0")}%
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
