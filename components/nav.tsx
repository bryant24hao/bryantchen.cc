import Link from "next/link";
import { getDictionary, type Locale } from "@/lib/i18n";

const navKeys = ["thoughts", "posts", "projects", "about"] as const;

export function Nav({ lang }: { lang: Locale }) {
  const t = getDictionary(lang).nav;
  const otherLang = lang === "zh" ? "en" : "zh";

  return (
    <nav className="flex items-center justify-between py-8">
      <Link href={`/${lang}`} className="font-semibold tracking-tight">
        Bryant Chen
      </Link>
      <div className="flex items-center gap-6 text-sm text-neutral-600 dark:text-neutral-400">
        {navKeys.map((key) => (
          <Link
            key={key}
            href={`/${lang}/${key}`}
            className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            {t[key]}
          </Link>
        ))}
        <Link
          href={`/${otherLang}`}
          className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          {otherLang === "zh" ? "中文" : "EN"}
        </Link>
      </div>
    </nav>
  );
}
