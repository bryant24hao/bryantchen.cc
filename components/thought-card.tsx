import type { ReactNode } from "react";
import { formatDate, type Thought } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { ThoughtShareButton } from "./thought-share-button";

interface ThoughtCardProps extends Thought {
  lang: Locale;
  rendered: ReactNode;
}

export function ThoughtCard({ slug, date, content, tags, lang, rendered }: ThoughtCardProps) {
  return (
    <div id={slug} className="py-4 border-b border-neutral-100 dark:border-neutral-800 last:border-0 scroll-mt-24">
      <p className="text-sm text-neutral-500 mb-1">{formatDate(date, lang)}</p>
      <div className="prose prose-sm text-neutral-800 dark:text-neutral-200 max-w-none">
        {rendered}
      </div>
      <div className="flex items-center justify-between mt-2">
        {tags && tags.length > 0 ? (
          <div className="flex gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-neutral-400 dark:text-neutral-500"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : (
          <div />
        )}
        <ThoughtShareButton
          content={content}
          date={date}
          slug={slug}
          lang={lang}
        />
      </div>
    </div>
  );
}
