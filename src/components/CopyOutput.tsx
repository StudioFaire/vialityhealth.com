"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyOutput({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-foreground/70 mb-2">
        {label}
      </p>
      <div className="relative">
        <output className="p-4 pr-24 bg-muted rounded-lg break-all font-mono text-sm w-full block">
          {value}
        </output>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy to clipboard"
          className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-card text-foreground/70 text-[10px] uppercase tracking-widest hover:text-primary hover:border-primary/40 transition-colors"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
