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

export interface ActivityDay {
  date: string; // YYYY-MM-DD
  wordCount: number;
  posts: number;
  thoughts: number;
}

export function getActivityData(locale: Locale): ActivityDay[] {
  const posts = getPosts(locale);
  const thoughts = getThoughts(locale);
  const map = new Map<string, { wordCount: number; posts: number; thoughts: number }>();

  for (const post of posts) {
    const day = toDateKey(post.date);
    const entry = map.get(day) || { wordCount: 0, posts: 0, thoughts: 0 };
    entry.wordCount += countWords(post.content, locale);
    entry.posts += 1;
    map.set(day, entry);
  }

  for (const thought of thoughts) {
    const day = toDateKey(thought.date);
    const entry = map.get(day) || { wordCount: 0, posts: 0, thoughts: 0 };
    entry.wordCount += countWords(thought.content, locale);
    entry.thoughts += 1;
    map.set(day, entry);
  }

  return Array.from(map.entries()).map(([date, data]) => ({ date, ...data }));
}

function toDateKey(dateStr: string): string {
  return dateStr.includes("T") ? dateStr.slice(0, 10) : dateStr;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~]+/g, "");
}

function countWords(text: string, locale: Locale): number {
  const cleaned = stripMarkdown(text);
  if (locale === "zh") {
    const cjk = (cleaned.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
    const eng = (cleaned.match(/[a-zA-Z]+/g) || []).length;
    return cjk + eng;
  }
  return (cleaned.match(/\S+/g) || []).length;
}

// Parse date string: supports "YYYY-MM-DD" and "YYYY-MM-DDTHH:mm:ss"
function parseDate(dateStr: string): Date {
  if (dateStr.includes("T")) return new Date(dateStr);
  return new Date(dateStr + "T00:00:00");
}

export function formatDate(dateStr: string, locale: Locale): string {
  const date = parseDate(dateStr);
  const hasTime = dateStr.includes("T");
  const datePart = date.toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  if (!hasTime) return datePart;
  const timePart = date.toLocaleTimeString(locale === "zh" ? "zh-CN" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${datePart} ${timePart}`;
}
