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
    slug: "ms-interns-2026-07-17",
    date: "2026-07-17",
    url: "/talk/ms-interns-2026-07-17/",
    title: {
      zh: "一人 × 多 Agent 的独立开发实践 — 从想法到产品发布",
      en: "One person × many Agents — indie building from idea to launch",
    },
    venue: {
      zh: "微软产品实习生分享",
      en: "Microsoft PM interns session",
    },
    description: {
      zh: "PM 是天生的 Agent 编排者：一人 × 多 Agent 的协作流水线与踩坑实录、ColorWander 从 0 到 1 的完整链路、增长与冷启动方法、工具箱判断力。",
      en: "PMs are natural agent orchestrators: my one-person × many-agents pipeline and pitfalls, ColorWander from 0 to 1, growth & cold-start playbook, and how to judge the toolbox.",
    },
  },
  {
    slug: "closed-door-2026-07-05",
    date: "2026-07-05",
    url: "/talk/closed-door-2026-07-05/",
    title: {
      zh: "闭门会分享",
      en: "Closed-door session",
    },
    venue: {
      zh: "闭门会 · 内部分享",
      en: "Closed-door session",
    },
    description: {
      zh: "选题 · 冷启动 · 增长/验证 · 一些原则 —— 一次闭门分享的提纲。",
      en: "Topic · cold-start · growth/validation · principles — a closed-door session outline.",
    },
  },
  {
    slug: "multi-agent-2026-06-06",
    date: "2026-06-06",
    url: "/talk/multi-agent-2026-06-06/",
    title: {
      zh: "一人 × 多 Agent — 从 Demo 到生产的协作与踩坑实录",
      en: "One person × many Agents — orchestration from demo to production",
    },
    venue: {
      zh: "StepFun · Building Agents That Work · 北京中关村",
      en: "StepFun · Building Agents That Work · Beijing",
    },
    description: {
      zh: "一个产品经理,用一支 Agent 团队,独自跑通从想法到盈利:我的编排操作系统、协作踩坑实录,以及一人公司的模型取舍。",
      en: "A product manager running a one-person company with a team of Agents — my orchestration OS, real collaboration pitfalls, and how a solo shop picks models.",
    },
  },
  {
    slug: "colorwander-2026-06-04",
    date: "2026-06-04",
    url: "/talk/colorwander-2026-06-04/",
    title: {
      zh: "从颜色看世界 — 做了个叫 ColorWander 的 iOS app",
      en: "Seeing the world in colors — building ColorWander",
    },
    venue: {
      zh: "bonjour! 社区公开分享 · 10–15 分钟",
      en: "bonjour! community talk · 10–15 min",
    },
    description: {
      zh: "从一人公司的日常到产品上线：idea → 原型 → demo → 主色提取算法 + 文学引言匹配 → 增长 0→1000 → 用户作品 → 踩过的坑。",
      en: "A one-person-company day to launch: idea → prototype → demo → color extraction & literary matching → growth 0→1000 → community works → lessons.",
    },
  },
  {
    slug: "pku-hci-2026-05-07",
    date: "2026-05-07",
    url: "/talk/pku-hci-2026-05-07/",
    title: {
      zh: "Agent 时代的产品实践 — 从想法到产品发布",
      en: "Product Practice in the Agent Era — from idea to ship",
    },
    venue: {
      zh: "北大 HCI 通识课业界讲座 · 文史 108 · 90 分钟",
      en: "PKU HCI Guest Lecture · 90 min",
    },
    description: {
      zh: "AI 从业者 + 独立开发者视角，分享过去一年的演进、AI Coding 完整链路（idea → 设计 → coding → eval → BIP）、2026 年工具箱的判断框架，以及给学生的建议。",
      en: "An industry + indie maker view: a year in review, the full AI Coding loop (idea → design → coding → eval → build-in-public), how to think about the 2026 toolbox, and advice for students.",
    },
  },
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
