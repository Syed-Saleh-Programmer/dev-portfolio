"use client";

import { useChat } from "@ai-sdk/react";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SUGGESTED_PROMPTS = [
  "What was his role as CTO?",
  "Tell me about Curiositora",
  "What is his core tech stack?",
];

export function AIChat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input.trim() });
    setInput("");
  };

  const handlePromptClick = (prompt: string) => {
    if (isLoading) return;
    sendMessage({ text: prompt });
  };

  const getMessageText = (m: (typeof messages)[number]) => {
    if (m.parts && Array.isArray(m.parts)) {
      return m.parts
        .map((part) => (part.type === "text" ? part.text : ""))
        .join("");
    }
    return "";
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden relative group shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-blue-600/30 to-purple-600/30 border border-blue-500/20 text-blue-400 rounded-xl">
            <Bot size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-zinc-100 text-sm">Nexus AI</h3>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-xs text-zinc-400">Interactive Resume & Portfolio Co-Pilot</p>
          </div>
        </div>
        <div className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/50">
          Groq OSS
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {messages.length === 0 && (
          <div className="text-center text-sm text-zinc-400 my-auto h-full flex flex-col items-center justify-center py-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-purple-600/20 border border-zinc-800 flex items-center justify-center mb-3 text-blue-400">
              <Sparkles size={24} />
            </div>
            <p className="font-medium text-zinc-200">Hi! I'm Saleh's AI Co-Pilot.</p>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs">
              Ask me anything about his technical experience, engineering philosophy, or projects.
            </p>

            {/* Quick Prompts */}
            <div className="mt-5 flex flex-col gap-2 w-full max-w-xs">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handlePromptClick(prompt)}
                  className="text-left text-xs bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 hover:text-white px-3 py-2 rounded-xl border border-zinc-700/50 hover:border-zinc-600 transition-all flex items-center justify-between group/btn"
                >
                  <span>{prompt}</span>
                  <span className="opacity-0 group-hover/btn:opacity-100 text-blue-400 transition-opacity">→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => {
          const isUser = m.role === "user";
          const text = getMessageText(m);
          if (!text && !isLoading) return null;

          return (
            <div
              key={m.id}
              className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                  <Bot size={14} />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                  isUser
                    ? "bg-blue-600 text-white rounded-tr-none shadow-md"
                    : "bg-zinc-800/90 text-zinc-200 rounded-tl-none border border-zinc-700/60"
                }`}
              >
                {text}
              </div>
              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shrink-0 mt-0.5">
                  <User size={14} />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2.5 justify-start items-center">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Bot size={14} />
            </div>
            <div className="bg-zinc-800 text-zinc-400 p-3 rounded-2xl rounded-tl-none text-xs border border-zinc-700/50 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-blue-400" />
              <span>Thinking with Groq...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800/50 text-red-300 rounded-xl text-xs">
            {error.message || "Failed to reach AI assistant. Please check your GROQ_API_KEY."}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-zinc-800/60 bg-zinc-950/40 mt-auto flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about Saleh..."
          disabled={isLoading}
          className="flex-1 bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-blue-600/20"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
