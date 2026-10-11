import fs from "fs";
import path from "path";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ExternalLink, Code2, Sparkles, Layers } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { ThemeToggle } from "@/components/ThemeToggle";

interface WorkItem {
  slug: string;
  title: string;
  summary: string;
  previewImage?: string;
  liveLink?: string;
  githubLink?: string;
  year?: string;
  role?: string;
  techStack?: string[];
  gallery?: { image: string; caption?: string }[];
}

function loadWorks(): WorkItem[] {
  const worksDir = path.join(process.cwd(), "content", "works");
  if (!fs.existsSync(worksDir)) return [];

  const files = fs.readdirSync(worksDir);
  const items: WorkItem[] = [];

  for (const file of files) {
    if (!file.endsWith(".mdx") && !file.endsWith(".md")) continue;
    const content = fs.readFileSync(path.join(worksDir, file), "utf-8");
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (match) {
      const rawYaml = match[1];
      const title = rawYaml.match(/title:\s*(.*)/)?.[1]?.trim() || "Untitled Project";
      const summary = rawYaml.match(/summary:\s*(.*)/)?.[1]?.trim() || "";
      const previewImage = rawYaml.match(/previewImage:\s*(.*)/)?.[1]?.trim();
      const liveLink = rawYaml.match(/liveLink:\s*(.*)/)?.[1]?.trim();
      const githubLink = rawYaml.match(/githubLink:\s*(.*)/)?.[1]?.trim();
      const year = rawYaml.match(/year:\s*(.*)/)?.[1]?.trim() || "2024";
      const role = rawYaml.match(/role:\s*(.*)/)?.[1]?.trim();

      const techStackMatches = rawYaml.match(/techStack:[\s\S]*?(?=\n\w+:|$)/);
      let techStack: string[] = [];
      if (techStackMatches) {
        const stackLines = techStackMatches[0].match(/- (.*)/g);
        if (stackLines) techStack = stackLines.map((s) => s.replace("- ", "").trim());
      }

      // Count gallery images
      const galleryMatches = rawYaml.match(/- image:\s*(.*)/g);
      const gallery = galleryMatches ? galleryMatches.map((m) => ({ image: m.replace("- image:", "").trim() })) : [];

      items.push({
        slug: file.replace(/\.(mdx|md)$/, ""),
        title,
        summary,
        previewImage,
        liveLink,
        githubLink,
        year,
        role,
        techStack,
        gallery,
      });
    }
  }

  return items;
}

export default function WorksPage() {
  const works = loadWorks();

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] px-6 py-14 sm:py-20 max-w-5xl mx-auto font-sans selection:bg-indigo-900 selection:text-white transition-colors duration-300">
      {/* Navigation & Theme Bar */}
      <div className="mb-12 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors px-3 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)]"
        >
          <ArrowLeft size={14} />
          <span>Back to Workspace</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Header */}
      <header className="mb-20 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 tracking-wider uppercase">
          <span>02 / WORKS &amp; SYSTEMS ARCHITECTURE</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-normal tracking-tight text-[var(--text-primary)]">
          Selected <span className="font-serif italic text-indigo-400">Products</span> &amp; Systems
        </h1>
        <p className="text-lg text-[var(--text-secondary)] font-medium max-w-2xl leading-relaxed">
          Deep-dive case studies showcasing architectural decisions, low-latency AI integrations, and product craftsmanship by Syed Muhammad Saleh.
        </p>
      </header>

      {/* Works Showcase List */}
      <div className="space-y-16">
        {works.map((work, index) => (
          <div
            key={work.slug}
            id={work.slug}
            className="group rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] transition-all duration-500 overflow-hidden shadow-2xl flex flex-col lg:flex-row scroll-mt-24"
          >
            {/* Left Content Column */}
            <div className="p-8 sm:p-10 flex-1 flex flex-col justify-between">
              <div>
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400 font-bold">0{index + 1}</span>
                    <span className="text-[var(--text-muted)]">/</span>
                    <span className="text-[var(--text-secondary)]">{work.year}</span>
                    {work.role && (
                      <span className="px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-indigo-300 border border-[var(--border-subtle)]">
                        {work.role}
                      </span>
                    )}
                  </div>
                  {work.gallery && work.gallery.length > 0 && (
                    <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                      <Layers size={12} />
                      {work.gallery.length} Screens in Gallery
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] tracking-tight mb-3 group-hover:text-indigo-400 transition-colors">
                  <Link href={`/works/${work.slug}`} className="inline-flex items-center gap-2">
                    <span>{work.title}</span>
                    <ArrowUpRight size={20} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-indigo-400" />
                  </Link>
                </h2>

                {/* Summary */}
                <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed mb-6 font-sans">
                  {work.summary}
                </p>

                {/* Tech Stack Pills */}
                {work.techStack && work.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-8">
                    {work.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-[var(--border-subtle)] text-xs font-mono">
                <Link
                  href={`/works/${work.slug}`}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-medium transition-colors shadow-lg shadow-indigo-600/25 flex items-center gap-1.5"
                >
                  <span>Read Full Case Study</span>
                  <ArrowUpRight size={14} />
                </Link>

                {work.liveLink && work.liveLink !== "#" && (
                  <a
                    href={work.liveLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <span>Live Preview</span>
                    <ExternalLink size={12} />
                  </a>
                )}

                {work.githubLink && work.githubLink !== "#" && (
                  <a
                    href={work.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <GithubIcon size={14} />
                    <span>Source</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Product Image Column */}
            {work.previewImage && (
              <div className="lg:w-[45%] bg-[var(--bg-subtle)] border-t lg:border-t-0 lg:border-l border-[var(--border-subtle)] p-6 sm:p-8 flex items-center justify-center relative overflow-hidden group/img">
                <div className="w-full h-full max-h-[360px] rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xl group-hover:scale-[1.02] transition-transform duration-500">
                  <img
                    src={work.previewImage}
                    alt={work.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Colophon */}
      <footer className="mt-24 pt-8 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
        <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">
          ← Back to Workspace
        </Link>
        <span>Content managed via TinaCMS</span>
      </footer>
    </main>
  );
}
