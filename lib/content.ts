import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Locale } from "./i18n";

const contentDir = path.join(process.cwd(), "content");

export interface Thought {
  slug: string;
  date: string;
  content: string;
  tags?: string[];
  image?: string;
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags?: string[];
  draft?: boolean;
  content: string;
}

export function getThoughts(locale: Locale): Thought[] {
  const dir = path.join(contentDir, locale, "thoughts");
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const thoughts = files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);
    const slug = file.replace(/\.md$/, "");
    return {
      slug,
      date: data.date,
      content: content.trim(),
      tags: data.tags,
      image: data.image,
    } as Thought;
  });

  return thoughts.sort(
    (a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime()
  );
}

export function getPosts(locale: Locale): Post[] {
  const dir = path.join(contentDir, locale, "posts");
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  const posts = files
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      const slug = file.replace(/\.(mdx|md)$/, "");
      // Strip leading h1 if it duplicates the frontmatter title
      let body = content;
      if (data.title) {
        const h1Re = /^\s*#\s+(.+)\s*\n/;
        const match = body.match(h1Re);
        if (match && match[1].trim() === data.title.trim()) {
          body = body.replace(h1Re, "");
        }
      }

      return {
        slug,
        title: data.title,
        date: data.date,
        description: data.description || "",
        tags: data.tags,
        draft: data.draft ?? false,
        content: body,
      } as Post;
    })
    .filter((post) => !post.draft);

  return posts.sort(
    (a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime()
  );
}

export function getPostBySlug(
  locale: Locale,
  slug: string
): Post | undefined {
  const posts = getPosts(locale);
  return posts.find((p) => p.slug === slug);
}

// Parse date string: supports "YYYY-MM-DD" and "YYYY-MM-DDTHH:mm:ss"
function parseDate(dateStr: string): Date {
  if (dateStr.includes("T")) return new Date(dateStr);
  return new Date(dateStr + "T00:00:00");
}

export function formatDate(dateStr: string, locale: Locale): string {
  const date = parseDate(dateStr);
  return date.toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
