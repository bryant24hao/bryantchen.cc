import Link from "next/link";
import type { Locale } from "@/lib/i18n";

export function Footer({ lang }: { lang: Locale }) {
  const otherLang = lang === "zh" ? "en" : "zh";

  return (
    <footer className="py-8 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
      <p className="text-sm text-neutral-500">Bryant Chen</p>
      <div className="flex items-center gap-3">
        <a
          href={`/${lang}/feed.xml`}
          className="text-sm text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          RSS
        </a>
        <Link
          href={`/${otherLang}`}
          className="text-sm text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          {otherLang === "zh" ? "中文" : "English"}
        </Link>
      </div>
    </footer>
  );
}
