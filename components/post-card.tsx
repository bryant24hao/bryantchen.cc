import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

interface PostCardProps {
  slug: string;
  title: string;
  date: string;
  description: string;
  lang: Locale;
  showCover?: boolean;
}

export function PostCard({
  slug,
  title,
  date,
  description,
  lang,
  showCover = false,
}: PostCardProps) {
  return (
    <Link
      href={`/${lang}/posts/${slug}`}
      className={
        showCover
          ? "group grid grid-cols-[96px_minmax(0,1fr)] gap-4 py-4 sm:grid-cols-[120px_minmax(0,1fr)]"
          : "group block py-4"
      }
    >
      {showCover && (
        <div className="relative aspect-3/2 overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-800">
          <Image
            src="/images/brand/blog-cover-thumb-v1.png"
            alt=""
            fill
            sizes="(max-width: 639px) 96px, 120px"
            className="object-cover"
          />
        </div>
      )}

      <div className={showCover ? "min-w-0" : undefined}>
        <div
          className={
            showCover
              ? "flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
              : "flex items-baseline justify-between gap-4"
          }
        >
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
      </div>
    </Link>
  );
}
