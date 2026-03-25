"use client";

import { useState, useCallback } from "react";
import { ShareCard } from "./share-card";

interface ThoughtShareButtonProps {
  content: string;
  date: string;
  slug: string;
  lang: string;
}

export function ThoughtShareButton({
  content,
  date,
  slug,
  lang,
}: ThoughtShareButtonProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/${lang}/thoughts#${slug}`
      : `https://bryantchen.cc/${lang}/thoughts#${slug}`;

  return (
    <>
      <button
        onClick={handleOpen}
        aria-label="Share"
        className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 4,
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
      </button>

      {open && (
        <ShareCard
          type="thought"
          content={content}
          date={date}
          lang={lang}
          url={url}
          onClose={handleClose}
        />
      )}
    </>
  );
}
