import Link from "next/link";
import { getThoughts, getPosts } from "@/lib/content";
import { getDictionary, type Locale } from "@/lib/i18n";
import { ThoughtCard } from "@/components/thought-card";
import { PostCard } from "@/components/post-card";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function Home({ params }: PageProps) {
  const { lang: langParam } = await params;
  const lang = langParam as Locale;
  const t = getDictionary(lang).home;
  const thoughts = getThoughts(lang).slice(0, 5);
  const posts = getPosts(lang).slice(0, 3);

  const compiledThoughts = await Promise.all(
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
      <section className="mb-12">
        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {t.intro}
        </p>
      </section>

      {compiledThoughts.length > 0 && (
        <section className="mb-12">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-semibold">{t.recentThoughts}</h2>
            <Link
              href={`/${lang}/thoughts`}
              className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              {t.all} &rarr;
            </Link>
          </div>
          {compiledThoughts.map((thought) => (
            <ThoughtCard key={thought.slug} lang={lang} {...thought} />
          ))}
        </section>
      )}

      {posts.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-semibold">{t.recentPosts}</h2>
            <Link
              href={`/${lang}/posts`}
              className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              {t.all} &rarr;
            </Link>
          </div>
          {posts.map((post) => (
            <PostCard key={post.slug} lang={lang} {...post} />
          ))}
        </section>
      )}
    </div>
  );
}
