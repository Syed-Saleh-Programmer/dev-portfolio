"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PhotoAlbumModal } from "@/components/PhotoAlbumModal";

export interface AlbumPhoto {
  image: string;
  caption?: string;
  rotation?: string;
}

export interface HobbyEntry {
  slug: string;
  title: string;
  category: string;
  date?: string;
  location?: string;
  tagline?: string;
  stamp?: string;
  photos: AlbumPhoto[];
  body: string;
}

interface FunClientViewProps {
  hobbies: HobbyEntry[];
}

export function FunClientView({ hobbies }: FunClientViewProps) {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] px-6 py-14 sm:py-20 max-w-4xl mx-auto font-sans selection:bg-amber-950 selection:text-amber-200 transition-colors duration-300">
      {/* Navigation & Theme Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mb-12 flex items-center justify-between"
      >
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors px-3 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)]"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Back to Workspace</span>
        </Link>
        <ThemeToggle />
      </motion.div>

      {/* Editorial Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-20 space-y-4"
      >
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 tracking-wider uppercase">
          <span>03 / PHOTO JOURNAL &amp; EXTRACURRICULARS</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-normal tracking-tight text-[var(--text-primary)]">
          Life Beyond the <span className="font-serif italic text-amber-400">Terminal</span>
        </h1>
        <p className="text-lg text-[var(--text-secondary)] font-medium max-w-2xl leading-relaxed">
          An editorial album of analog 35mm film photography, custom soldering irons, midnight hackathon builds, and quiet moments off the screen.
        </p>
      </motion.header>

      {/* Vertical Album Flow with Scroll Transitions */}
      <div className="space-y-32">
        {hobbies.map((hobby, index) => (
          <motion.article
            key={hobby.slug}
            id={hobby.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8 pt-12 border-t border-[var(--border-subtle)] relative scroll-mt-24"
          >
            {/* Postal Stamp Badge */}
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                  0{index + 1} • {hobby.category}
                </span>
                <h2 className="text-2xl sm:text-4xl font-normal text-[var(--text-primary)] tracking-tight">
                  {hobby.title}
                </h2>
              </div>

              {/* Vintage Stamp */}
              <div className="hidden sm:flex flex-col items-center justify-center p-2 rounded-lg border-2 border-dashed border-amber-500/40 bg-amber-500/5 text-amber-400 text-[10px] font-mono tracking-widest text-center uppercase rotate-3 hover:rotate-0 transition-transform duration-300">
                <span>{hobby.stamp}</span>
                <span className="text-[8px] text-[var(--text-muted)]">SALEH ARCHIVE</span>
              </div>
            </div>

            {/* Location & Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--text-muted)]">
              {hobby.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-amber-400" />
                  {hobby.location}
                </span>
              )}
              {hobby.date && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  {hobby.date}
                </span>
              )}
            </div>

            {hobby.tagline && (
              <p className="font-serif italic text-xl text-[var(--text-primary)] leading-relaxed max-w-2xl pt-2">
                &ldquo;{hobby.tagline}&rdquo;
              </p>
            )}

            {/* Interactive Polaroid Photo Row with Minimal Cards & Mouse Interactions */}
            {hobby.photos && hobby.photos.length > 0 && (
              <PhotoAlbumModal photos={hobby.photos} />
            )}

            {/* Editorial Essay / Story Text */}
            <div className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-3xl space-y-4 pt-4 font-sans">
              {hobby.body.split("\n\n").map((para, paraIdx) => (
                <p key={paraIdx} className="leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </motion.article>
        ))}
      </div>

      {/* Footer Colophon with Scroll Animation */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mt-32 pt-8 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]"
      >
        <Link
          href="/"
          className="group inline-flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors"
        >
          <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
          <span>Back to Workspace</span>
        </Link>
        <span>Content managed via TinaCMS</span>
      </motion.footer>
    </main>
  );
}
