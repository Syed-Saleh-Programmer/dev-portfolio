import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Code2, Layers, Image as ImageIcon } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { ThemeToggle } from "@/components/ThemeToggle";

interface GalleryItem {
  image: string;
  caption?: string;
}

interface WorkFrontmatter {
  title: string;
  summary: string;
  previewImage?: string;
  liveLink?: string;
  githubLink?: string;
  year?: string;
  role?: string;
  techStack?: string[];
  gallery?: GalleryItem[];
}

function parseMdx(content: string): { data: WorkFrontmatter; body: string } {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return {
      data: { title: "Untitled Case Study", summary: "" },
      body: content,
    };
  }

  const rawYaml = match[1];
  const body = match[2];
  const data: any = {};

  const lines = rawYaml.split(/\r?\n/);
  let currentKey = "";
  let isList = false;
  let isGalleryList = false;
  let currentGalleryItem: any = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("gallery:")) {
      isGalleryList = true;
      isList = false;
      data.gallery = [];
      continue;
    }

    if (isGalleryList) {
      const imgMatch = line.match(/^\s*-\s*image:\s*(.*)$/);
      if (imgMatch) {
        currentGalleryItem = { image: imgMatch[1].trim() };
        data.gallery.push(currentGalleryItem);
        continue;
      }
      const capMatch = line.match(/^\s*caption:\s*(.*)$/);
      if (capMatch && currentGalleryItem) {
        currentGalleryItem.caption = capMatch[1].trim();
        continue;
      }
      if (!line.startsWith("  ") && line.trim() !== "") {
        isGalleryList = false;
      }
    }

    const listMatch = line.match(/^\s*-\s*(.*)$/);
    if (listMatch && isList) {
      if (!Array.isArray(data[currentKey])) data[currentKey] = [];
      data[currentKey].push(listMatch[1].trim());
      continue;
    }

    const keyMatch = line.match(/^(\w+):\s*(.*)$/);
    if (keyMatch) {
      currentKey = keyMatch[1];
      const val = keyMatch[2].trim();
      if (val === "") {
        isList = true;
        if (!data[currentKey]) data[currentKey] = [];
      } else {
        isList = false;
        data[currentKey] = val;
      }
    }
  }

  return { data, body };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let filePath = path.join(process.cwd(), "content", "works", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(process.cwd(), "content", "works", `${slug}.md`);
  }
  if (!fs.existsSync(filePath)) {
    filePath = path.join(process.cwd(), "content", "projects", `${slug}.mdx`);
  }
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, body } = parseMdx(rawContent);

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] px-6 py-14 sm:py-20 max-w-4xl mx-auto font-sans selection:bg-indigo-900 selection:text-white transition-colors duration-300">
      {/* Navigation & Theme Bar */}
      <div className="mb-12 flex items-center justify-between">
        <Link
          href="/works"
          className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors px-3 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)]"
        >
          <ArrowLeft size={14} />
          <span>Back to All Works</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-[var(--text-muted)] hidden sm:inline">
            CASE STUDY • {data.year || "2024"}
          </span>
          <ThemeToggle />
        </div>
      </div>

      {/* Case Study Header */}
      <header className="mb-14 space-y-5">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <span className="px-3 py-1 rounded-full bg-[var(--bg-subtle)] text-indigo-300 border border-[var(--border-subtle)]">
            {data.role || "Lead Systems Architect"}
          </span>
          {data.year && <span className="text-[var(--text-muted)]">{data.year}</span>}
        </div>

        <h1 className="text-3xl sm:text-5xl font-semibold text-[var(--text-primary)] tracking-tight">
          {data.title}
        </h1>

        <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl font-sans">
          {data.summary}
        </p>

        {/* Live Links & Source Actions */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[var(--border-subtle)] text-xs font-mono">
          {data.liveLink && data.liveLink !== "#" && (
            <a
              href={data.liveLink}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-medium transition-colors shadow-lg shadow-indigo-600/25 flex items-center gap-1.5"
            >
              <span>Live Application Preview</span>
              <ExternalLink size={13} />
            </a>
          )}

          {data.githubLink && data.githubLink !== "#" && (
            <a
              href={data.githubLink}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors flex items-center gap-2"
            >
              <GithubIcon size={14} />
              <span>GitHub Repository</span>
            </a>
          )}
        </div>

        {/* Tech Stack Pills */}
        {data.techStack && data.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {data.techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)] flex items-center gap-1"
              >
                <Code2 size={12} className="text-indigo-400" />
                {tech}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Hero Preview Image */}
      {data.previewImage && (
        <div className="mb-16 rounded-3xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-2xl p-3 sm:p-4">
          <div className="rounded-2xl overflow-hidden bg-[var(--bg-subtle)]">
            <img
              src={data.previewImage}
              alt={data.title}
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
        </div>
      )}

      {/* Case Study Content */}
      <article className="mb-20 space-y-6 text-[var(--text-primary)] leading-relaxed text-base sm:text-lg">
        {body.split("\n\n").map((paragraph, idx) => {
          if (paragraph.startsWith("# ")) {
            return (
              <h2 key={idx} className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] tracking-tight pt-4 first:pt-0">
                {paragraph.replace("# ", "")}
              </h2>
            );
          }
          if (paragraph.startsWith("## ")) {
            return (
              <h3 key={idx} className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] tracking-tight pt-6 border-t border-[var(--border-subtle)]">
                {paragraph.replace("## ", "")}
              </h3>
            );
          }
          if (paragraph.startsWith("### ")) {
            return (
              <h4 key={idx} className="text-lg font-medium text-[var(--text-primary)] tracking-tight pt-4">
                {paragraph.replace("### ", "")}
              </h4>
            );
          }
          if (paragraph.startsWith("- ")) {
            const items = paragraph.split("\n- ");
            return (
              <ul key={idx} className="space-y-2.5 list-disc list-inside text-[var(--text-secondary)]">
                {items.map((item, itemIdx) => (
                  <li key={itemIdx} className="leading-relaxed">
                    {item.replace("- ", "")}
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p key={idx} className="text-[var(--text-secondary)] leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </article>

      {/* Multiple Image Product Gallery Section */}
      {data.gallery && data.gallery.length > 0 && (
        <section className="mb-24 pt-12 border-t border-[var(--border-subtle)] space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
                <ImageIcon size={20} className="text-indigo-400" />
                <span>Product Gallery &amp; Screenshots</span>
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-mono mt-1">
                Visual artifacts &amp; architecture walkthrough
              </p>
            </div>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              {data.gallery.length} ASSETS
            </span>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {data.gallery.map((item, idx) => (
              <div
                key={idx}
                className="group rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] transition-all duration-300 p-4 sm:p-6 shadow-xl"
              >
                <div className="rounded-2xl overflow-hidden bg-[var(--bg-subtle)] border border-[var(--border-subtle)] mb-4">
                  <img
                    src={item.image}
                    alt={item.caption || `Product screenshot ${idx + 1}`}
                    className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-500"
                  />
                </div>
                {item.caption && (
                  <p className="text-sm font-sans text-[var(--text-secondary)] leading-relaxed px-2">
                    {item.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer Colophon */}
      <footer className="pt-8 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
        <Link href="/works" className="hover:text-[var(--text-primary)] transition-colors">
          ← Back to Works
        </Link>
        <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">
          Workspace Index
        </Link>
      </footer>
    </main>
  );
}
