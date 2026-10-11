"use client";

import React from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const ROUTE_LABELS: Record<string, string> = {
  "/": "STUDIO / WORKSPACE",
  "/about": "01 / BIOGRAPHY & CERTIFICATIONS",
  "/works": "02 / SELECTED CASE STUDIES",
  "/fun": "03 / EDITORIAL PHOTO JOURNAL",
  "/ai": "04 / DIRECT INQUIRIES",
};

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentLabel =
    ROUTE_LABELS[pathname] ||
    (pathname.startsWith("/works/") ? "CASE STUDY DETAIL" : "PAGE TRANSITION");

  return (
    <div className="relative w-full flex-1 flex flex-col min-h-0">
      {/* Creative Shutter Wipe 1 (Accent Layer) */}
      <motion.div
        key={`shutter-1-${pathname}`}
        initial={{ y: "0%" }}
        animate={{ y: "-100%" }}
        transition={{
          duration: 0.65,
          ease: [0.76, 0, 0.24, 1],
          delay: 0.05,
        }}
        className="fixed inset-0 z-40 bg-neutral-800 dark:bg-neutral-800 pointer-events-none"
      />

      {/* Creative Shutter Wipe 2 (Primary Layer with Route Badge) */}
      <motion.div
        key={`shutter-2-${pathname}`}
        initial={{ y: "0%" }}
        animate={{ y: "-100%" }}
        transition={{
          duration: 0.6,
          ease: [0.76, 0, 0.24, 1],
        }}
        className="fixed inset-0 z-40 bg-[var(--bg-primary)] flex items-center justify-center pointer-events-none select-none"
      >
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex items-center gap-3 text-xs sm:text-sm font-mono tracking-widest text-[var(--text-primary)] px-4 py-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xl"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{currentLabel}</span>
        </motion.div>
      </motion.div>

      {/* Page Content Cascading Reveal */}
      <motion.div
        key={`content-${pathname}`}
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-full flex-1 flex flex-col min-h-0"
      >
        {children}
      </motion.div>
    </div>
  );
}
