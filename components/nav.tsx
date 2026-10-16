import Link from "next/link";
import { getDictionary, type Locale } from "@/lib/i18n";
import { ThemePreview } from "@/components/theme-preview";

const navKeys = ["thoughts", "posts", "talks", "projects", "about"] as const;

export function Nav({ lang }: { lang: Locale }) {
  const t = getDictionary(lang).nav;

  return (
    <ThemePreview lang={lang}>
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
    </ThemePreview>
  );
}
