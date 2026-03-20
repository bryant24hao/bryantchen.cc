import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/content";
import { locales } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of locales) {
    const routes = ["", "/thoughts", "/posts", "/projects", "/about"];
    for (const route of routes) {
      entries.push({
        url: `https://bryantchen.cc/${lang}${route}`,
        lastModified: new Date(),
      });
    }

    const posts = getPosts(lang);
    for (const post of posts) {
      entries.push({
        url: `https://bryantchen.cc/${lang}/posts/${post.slug}`,
        lastModified: new Date(post.date),
      });
    }
  }

  return entries;
}
