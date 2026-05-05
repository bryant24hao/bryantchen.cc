import type { Locale } from "@/lib/i18n";

export interface TalkEntry {
  slug: string;
  date: string;
  url: string;
  title: Record<Locale, string>;
  venue: Record<Locale, string>;
  description: Record<Locale, string>;
}

export const talks: TalkEntry[] = [
  {
    slug: "colorwander-2026-05-05",
    date: "2026-05-05",
    url: "/talk/colorwander-2026-05-05/",
    title: {
      zh: "从颜色看世界 — 做了个叫 ColorWander 的 iOS app",
      en: "Seeing the world in colors — building ColorWander",
    },
    venue: {
      zh: "直播分享 · vibe coding 听众 · 10–15 分钟",
      en: "Livestream · for vibe coders · 10–15 min",
    },
    description: {
      zh: "分享 App 开发的几个阶段：idea → 原型设计 → demo 验证 → 打磨细节和差异化 → 上架。",
      en: "From idea to launch — prototyping, validating, polishing, and shipping a vibe-coded iOS app.",
    },
  },
];

export function getTalks(): TalkEntry[] {
  return [...talks].sort((a, b) => b.date.localeCompare(a.date));
}
