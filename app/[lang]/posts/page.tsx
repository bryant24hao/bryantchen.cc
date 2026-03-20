import type { Metadata } from "next";
import { getPosts } from "@/lib/content";
import { getDictionary, locales, type Locale } from "@/lib/i18n";
import { PostCard } from "@/components/post-card";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: l } = await params;
  const t = getDictionary(l as Locale).posts;
  return { title: t.title };
}

export default async function PostsPage({ params }: PageProps) {
  const { lang: langParam } = await params;
  const lang = langParam as Locale;
  const t = getDictionary(lang).posts;
  const posts = getPosts(lang);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">{t.title}</h1>
      {posts.length === 0 ? (
        <p className="text-neutral-500">{t.empty}</p>
      ) : (
        posts.map((post) => <PostCard key={post.slug} lang={lang} {...post} />)
      )}
    </div>
  );
}
