import Link from "next/link";
import { formatDate } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

interface PostCardProps {
  slug: string;
  title: string;
  date: string;
  description: string;
  lang: Locale;
}

export function PostCard({ slug, title, date, description, lang }: PostCardProps) {
  return (
    <Link href={`/${lang}/posts/${slug}`} className="block group py-4">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-medium group-hover:underline underline-offset-2">
          {title}
        </h3>
        <span className="text-sm text-neutral-500 shrink-0">
          {formatDate(date, lang)}
        </span>
      </div>
      {description && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          {description}
        </p>
      )}
    </Link>
  );
}
