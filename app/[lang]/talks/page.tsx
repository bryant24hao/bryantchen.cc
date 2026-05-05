import type { Metadata } from "next";
import { getDictionary, type Locale } from "@/lib/i18n";
import { getTalks } from "@/lib/talks";
import { TalkCard } from "@/components/talk-card";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: l } = await params;
  const t = getDictionary(l as Locale).talks;
  return { title: t.title };
}

export default async function TalksPage({ params }: PageProps) {
  const { lang: langParam } = await params;
  const lang = langParam as Locale;
  const t = getDictionary(lang).talks;
  const talks = getTalks();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">{t.title}</h1>
      {talks.length === 0 ? (
        <p className="text-neutral-500">{t.empty}</p>
      ) : (
        talks.map((talk) => <TalkCard key={talk.slug} talk={talk} lang={lang} />)
      )}
    </div>
  );
}
