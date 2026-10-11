"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyEmail({ email = "saleh@example.com" }: { email?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="inline-flex items-center gap-1.5 text-xs text-[#888888] hover:text-[#ededed] transition-colors py-1 px-2 -ml-2 rounded-md hover:bg-[#171717] font-mono group"
      title="Click to copy email"
    >
      {copied ? (
        <>
          <Check size={12} className="text-emerald-400" />
          <span className="text-emerald-400">Copied to clipboard</span>
        </>
      ) : (
        <>
          <Copy size={12} className="opacity-60 group-hover:opacity-100 transition-opacity" />
          <span>{email}</span>
        </>
      )}
    </button>
  );
}
