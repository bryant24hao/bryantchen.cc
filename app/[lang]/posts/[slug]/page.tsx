import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPosts, getPostBySlug, formatDate } from "@/lib/content";
import { locales, type Locale } from "@/lib/i18n";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { highlight } from "sugar-high";

function Code({ children, ...props }: React.ComponentProps<"code">) {
  const isInline = typeof children === "string" && !children.includes("\n");
  if (isInline) {
    return <code {...props}>{children}</code>;
  }
  const codeHTML = highlight(children as string);
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
}

const components = { code: Code };

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
  return locales.flatMap((lang) =>
    getPosts(lang).map((post) => ({ lang, slug: post.slug }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: l, slug } = await params;
  const post = getPostBySlug(l as Locale, slug);
  if (!post) return {};
  return { title: post.title, description: post.description };
}

export default async function PostPage({ params }: PageProps) {
  const { lang: langParam, slug } = await params;
  const lang = langParam as Locale;
  const post = getPostBySlug(lang, slug);
  if (!post) notFound();

  return (
    <article>
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">{post.title}</h1>
        <p className="text-sm text-neutral-500 mt-2">
          {formatDate(post.date, lang)}
        </p>
      </header>
      <div className="prose">
        <MDXRemote
          source={post.content}
          components={components}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm, remarkBreaks] } }}
        />
      </div>
    </article>
  );
}
