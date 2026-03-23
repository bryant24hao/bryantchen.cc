import { formatDate, type Thought } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

interface ThoughtCardProps extends Thought {
  lang: Locale;
}

const URL_RE = /(https?:\/\/[^\s]+)/g;

function Linkify({ text }: { text: string }) {
  const parts = text.split(URL_RE);
  return (
    <>
      {parts.map((part, i) =>
        URL_RE.test(part) ? (
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

export function ThoughtCard({ date, content, tags, lang }: ThoughtCardProps) {
  return (
    <div className="py-4 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
      <p className="text-sm text-neutral-500 mb-1">{formatDate(date, lang)}</p>
      <div className="text-sm text-neutral-800 dark:text-neutral-200 whitespace-pre-line leading-relaxed">
        <Linkify text={content} />
      </div>
      {tags && tags.length > 0 && (
        <div className="flex gap-2 mt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-neutral-400 dark:text-neutral-500"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
