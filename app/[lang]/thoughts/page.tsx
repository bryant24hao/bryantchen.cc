import type { Metadata } from "next";
import { getThoughts } from "@/lib/content";
import { getDictionary, type Locale } from "@/lib/i18n";
import { ThoughtCard } from "@/components/thought-card";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

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

  const compiled = await Promise.all(
    thoughts.map(async (thought) => {
      const { content: rendered } = await compileMDX({
        source: thought.content,
        options: { mdxOptions: { remarkPlugins: [remarkGfm, remarkBreaks] } },
      });
      return { ...thought, rendered };
    })
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">{t.title}</h1>
      {compiled.length === 0 ? (
        <p className="text-neutral-500">{t.empty}</p>
      ) : (
        compiled.map((thought) => (
          <ThoughtCard key={thought.slug} lang={lang} {...thought} />
        ))
      )}
    </div>
  );
}
