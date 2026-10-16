import Link from "next/link";
import { getDictionary, type Locale } from "@/lib/i18n";
import { ThemeToggle } from "@/components/theme-toggle";

const navKeys = ["thoughts", "posts", "talks", "projects", "about"] as const;

export function Nav({ lang }: { lang: Locale }) {
  const t = getDictionary(lang).nav;

  return (
    <nav className="site-nav" aria-label={lang === "zh" ? "主导航" : "Main navigation"}>
      <Link href={`/${lang}`} className="font-semibold tracking-tight">
        Bryant Chen
      </Link>
      <div className="site-nav-links text-sm text-neutral-600 dark:text-neutral-400">
        {navKeys.map((key) => (
          <Link
            key={key}
            href={`/${lang}/${key}`}
            className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            {t[key]}
          </Link>
        ))}
      </div>
      <ThemeToggle lang={lang} />
    </nav>
  );
}
