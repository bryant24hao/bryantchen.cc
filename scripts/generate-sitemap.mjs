import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");
const locales = ["zh", "en"];
const baseUrl = "https://bryantchen.cc";

function getPosts(locale) {
  const dir = path.join(contentDir, locale, "posts");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf-8");
      const { data } = matter(raw);
      if (data.draft) return null;
      return { slug: f.replace(/\.(mdx|md)$/, ""), date: data.date };
    })
    .filter(Boolean);
}

const entries = [];
const today = new Date().toISOString().split("T")[0];

for (const lang of locales) {
  for (const route of ["", "/thoughts", "/posts", "/projects", "/about"]) {
    entries.push(`  <url><loc>${baseUrl}/${lang}${route}</loc><lastmod>${today}</lastmod></url>`);
  }
  for (const post of getPosts(lang)) {
    entries.push(`  <url><loc>${baseUrl}/${lang}/posts/${post.slug}</loc><lastmod>${post.date.slice(0, 10)}</lastmod></url>`);
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;

fs.writeFileSync(path.join("public", "sitemap.xml"), xml);
console.log(`Sitemap generated: ${entries.length} URLs`);
