"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, Award, Briefcase, Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { InteractiveCard } from "@/components/InteractiveCard";

export interface Certification {
  name: string;
  issuer: string;
  date?: string;
  image?: string;
  credentialUrl?: string;
  skills?: string[];
}

export interface ProfileData {
  name: string;
  title: string;
  aboutParagraphs?: string[];
  certifications?: Certification[];
}

export interface ExperienceItem {
  slug: string;
  role: string;
  company: string;
  duration: string;
  location?: string;
  description: string;
}

interface AboutClientViewProps {
  profile: ProfileData;
  experiences: ExperienceItem[];
}

export function AboutClientView({ profile, experiences }: AboutClientViewProps) {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] px-6 py-14 sm:py-20 max-w-4xl mx-auto font-sans selection:bg-blue-900 selection:text-white transition-colors duration-300">
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

      {/* Hero Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-20 space-y-4"
      >
        <div className="flex items-center gap-2 text-xs font-mono text-blue-400 tracking-wider uppercase">
          <span>01 / ABOUT {profile.name.toUpperCase()}</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-normal tracking-tight text-[var(--text-primary)]">
          The Story &amp; <span className="font-serif italic text-blue-400">Craft</span>
        </h1>
        <p className="text-lg text-[var(--text-secondary)] font-medium max-w-2xl leading-relaxed">
          {profile.title} • Engineering Leadership &amp; Scalable Systems
        </p>
      </motion.header>

      {/* Section 1: The Bio / Story with Scroll Transition */}
      <motion.section
        id="bio"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-24 space-y-6 scroll-mt-24"
      >
        <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)] text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
          <span>Bio &amp; Philosophy</span>
        </div>
        <div className="space-y-6 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-sans">
          {profile.aboutParagraphs?.map((paragraph, idx) => (
            <p key={idx} className={idx === 0 ? "text-xl sm:text-2xl text-[var(--text-primary)] font-normal leading-relaxed" : ""}>
              {paragraph}
            </p>
          ))}
        </div>
      </motion.section>

      {/* Section 2: Work Experience with Minimal Cards & Mouse Interactions */}
      <motion.section
        id="experience"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-24 space-y-8 scroll-mt-24"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <h2 className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-2">
            <Briefcase size={14} className="text-blue-400" />
            <span>Work Experience &amp; Leadership</span>
          </h2>
          <span className="text-xs font-mono text-[var(--text-muted)]">CAREER TIMELINE</span>
        </div>

        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.45,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <InteractiveCard
                id={`role-${exp.slug}`}
                roundedClassName="rounded-2xl sm:rounded-3xl"
                className="glass-bento-card border border-[var(--border-subtle)] hover:border-[var(--border-hover)] p-6 sm:p-7 rounded-2xl sm:rounded-3xl shadow-sm scroll-mt-24 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--text-primary)] group-hover:text-blue-400 transition-colors">
                      {exp.role}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-blue-400 font-mono mt-0.5">
                      <span>{exp.company}</span>
                      {exp.location && (
                        <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                          <MapPin size={12} />
                          {exp.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-secondary)] bg-[var(--bg-subtle)] px-3 py-1 rounded-full border border-[var(--border-subtle)] shrink-0 self-start sm:self-center">
                    <Calendar size={12} className="text-[var(--text-muted)]" />
                    <span>{exp.duration}</span>
                  </div>
                </div>

                <div className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed pt-3 border-t border-[var(--border-subtle)]">
                  {exp.description}
                </div>
              </InteractiveCard>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Section 3: Certifications & Credentials with Minimal Cards & Mouse Interactions */}
      <motion.section
        id="certifications"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-24 space-y-8 scroll-mt-24"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <h2 className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-2">
            <Award size={14} className="text-amber-400" />
            <span>Certifications &amp; Credentials</span>
          </h2>
          <span className="text-xs font-mono text-[var(--text-muted)]">VERIFIED CREDENTIALS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {profile.certifications?.map((cert, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.45,
                delay: idx * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <InteractiveCard
                roundedClassName="rounded-2xl"
                className="glass-bento-card border border-[var(--border-subtle)] hover:border-[var(--border-hover)] p-5 sm:p-6 rounded-2xl flex flex-col justify-between shadow-sm transition-all duration-300 h-full"
              >
                <div>
                  {/* Minimal Certificate Image Badge */}
                  <div className="w-12 h-12 rounded-xl bg-[var(--bg-subtle)]/70 border border-[var(--border-subtle)] p-2 flex items-center justify-center mb-4 overflow-hidden group-hover:scale-105 transition-transform">
                    {cert.image ? (
                      <img
                        src={cert.image}
                        alt={cert.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Award size={24} className="text-amber-400" />
                    )}
                  </div>

                  <div className="text-xs font-mono text-[var(--text-muted)] mb-1">
                    {cert.issuer} • {cert.date}
                  </div>
                  <h3 className="text-base font-semibold text-[var(--text-primary)] leading-snug mb-3">
                    {cert.name}
                  </h3>

                  {cert.skills && cert.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {cert.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {cert.credentialUrl && cert.credentialUrl !== "#" && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors pt-3 border-t border-[var(--border-subtle)]"
                  >
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    <span>Verify Credential</span>
                    <ExternalLink size={12} className="ml-auto" />
                  </a>
                )}
              </InteractiveCard>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Footer Colophon with Scroll Animation */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="pt-8 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]"
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
