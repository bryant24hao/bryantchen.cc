export interface Project {
  name: string;
  description: string;
  url?: string;
  repo?: string;
  stars?: number;
  tags: string[];
}

export const projects: Project[] = [
  {
    name: "ClawPuter",
    description:
      "Pixel desktop companion for M5Stack Cardputer (ESP32-S3). AI chat, voice input, real-time weather, synced macOS desktop pet.",
    repo: "https://github.com/bryant24hao/ClawPuter",
    stars: 47,
    tags: ["C++", "ESP32", "IoT"],
  },
  {
    name: "MemoryX",
    description:
      "Personal digital companion with multi-agent collaboration. Remembers, organizes, and surfaces what matters to you.",
    tags: ["Swift", "iOS", "AI"],
  },
  {
    name: "Curioso",
    description:
      "iOS app that turns curiosity into knowledge through AI-powered conversations.",
    tags: ["Swift", "iOS", "AI"],
  },
  {
    name: "macos-calendar-assistant-skill",
    description:
      "OpenClaw-native macOS calendar skill for IM-first schedule management — planning, execution, review, and safe dedup cleanup.",
    repo: "https://github.com/bryant24hao/macos-calendar-assistant-skill",
    stars: 9,
    tags: ["Python", "OpenClaw"],
  },
  {
    name: "oc-doctor",
    description:
      "One command to diagnose your entire OpenClaw setup. Finds problems, explains impact, offers fixes.",
    repo: "https://github.com/bryant24hao/oc-doctor",
    stars: 2,
    tags: ["Shell", "OpenClaw"],
  },
  {
    name: "cc-speed",
    description:
      "CLI tool to analyze Claude Code token output speed from local JSONL logs.",
    repo: "https://github.com/bryant24hao/cc-speed",
    stars: 1,
    tags: ["TypeScript", "Claude Code"],
  },
  {
    name: "拾刻 (Shike)",
    description:
      "Chrome new tab extension that surfaces literary moments from classic works.",
    repo: "https://github.com/bryant24hao/shike",
    tags: ["HTML", "Chrome Extension"],
  },
];
