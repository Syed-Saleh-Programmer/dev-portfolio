"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-full bg-[#181822] border border-[#272738] ${className}`} />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle dark/light theme"
      className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border ${
        theme === "dark"
          ? "bg-[#14141e] hover:bg-[#1f1f2e] text-amber-300 border-[#2a2a3d] hover:border-amber-400/40 shadow-[0_0_15px_rgba(251,191,36,0.15)]"
          : "bg-[#ffffff] hover:bg-[#f4f4f5] text-indigo-600 border-[#e4e4e7] hover:border-indigo-400 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
      } ${className}`}
    >
      {theme === "dark" ? (
        <Sun size={16} className="transition-transform duration-500 rotate-0 hover:rotate-90" />
      ) : (
        <Moon size={16} className="transition-transform duration-500 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
}
