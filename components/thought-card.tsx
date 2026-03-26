import { formatDate, type Thought } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { ThoughtShareButton } from "./thought-share-button";

interface ThoughtCardProps extends Thought {
  lang: Locale;
}

const URL_RE = /(https?:\/\/[^\s\u3000-\u303F\uFF00-\uFFEF\u3001\u3002\uff0c\uff0e\uff1b\uff1a\uff01\uff1f\u201c\u201d\u2018\u2019\u300a\u300b\u3010\u3011]+)/g;
const URL_TEST = /^https?:\/\//;

function Linkify({ text }: { text: string }) {
  const parts = text.split(URL_RE);
  return (
    <>
      {parts.map((part, i) =>
        URL_TEST.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:decoration-2 break-all"
          >
            {part}
          </a>
        ) : (
          part
        )
      )}
    </>
  );
}

export function ThoughtCard({ slug, date, content, tags, lang }: ThoughtCardProps) {
  return (
    <div id={slug} className="py-4 border-b border-neutral-100 dark:border-neutral-800 last:border-0 scroll-mt-24">
      <p className="text-sm text-neutral-500 mb-1">{formatDate(date, lang)}</p>
      <div className="text-neutral-800 dark:text-neutral-200 whitespace-pre-line">
        <Linkify text={content} />
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
