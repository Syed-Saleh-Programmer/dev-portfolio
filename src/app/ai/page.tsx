import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AIBuddy } from "@/components/AIBuddy";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AIPage() {
  return (
    <main className="h-[100dvh] w-full bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans relative overflow-hidden flex flex-col">
      {/* Discreet Floating Navigation Controls (No Top Header Bar) */}
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-30">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all px-3 py-1.5 rounded-full bg-[var(--bg-card)]/80 backdrop-blur border border-[var(--border-subtle)] hover:border-neutral-400 dark:hover:border-neutral-600 shadow-sm"
        >
          <ArrowLeft size={13} />
          <span>Studio</span>
        </Link>
      </div>

      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-30">
        <ThemeToggle />
      </div>

      {/* Flat Full-Width Chat Viewport */}
      <div className="flex-1 w-full h-full flex flex-col min-h-0">
        <AIBuddy />
      </div>
    </main>
  );
}
