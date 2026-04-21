"use client";

import { useState } from "react";

export function CopyButton({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked — do nothing.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${label}`}
      title={copied ? "Copied" : `Copy ${label}`}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted transition hover:bg-hairline hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {copied ? (
        <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 text-accent">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 8.5l3.5 3.5L13 5"
          />
        </svg>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5">
          <rect
            x="4.5"
            y="4.5"
            width="8"
            height="8"
            rx="1.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
          />
          <path
            d="M3.5 10.5V3.5h7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
