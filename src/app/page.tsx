import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Camera } from "lucide-react";
import fs from "fs";
import path from "path";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ParticleBackground } from "@/components/ParticleBackground";
import { InteractiveBentoCard } from "@/components/InteractiveBentoCard";

function getProfile() {
  const profilePath = path.join(process.cwd(), "content", "profile", "main.json");
  if (fs.existsSync(profilePath)) {
    try {
      return JSON.parse(fs.readFileSync(profilePath, "utf-8"));
    } catch (e) {}
  }
  return {
    name: "Syed Muhammad Saleh",
    title: "Software Engineer & Product Architect",
    shortBio: "Full-stack engineer crafting high-performance distributed architectures and tactile human interfaces.",
  };
}

export default function Home() {
  const profile = getProfile();

  return (
    <main className="min-h-screen lg:h-screen lg:max-h-screen w-full bg-[var(--bg-primary)] text-[var(--text-primary)] p-4 sm:p-6 lg:p-7 flex flex-col justify-between overflow-x-hidden selection:bg-neutral-800 selection:text-white transition-colors duration-300 relative">
      {/* Interactive Particle Constellation & Depth Canvas in Background */}
      <ParticleBackground />

      {/* Bento Grid — Clean 2x2 layout on desktop, vertical flow on mobile */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 lg:grid-rows-2 gap-4 lg:gap-5 my-auto py-2 pt-8 sm:pt-12 lg:pt-14 z-10">
        
        {/* CARD 1: ABOUT (Clean, Spacious, Subtle 3D Pop-Out) */}
        <InteractiveBentoCard
          href="/about"
          allowOverflow={true}
          className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 lg:p-9 rounded-3xl glass-bento-card relative min-h-[320px] sm:min-h-[360px] lg:min-h-0"
        >
          {/* Subtle Ambient Depth */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-neutral-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Card Top Meta */}
          <div className="flex items-center justify-between relative z-20">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs text-[var(--text-muted)] tracking-wider uppercase">01 /</span>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-[var(--bg-subtle)]/75 backdrop-blur-sm text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                About
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[var(--bg-subtle)]/75 backdrop-blur-sm border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] group-hover:border-neutral-400/50 group-hover:scale-105 transition-all">
              <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Card Middle Typography (Clean, uncrowded, left-aligned) */}
          <div className="my-auto relative z-20 space-y-2.5 max-w-sm sm:max-w-md lg:max-w-[55%]">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[var(--text-primary)]">
              About <span className="font-serif italic font-normal text-[var(--text-primary)]">Saleh</span>
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-sans">
              Software engineer &amp; product architect building distributed cloud systems and fluid interfaces.
            </p>
          </div>

          {/* Card Bottom Highlights (Clean single-line tags) */}
          <div className="flex items-center gap-3 pt-3 border-t border-[var(--border-subtle)]/80 relative z-20 text-xs font-mono text-[var(--text-muted)]">
            <span>CTO • Lead Architect</span>
            <span>•</span>
            <span>AWS &amp; Meta Certified</span>
          </div>

          {/* 3D Pop-Out Portrait of Syed Muhammad Saleh — Subtle, Tasteful Height */}
          <div className="absolute right-1 sm:right-3 lg:right-6 bottom-0 h-[106%] sm:h-[108%] lg:h-[110%] w-40 sm:w-48 md:w-56 lg:w-64 pointer-events-none select-none z-10 flex items-end justify-center">
            <div className="relative w-full h-full">
              <Image
                src="/me-trimmed.png"
                alt="Syed Muhammad Saleh"
                fill
                priority
                sizes="(max-width: 768px) 190px, (max-width: 1200px) 240px, 280px"
                className="object-contain object-bottom drop-shadow-[-6px_14px_22px_rgba(0,0,0,0.3)] dark:drop-shadow-[-8px_16px_30px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-[1.03] origin-bottom"
                style={{
                  maskImage: "linear-gradient(to top, transparent 0%, black 6%, black 100%)",
                  WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 6%, black 100%)",
                }}
              />
            </div>
          </div>
        </InteractiveBentoCard>

        {/* CARD 2: WORKS */}
        <InteractiveBentoCard
          href="/works"
          className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 lg:p-9 rounded-3xl glass-bento-card relative min-h-[320px] sm:min-h-[360px] lg:min-h-0"
        >
          {/* Card Top Meta */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs text-[var(--text-muted)] tracking-wider uppercase">02 /</span>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-[var(--bg-subtle)]/75 backdrop-blur-sm text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                Works
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[var(--bg-subtle)]/75 backdrop-blur-sm border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] group-hover:border-neutral-400/50 group-hover:scale-105 transition-all">
              <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Card Middle Typography */}
          <div className="my-auto z-10 space-y-2.5">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-[var(--text-primary)]">
              Selected <span className="font-serif italic text-[var(--text-primary)]">Works</span>
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
              Case studies spanning autonomous EdTech platforms, voice capture engines, and event-driven backends.
            </p>
          </div>

          {/* Clean Bottom Preview */}
          <div className="flex items-center gap-2.5 pt-3 border-t border-[var(--border-subtle)]/80 z-10 text-xs font-mono text-[var(--text-muted)]">
            <span className="text-[var(--text-primary)] font-medium font-sans">Curiositora</span>
            <span>•</span>
            <span className="text-[var(--text-primary)] font-medium font-sans">FlowState AI</span>
            <span>•</span>
            <span className="text-[var(--text-primary)] font-medium font-sans">Nexus Core</span>
          </div>
        </InteractiveBentoCard>

        {/* CARD 3: FUN AND HOBBIES */}
        <InteractiveBentoCard
          href="/fun"
          className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 lg:p-9 rounded-3xl glass-bento-card relative min-h-[320px] sm:min-h-[360px] lg:min-h-0"
        >
          {/* Card Top Meta */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs text-[var(--text-muted)] tracking-wider uppercase">03 /</span>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-[var(--bg-subtle)]/75 backdrop-blur-sm text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                Hobbies
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[var(--bg-subtle)]/75 backdrop-blur-sm border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] group-hover:border-neutral-400/50 group-hover:scale-105 transition-all">
              <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Card Middle Typography */}
          <div className="my-auto z-10 space-y-2.5">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-[var(--text-primary)]">
              Fun &amp; <span className="font-serif italic text-[var(--text-primary)]">Hobbies</span>
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
              Analog 35mm photography, custom split mechanical keyboards, and 48-hour hackathon sprints.
            </p>
          </div>

          {/* Clean Bottom Meta */}
          <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-subtle)]/80 z-10 text-xs font-mono text-[var(--text-muted)]">
            <Camera size={13} />
            <span>Editorial photo album &amp; extracurriculars</span>
          </div>
        </InteractiveBentoCard>

        {/* CARD 4: ASK AI (Clean, Minimal, Zero AI Slop) */}
        <InteractiveBentoCard
          href="/ai"
          className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 lg:p-9 rounded-3xl glass-bento-card relative min-h-[320px] sm:min-h-[360px] lg:min-h-0"
        >
          {/* Card Top Meta */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs text-[var(--text-muted)] tracking-wider uppercase">04 /</span>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-[var(--bg-subtle)]/75 backdrop-blur-sm text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                AI Assistant
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[var(--bg-subtle)]/75 backdrop-blur-sm border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] group-hover:border-neutral-400/50 group-hover:scale-105 transition-all">
              <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Card Middle Typography */}
          <div className="my-auto z-10 space-y-2.5 max-w-md">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[var(--text-primary)]">
              Ask <span className="font-serif italic font-normal text-[var(--text-primary)]">AI</span>
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-sans">
              Interactive portfolio assistant with direct context on my system architecture, certifications, and codebases.
            </p>
          </div>

          {/* Clean Bottom Meta */}
          <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-subtle)]/80 z-10 text-xs font-mono text-[var(--text-muted)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Direct dialogue regarding my engineering experience</span>
          </div>
        </InteractiveBentoCard>

      </div>

      {/* Minimal Bottom Bar with Theme Toggle */}
      <footer className="w-full pt-3 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-muted)] font-mono z-10">
        <div className="flex items-center gap-3">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>•</span>
          <a href="/admin" className="hover:text-[var(--text-primary)] transition-colors">
            TinaCMS Admin ↗
          </a>
        </div>
        <div className="flex items-center gap-5">
          <a href="https://github.com/saleh-dev" target="_blank" rel="noreferrer" className="hover:text-[var(--text-primary)] transition-colors">
            GitHub ↗
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[var(--text-primary)] transition-colors">
            LinkedIn ↗
          </a>
          <a href="mailto:contact@saleh.dev" className="hover:text-[var(--text-primary)] transition-colors">
            Email ↗
          </a>
          <ThemeToggle />
        </div>
      </footer>
    </main>
  );
}
