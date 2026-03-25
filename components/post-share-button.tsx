"use client";

import { useState, useCallback } from "react";
import { ShareCard } from "./share-card";

interface PostShareButtonProps {
  title: string;
  description: string;
  content: string;
  date: string;
  slug: string;
  lang: string;
}

export function PostShareButton({
  title,
  description,
  content,
  date,
  slug,
  lang,
}: PostShareButtonProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/${lang}/posts/${slug}`
      : `https://bryantchen.cc/${lang}/posts/${slug}`;

  return (
    <>
      <button
        onClick={handleOpen}
        className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors mt-8"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "8px 0",
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
        分享这篇文章
      </button>

      {open && (
        <ShareCard
          type="post"
          title={title}
          description={description}
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
