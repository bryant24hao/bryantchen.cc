import type { Locale } from "./i18n";

export type ProjectStatus = "earning" | "live" | "building" | "paused" | "archived" | "demo" | "openSource";

export const projectCategories = ["app", "web", "extension", "hardware", "skill"] as const;
export type ProjectCategory = (typeof projectCategories)[number];

export interface Project {
  name: string;
  description: Record<Locale, string>;
  url?: string;
  repo?: string;
  stars?: number;
  tags: string[];
  categories: ProjectCategory[];
  period: {
    start: string;
    end?: string;
    note?: Record<Locale, string>;
  };
  status?: ProjectStatus;
}

export const projects: Project[] = [
  {
    name: "ColorWander",
    categories: ["app"],
    period: { start: "2026-04", end: "present" },
    description: {
      zh: "从照片中提取配色，做成色卡、票据、明信片和动态纪念卡。搭配文字与不同版式，让喜欢的照片有更多表达。目前的主力项目。",
      en: "Draw colours from photos to make colour cards, tickets, postcards and animated keepsakes. Combine words and layouts to give your favourite photos new ways to tell a story. My main project right now.",
    },
    url: "https://colorwander.app",
    tags: ["Swift", "iOS", "Design"],
    status: "earning",
  },
  {
    name: "StepRoll",
    categories: ["app"],
    period: { start: "2026-10", end: "present" },
    description: {
      zh: "把 Apple 健康里的跑步、散步和骑行记录变成运动小票。用路线墙回看走过的路，也能生成不同时间段的运动总结。",
      en: "Turn runs, walks and rides from Apple Health into workout receipts. Revisit your routes on a Route Wall and create summaries for different time periods.",
    },
    url: "https://apps.apple.com/app/id6819030613",
    tags: ["Swift", "iOS", "HealthKit"],
    status: "live",
  },
  {
    name: "deskpet-firmware",
    categories: ["hardware"],
    period: { start: "2026-04", end: "present" },
    description: {
      zh: "M5 Cardputer 上的像素桌宠，通过蓝牙响应 Claude Code 的工作状态，还能直接用键盘批准或拒绝操作。基于 anthropics/claude-desktop-buddy 的社区移植版。[查看演示](https://x.com/bryantChenzh/status/2045789893931282475)",
      en: "A pixel desk pet on M5 Cardputer that responds to Claude Code over Bluetooth, with keyboard controls to approve or deny operations. A community port of anthropics/claude-desktop-buddy. [View demo](https://x.com/bryantChenzh/status/2045789893931282475)",
    },
    repo: "https://github.com/bryant24hao/deskpet-firmware",
    stars: 36,
    tags: ["C++", "ESP32", "BLE"],
    status: "openSource",
  },
  {
    name: "ClawPuter",
    categories: ["hardware"],
    period: { start: "2026-03", end: "present" },
    description: {
      zh: "M5Stack Cardputer 上的像素伙伴，结合 AI 对话、语音、实时天气和 Mac 桌宠同步，把 AI 放进一台小设备。[查看演示](https://bryantchen.cc/talk/clawputer-story/)",
      en: "A pixel companion on M5Stack Cardputer, bringing AI chat, voice, live weather and Mac desktop pet sync together in a tiny device. [View slides](https://bryantchen.cc/talk/clawputer-story/)",
    },
    repo: "https://github.com/bryant24hao/ClawPuter",
    stars: 160,
    tags: ["C++", "ESP32", "IoT"],
    status: "openSource",
  },
  {
    name: "MemoryX",
    categories: ["app", "extension"],
    period: { start: "2026-01", end: "2026-04" },
    description: {
      zh: "连接桌面 AI 助手与浏览器扩展，把 ChatGPT、Claude、Gemini 中的对话整理成可复用的记忆，让不同 AI 都能延续对你的理解。2026 年 4 月起暂停迭代。",
      en: "A desktop AI assistant and browser extension that turn conversations across ChatGPT, Claude and Gemini into reusable memory, carrying your context between AI tools. Development paused in April 2026.",
    },
    url: "https://memoryx.cc",
    tags: ["Desktop App", "Chrome Extension", "AI"],
    status: "paused",
  },
  {
    name: "AIBT",
    categories: ["web"],
    period: { start: "2026-04", note: { zh: "一晚完成", en: "Built in one night" } },
    description: {
      zh: "一个晚上做出来的 AI 行为画像小工具：让 AI 分析你的历史对话，生成个人行为画像。也是我的第一个获得付费收入的产品。[查看介绍](https://bryantchen.cc/talk/aibt-intro/)",
      en: "An AI behaviour profiling tool built in one night: it analyzes your past conversations to create a personal profile. My first product to earn revenue. [View intro](https://bryantchen.cc/talk/aibt-intro/)",
    },
    url: "https://aibtapp.com",
    tags: ["Web", "AI"],
    status: "earning",
  },
  {
    name: "Curioso",
    categories: ["app"],
    period: { start: "2026-02" },
    description: {
      zh: "AI 博物馆伴侣：拍照识别艺术品、收听讲解，并把看过的作品整理成自己的艺术旅行记录。",
      en: "An AI museum companion: identify artworks from photos, listen to their stories, and collect the works you have seen into a personal art travel journal.",
    },
    tags: ["Swift", "iOS", "AI"],
    status: "demo",
  },
  {
    name: "拾刻 (Shike)",
    categories: ["extension"],
    period: { start: "2026-03" },
    description: {
      zh: "用文学作品中的时间描写显示此刻，让新标签页成为一座文学时钟。背景随时间变色，也能把喜欢的片刻导出成图片。",
      en: "A literary clock for your new tab, showing passages that match the current time. The background changes colour as time passes, and you can export your favourite moments as images.",
    },
    url: "https://chromewebstore.google.com/detail/agoanicnncfnnilkkihplfkpkpkhdbac?utm_source=bryantchen.cc",
    repo: "https://github.com/bryant24hao/shike",
    tags: ["HTML", "Chrome Extension"],
    status: "live",
  },
  {
    name: "Tab Cleanup",
    categories: ["extension"],
    period: { start: "2024-12" },
    description: {
      zh: "按闲置时间整理浏览器标签页，支持定时自动清理，并保留当前、固定和正在播放音频的标签页。",
      en: "Organize browser tabs by how long they have been inactive, with scheduled cleanup that preserves your active tab, pinned tabs and tabs playing audio.",
    },
    url: "https://chromewebstore.google.com/detail/tab-cleanup/eefjpecolahbfgfdpcjpfbeejoplfgnp?utm_source=bryantchen.cc",
    repo: "https://github.com/bryant24hao/tab-cleanup",
    tags: ["TypeScript", "Chrome Extension"],
    status: "live",
  },
  {
    name: "macos-calendar-assistant-skill",
    categories: ["skill"],
    period: { start: "2026-03" },
    description: {
      zh: "在聊天中安排和调整日程，同步到 macOS 日历，把每周计划、每日执行与复盘连起来。",
      en: "Plan and adjust your schedule in chat, sync it to macOS Calendar, and connect weekly planning with daily work and reflection.",
    },
    repo: "https://github.com/bryant24hao/macos-calendar-assistant-skill",
    stars: 11,
    tags: ["Python", "OpenClaw"],
    status: "openSource",
  },
  {
    name: "oc-doctor",
    categories: ["skill"],
    period: { start: "2026-03" },
    description: {
      zh: "给 OpenClaw 做一次配置体检，检查会话、模型、定时任务和网关等问题，生成报告并协助修复。",
      en: "Give your OpenClaw setup a health check: inspect sessions, models, scheduled tasks and the gateway, then get a report and help with fixes.",
    },
    repo: "https://github.com/bryant24hao/oc-doctor",
    stars: 2,
    tags: ["Shell", "OpenClaw"],
    status: "openSource",
  },
  {
    name: "cc-speed",
    categories: ["skill"],
    period: { start: "2026-02" },
    description: {
      zh: "从本地日志分析 Claude Code 的输出速度，按模型查看统计、每日趋势和图表，也可通过 /speed 技能调用。",
      en: "Analyze Claude Code output speed from local logs, with per-model statistics, daily trends and charts. Also available through the /speed skill.",
    },
    repo: "https://github.com/bryant24hao/cc-speed",
    stars: 2,
    tags: ["TypeScript", "Claude Code"],
    status: "openSource",
  },
];
