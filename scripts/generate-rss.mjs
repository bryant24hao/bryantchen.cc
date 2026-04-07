import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");
const locales = ["zh", "en"];
const baseUrl = "https://bryantchen.cc";
const FEED_ITEMS_LIMIT = 30;

const siteInfo = {
  zh: {
    title: "Bryant Chen",
    description: "Bryant 的个人网站 — 独立开发、AI、产品思考",
    language: "zh-CN",
  },
  en: {
    title: "Bryant Chen",
    description:
      "Bryant's personal website — indie dev, AI, product thinking",
    language: "en",
  },
};

function getPosts(locale) {
  const dir = path.join(contentDir, locale, "posts");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf-8");
      const { data, content } = matter(raw);
      if (data.draft) return null;
      return {
        type: "post",
        slug: f.replace(/\.(mdx|md)$/, ""),
        title: data.title,
        date: data.date,
        description: data.description || "",
        content: content.trim(),
      };
    })
    .filter(Boolean);
}

function getThoughts(locale) {
  const dir = path.join(contentDir, locale, "thoughts");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf-8");
      const { data, content } = matter(raw);
      return {
        type: "thought",
        slug: f.replace(/\.md$/, ""),
        title: null,
        date: data.date,
        description:
          content.trim().length > 280
            ? content.trim().slice(0, 280) + "..."
            : content.trim(),
        content: content.trim(),
      };
    });
}

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeCdata(str) {
  return str.replace(/\]\]>/g, "]]]]><![CDATA[>");
}

function toRfc822(dateStr) {
  let normalized = dateStr;
  if (!dateStr.includes("T")) {
    normalized = dateStr + "T00:00:00Z";
  } else if (!/[Z+\-]\d{0,2}:?\d{0,2}$/.test(dateStr)) {
    normalized = dateStr + "Z";
  }
  return new Date(normalized).toUTCString();
}

function generateRss(locale) {
  const info = siteInfo[locale];
  const posts = getPosts(locale);
  const thoughts = getThoughts(locale);

  const items = [...posts, ...thoughts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, FEED_ITEMS_LIMIT);

  const itemsXml = items
    .map((item) => {
      const isPost = item.type === "post";
      const link = isPost
        ? `${baseUrl}/${locale}/posts/${item.slug}`
        : `${baseUrl}/${locale}/thoughts`;
      const guid = isPost
        ? `${baseUrl}/${locale}/posts/${item.slug}`
        : `${baseUrl}/${locale}/thoughts/${item.slug}`;
      const title = isPost
        ? escapeXml(item.title)
        : escapeXml(
            item.content.slice(0, 80) +
              (item.content.length > 80 ? "\u2026" : "")
          );

      return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="${isPost}">${guid}</guid>
      <pubDate>${toRfc822(item.date)}</pubDate>
      <description>${escapeXml(item.description)}</description>
      <content:encoded><![CDATA[${escapeCdata(item.content)}]]></content:encoded>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(info.title)}</title>
    <link>${baseUrl}/${locale}</link>
    <description>${escapeXml(info.description)}</description>
    <language>${info.language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/${locale}/feed.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>
`;
}

for (const locale of locales) {
  const rss = generateRss(locale);
  const dir = path.join("public", locale);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "feed.xml"), rss);
}

console.log("RSS feeds generated: /zh/feed.xml, /en/feed.xml");
