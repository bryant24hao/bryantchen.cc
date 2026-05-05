import { formatDate } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import type { TalkEntry } from "@/lib/talks";

interface TalkCardProps {
  talk: TalkEntry;
  lang: Locale;
}

export function TalkCard({ talk, lang }: TalkCardProps) {
  return (
    <a
      href={talk.url}
      target="_blank"
      rel="noopener"
      className="block group py-4"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-medium group-hover:underline underline-offset-2">
          {talk.title[lang]}
        </h3>
        <span className="text-sm text-neutral-500 shrink-0">
          {formatDate(talk.date, lang)}
        </span>
      </div>
      <p className="text-xs text-neutral-500 mt-1">{talk.venue[lang]}</p>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
        {talk.description[lang]}
      </p>
    </a>
  );
}
