"use client";

import { useChat } from "@ai-sdk/react";
import Link from "next/link";
import { ArrowUpRight, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const STARTER_PROMPTS = [
  {
    label: "Curiositora Breakdown",
    query: "Explain what Saleh built at Curiositora, the architecture behind it, and why it matters.",
  },
  {
    label: "Certifications & Credentials",
    query: "Tell me about Saleh's verified certifications from AWS, Meta, and DeepLearning.AI.",
  },
  {
    label: "Engineering & Architecture",
    query: "What is Saleh's technical approach to high-performance web systems and latency optimization?",
  },
  {
    label: "Background & Experience",
    query: "Summarize Saleh's engineering experience and his work across full-stack applications.",
  },
];

interface ReferenceCardData {
  title: string;
  href: string;
  type: string;
  desc: string;
}

function parseMessageContent(rawText: string) {
  const refRegex = /:::ref\{([^}]+)\}:::/g;
  const parts: Array<{ type: "text" | "ref"; content: string; refData?: ReferenceCardData }> = [];

  let lastIndex = 0;
  let match;

  while ((match = refRegex.exec(rawText)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: rawText.substring(lastIndex, match.index),
      });
    }

    const attrString = match[1];
    const data: ReferenceCardData = {
      title: "",
      href: "#",
      type: "Reference",
      desc: "",
    };

    const titleMatch = attrString.match(/title=["']([^"']+)["']/);
    const hrefMatch = attrString.match(/href=["']([^"']+)["']/);
    const typeMatch = attrString.match(/type=["']([^"']+)["']/);
    const descMatch = attrString.match(/desc=["']([^"']+)["']/);

    if (titleMatch) data.title = titleMatch[1];
    if (hrefMatch) data.href = hrefMatch[1];
    if (typeMatch) data.type = typeMatch[1];
    if (descMatch) data.desc = descMatch[1];

    parts.push({
      type: "ref",
      content: match[0],
      refData: data,
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < rawText.length) {
    parts.push({
      type: "text",
      content: rawText.substring(lastIndex),
    });
  }

  return parts;
}

export function AIBuddy() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isLoading = status === "streaming" || status === "submitted";

  // Reliable autoscroll to bottom on stream and new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input.trim() });
    setInput("");
  };

  const handlePromptClick = (query: string) => {
    if (isLoading) return;
    sendMessage({ text: query });
  };

  const getMessageText = (m: (typeof messages)[number]) => {
    if (m.parts && Array.isArray(m.parts)) {
      return m.parts
        .map((part) => (part.type === "text" ? part.text : ""))
        .join("");
    }
    if (typeof (m as any).content === "string") {
      return (m as any).content;
    }
    return "";
  };

  return (
    // Outer container spans 100% width and owns the scrollbar at the window edge
    <div
      ref={scrollContainerRef}
      className="flex-1 w-full overflow-y-auto bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-between"
    >
      {/* Wide Content Stream Container (max-w-5xl / max-w-6xl) */}
      <div className="w-full max-w-5xl lg:max-w-6xl mx-auto px-4 sm:px-8 md:px-12 pt-20 pb-12 space-y-6 flex-1">
        {/* Intro View when Empty */}
        {messages.length === 0 && (
          <div className="my-auto py-16 space-y-8 animate-in fade-in duration-500">
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
                Direct Inquiries
              </span>
              <h1 className="text-3xl sm:text-5xl font-normal tracking-tight text-[var(--text-primary)]">
                Ask Saleh's <span className="font-serif italic text-[var(--text-primary)]">AI</span>
              </h1>
              <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-sans max-w-2xl">
                Direct dialogue regarding Syed Muhammad Saleh's engineering architecture, full-stack systems, verified certifications, and shipped case studies.
              </p>
            </div>

            {/* Clean, Neutral Starter Prompts */}
            <div className="space-y-2.5 pt-2">
              <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
                Suggested Topics
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl">
                {STARTER_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePromptClick(p.query)}
                    className="text-left text-xs font-mono p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-subtle)] hover:border-neutral-400 dark:hover:border-neutral-600 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center justify-between group"
                  >
                    <span>{p.label}</span>
                    <span className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message Thread */}
        {messages.map((m) => {
          const isUser = m.role === "user";
          const rawText = getMessageText(m);
          if (!rawText && !isLoading) return null;

          const parsedParts = parseMessageContent(rawText);

          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"} space-y-1.5 w-full`}
            >
              <span className="text-[11px] font-mono text-[var(--text-muted)] px-1">
                {isUser ? "You" : "Saleh's Assistant"}
              </span>

              <div
                className={`rounded-2xl p-4 sm:p-6 text-sm sm:text-base leading-relaxed ${
                  isUser
                    ? "max-w-2xl bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 font-sans"
                    : "w-full bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-sm"
                }`}
              >
                <div className="space-y-3 font-sans">
                  {parsedParts.map((part, pIdx) => {
                    if (part.type === "text") {
                      if (!part.content.trim()) return null;

                      if (isUser) {
                        return (
                          <div key={pIdx} className="whitespace-pre-wrap leading-relaxed">
                            {part.content.trim()}
                          </div>
                        );
                      }

                      // Render Assistant Message with Proper Markdown
                      return (
                        <div key={pIdx} className="leading-relaxed">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h1: ({ children }) => (
                                <h1 className="text-xl sm:text-2xl font-medium mt-4 mb-2 text-[var(--text-primary)]">
                                  {children}
                                </h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="text-lg sm:text-xl font-medium mt-3 mb-2 text-[var(--text-primary)]">
                                  {children}
                                </h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="text-base sm:text-lg font-medium mt-3 mb-1 text-[var(--text-primary)]">
                                  {children}
                                </h3>
                              ),
                              p: ({ children }) => (
                                <p className="mb-2.5 last:mb-0 leading-relaxed text-[var(--text-primary)]">
                                  {children}
                                </p>
                              ),
                              ul: ({ children }) => (
                                <ul className="list-disc pl-5 my-2.5 space-y-1 text-[var(--text-primary)]">
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="list-decimal pl-5 my-2.5 space-y-1 text-[var(--text-primary)]">
                                  {children}
                                </ol>
                              ),
                              li: ({ children }) => (
                                <li className="leading-relaxed">{children}</li>
                              ),
                              table: ({ children }) => (
                                <div className="overflow-x-auto my-3 rounded-xl border border-[var(--border-subtle)]">
                                  <table className="w-full text-xs font-mono text-left border-collapse">
                                    {children}
                                  </table>
                                </div>
                              ),
                              thead: ({ children }) => (
                                <thead className="bg-[var(--bg-subtle)] border-b border-[var(--border-subtle)]">
                                  {children}
                                </thead>
                              ),
                              tbody: ({ children }) => (
                                <tbody className="divide-y divide-[var(--border-subtle)]">
                                  {children}
                                </tbody>
                              ),
                              tr: ({ children }) => (
                                <tr className="hover:bg-[var(--bg-subtle)]/50 transition-colors">
                                  {children}
                                </tr>
                              ),
                              th: ({ children }) => (
                                <th className="p-2.5 font-semibold text-[var(--text-primary)]">
                                  {children}
                                </th>
                              ),
                              td: ({ children }) => (
                                <td className="p-2.5 text-[var(--text-secondary)]">
                                  {children}
                                </td>
                              ),
                              code: ({ children, ...props }) => (
                                <code
                                  className="bg-[var(--bg-subtle)] px-1.5 py-0.5 rounded font-mono text-xs border border-[var(--border-subtle)] text-[var(--text-primary)]"
                                  {...props}
                                >
                                  {children}
                                </code>
                              ),
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-2 border-neutral-400 dark:border-neutral-600 pl-3 my-2 italic text-[var(--text-secondary)]">
                                  {children}
                                </blockquote>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-semibold text-[var(--text-primary)]">
                                  {children}
                                </strong>
                              ),
                              a: ({ href, children, ...props }) => {
                                const isInternal = href?.startsWith("/") || href?.startsWith("#");
                                if (isInternal) {
                                  return (
                                    <Link
                                      href={href || "#"}
                                      className="inline-flex items-center gap-1 font-mono text-xs text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-4 font-medium transition-colors"
                                      {...props}
                                    >
                                      <span>{children}</span>
                                      <ArrowUpRight size={12} className="inline opacity-80" />
                                    </Link>
                                  );
                                }
                                return (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 font-mono text-xs text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-4 font-medium transition-colors"
                                    {...props}
                                  >
                                    <span>{children}</span>
                                    <ArrowUpRight size={12} className="inline opacity-80" />
                                  </a>
                                );
                              },
                            }}
                          >
                            {part.content.trim()}
                          </ReactMarkdown>
                        </div>
                      );
                    }

                    // Render Clean Architectural Reference Card
                    if (part.type === "ref" && part.refData) {
                      const { title, href, type, desc } = part.refData;
                      return (
                        <Link
                          key={pIdx}
                          href={href}
                          className="block my-3 p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-subtle)] hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-[var(--bg-card)] transition-all group"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] group-hover:text-blue-400 transition-colors">
                                {type}
                              </span>
                              <h5 className="font-medium text-sm sm:text-base text-[var(--text-primary)] group-hover:text-blue-400 transition-colors">
                                {title}
                              </h5>
                              {desc && (
                                <p className="text-xs text-[var(--text-secondary)] font-sans line-clamp-2">
                                  {desc}
                                </p>
                              )}
                            </div>

                            <div className="inline-flex items-center gap-1 text-xs font-mono px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] group-hover:bg-[var(--bg-primary)] group-hover:border-neutral-400 dark:group-hover:border-neutral-600 transition-all shrink-0 font-medium">
                              <span>Open</span>
                              <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </div>
                          </div>
                        </Link>
                      );
                    }

                    return null;
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Minimal Typing Indicator */}
        {isLoading && (
          <div className="flex flex-col items-start space-y-1.5 w-full">
            <span className="text-[11px] font-mono text-[var(--text-muted)] px-1">
              Saleh's Assistant
            </span>
            <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse delay-150" />
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse delay-300" />
              <span className="ml-1 text-[var(--text-secondary)]">Formulating answer...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 text-xs font-mono">
            {error.message || "Failed to reach assistant. Please verify GROQ_API_KEY."}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sticky Bottom Input Bar — Wide, Centered with max-w-5xl / max-w-6xl */}
      <div className="sticky bottom-0 z-20 w-full border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]/90 backdrop-blur-md p-3 sm:p-4">
        <form onSubmit={handleSubmit} className="w-full max-w-5xl lg:max-w-6xl mx-auto flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything regarding Saleh's architecture, projects, or background..."
            disabled={isLoading}
            className="flex-1 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors font-sans disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 px-4 sm:px-5 py-3 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed font-sans font-medium text-sm flex items-center justify-center gap-1.5 shrink-0"
          >
            <span className="hidden sm:inline">Send</span>
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
