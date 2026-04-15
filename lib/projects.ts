import type { Locale } from "./i18n";

export type ProjectStatus = "earning" | "live" | "building" | "paused" | "archived";

export interface Project {
  name: string;
  description: Record<Locale, string>;
  url?: string;
  repo?: string;
  stars?: number;
  tags: string[];
  status?: ProjectStatus;
}

export const projects: Project[] = [
  {
    name: "ClawPuter",
    description: {
      zh: "M5Stack Cardputer（ESP32-S3）上的像素桌面伙伴。AI 聊天、语音输入、实时天气、macOS 桌面宠物同步。",
      en: "Pixel desktop companion for M5Stack Cardputer (ESP32-S3). AI chat, voice input, real-time weather, synced macOS desktop pet.",
    },
    repo: "https://github.com/bryant24hao/ClawPuter",
    stars: 94,
    tags: ["C++", "ESP32", "IoT"],
    status: "live",
  },
  {
    name: "MemoryX",
    description: {
      zh: "你的 AI 记忆伙伴。Chrome 插件已上线，帮你在浏览中自动记住、整理、浮现重要的信息。桌面端正在探索和 dogfooding 中，未来适时发布。",
      en: "Your AI memory companion. Chrome extension is live — automatically remembers, organizes, and surfaces what matters as you browse. Desktop app in exploration and dogfooding, to be released when ready.",
    },
    url: "https://chromewebstore.google.com/detail/lkfndjgbfadcaiooidegddhplcpifkge?utm_source=bryantchen.cc",
    tags: ["Chrome Extension", "AI"],
    status: "live",
  },
  {
    name: "AIBT",
    description: {
      zh: "AI Behavior Test — 让 AI 通过分析你的对话历史，给你做一份行为画像。",
      en: "AI Behavior Test — AI analyzes your conversation history to build a behavioral profile of you.",
    },
    url: "https://aibtapp.com",
    tags: ["Web", "AI"],
    status: "earning",
  },
  {
    name: "Curioso",
    description: {
      zh: "用 AI 驱动对话，把好奇心变成知识的 iOS app。",
      en: "iOS app that turns curiosity into knowledge through AI-powered conversations.",
    },
    tags: ["Swift", "iOS", "AI"],
    status: "paused",
  },
  {
    name: "拾刻 (Shike)",
    description: {
      zh: "Chrome 新标签页插件，拾取文学经典中的每一个时刻。",
      en: "Chrome new tab extension that surfaces literary moments from classic works.",
    },
    url: "https://chromewebstore.google.com/detail/agoanicnncfnnilkkihplfkpkpkhdbac?utm_source=bryantchen.cc",
    repo: "https://github.com/bryant24hao/shike",
    tags: ["HTML", "Chrome Extension"],
    status: "live",
  },
  {
    name: "Tab Cleanup",
    description: {
      zh: "一键清理浏览器标签页的 Chrome 插件。",
      en: "Chrome extension to clean up your browser tabs in one click.",
    },
    url: "https://chromewebstore.google.com/detail/tab-cleanup/eefjpecolahbfgfdpcjpfbeejoplfgnp?utm_source=bryantchen.cc",
    repo: "https://github.com/bryant24hao/tab-cleanup",
    tags: ["TypeScript", "Chrome Extension"],
    status: "live",
  },
  {
    name: "macos-calendar-assistant-skill",
    description: {
      zh: "OpenClaw 原生 macOS 日历技能，IM 优先的日程管理——规划、执行、回顾、安全去重。",
      en: "OpenClaw-native macOS calendar skill for IM-first schedule management — planning, execution, review, and safe dedup cleanup.",
    },
    repo: "https://github.com/bryant24hao/macos-calendar-assistant-skill",
    stars: 10,
    tags: ["Python", "OpenClaw"],
  },
  {
    name: "oc-doctor",
    description: {
      zh: "一条命令诊断你的 OpenClaw 配置。发现问题、解释影响、提供修复。",
      en: "One command to diagnose your entire OpenClaw setup. Finds problems, explains impact, offers fixes.",
    },
    repo: "https://github.com/bryant24hao/oc-doctor",
    stars: 2,
    tags: ["Shell", "OpenClaw"],
  },
  {
    name: "cc-speed",
    description: {
      zh: "分析 Claude Code token 输出速度的 CLI 工具。",
      en: "CLI tool to analyze Claude Code token output speed from local JSONL logs.",
    },
    repo: "https://github.com/bryant24hao/cc-speed",
    stars: 2,
    tags: ["TypeScript", "Claude Code"],
  },
];
