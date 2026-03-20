import type { Metadata } from "next";
import { getThoughts } from "@/lib/content";
import { getDictionary, type Locale } from "@/lib/i18n";
import { ThoughtCard } from "@/components/thought-card";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: l } = await params;
  const t = getDictionary(l as Locale).thoughts;
  return { title: t.title };
}

export default async function ThoughtsPage({ params }: PageProps) {
  const { lang: langParam } = await params;
  const lang = langParam as Locale;
  const t = getDictionary(lang).thoughts;
  const thoughts = getThoughts(lang);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">{t.title}</h1>
      {thoughts.length === 0 ? (
        <p className="text-neutral-500">{t.empty}</p>
      ) : (
        thoughts.map((thought) => (
          <ThoughtCard key={thought.slug} lang={lang} {...thought} />
        ))
      )}
    </div>
  );
}
