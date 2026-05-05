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
  {
    slug: "aibt-intro",
    date: "2026-04-21",
    url: "/talk/aibt-intro/",
    title: {
      zh: "AIBT — 一个晚上做出来的 AI 性格测试",
      en: "AIBT — building an AI personality test in one night",
    },
    venue: {
      zh: "产品介绍 · aibtapp.com",
      en: "Product intro · aibtapp.com",
    },
    description: {
      zh: "AI Behavior Test 的诞生过程：从 idea 到上线只用了一晚，让 AI 通过对话历史给你做一份行为画像。",
      en: "How AI Behavior Test went from idea to launch in one night — AI builds a behavioral profile from your chat history.",
    },
  },
  {
    slug: "clawputer-story",
    date: "2026-03-27",
    url: "/talk/clawputer-story/",
    title: {
      zh: "把虾装进硬件：ClawPuter 的诞生故事",
      en: "Putting the shrimp in hardware: the ClawPuter story",
    },
    venue: {
      zh: "养虾故事大会 · 豪大·OPC",
      en: "OpenClaw Story Conference · 豪大·OPC",
    },
    description: {
      zh: "M5 Cardputer 上的像素桌面伙伴 ClawPuter 如何从一个想法长成开源项目，并积累 100+ stars。",
      en: "How ClawPuter — a pixel desktop companion for M5 Cardputer — grew from an idea into a 100+ star open source project.",
    },
  },
];

export function getTalks(): TalkEntry[] {
  return [...talks].sort((a, b) => b.date.localeCompare(a.date));
}
