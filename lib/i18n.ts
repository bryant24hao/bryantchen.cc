export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "zh";

const dictionaries = {
  zh: {
    nav: {
      thoughts: "碎碎念",
      posts: "文章",
      projects: "项目",
      about: "关于",
    },
    home: {
      intro:
        "我是 Bryant — 做了 7 年产品经理，现在全职做独立开发。造 AI 伙伴和开发者工具。一个住在桌面上，一个住在口袋里。",
      recentThoughts: "最近的碎碎念",
      recentPosts: "最近的文章",
      all: "全部",
    },
    thoughts: {
      title: "碎碎念",
      empty: "还没有内容。",
    },
    posts: {
      title: "文章",
      empty: "还没有内容。",
    },
    projects: {
      title: "项目",
    },
    evolution: {
      title: "进化史",
      subtitle: "这个网站是怎么长出来的。",
    },
    about: {
      title: "关于",
      intro1:
        "我是 Bryant — 做了 7 年产品经理，现在全职做独立开发。造 AI 伙伴和开发者工具。一个住在桌面上，一个住在口袋里。",
      intro2Pre: "前",
      intro2Link: "Motiff",
      intro2Post: "（AI 设计工具）产品经理。2026 年出来独立做自己想做的东西。",
      building: "在做的事",
      openSource: "开源项目",
      tech: "技术栈",
      techDetail:
        "C++、TypeScript、Python、Swift、Shell。硬件用 ESP32，AI 用 Claude。",
      contact: "联系方式",
      stars: "GitHub stars",
      chromeExtensions: "Chrome 插件",
      projectStatus: {
        earning: "有收入",
        live: "已上线",
        building: "开发中",
        paused: "搁置中",
        archived: "已归档",
      },
    },
    projectDescriptions: {
      MemoryX:
        "你的 AI 记忆伙伴。Chrome 插件已上线，帮你在浏览中自动记住、整理、浮现重要的信息。桌面端正在探索和 dogfooding 中，未来适时发布。",
      ClawPuter:
        "M5Stack Cardputer（ESP32-S3）上的像素桌面伙伴。AI 聊天、语音输入、实时天气、macOS 桌面宠物同步。[查看演示](https://img.bryantchen.cc/slides/clawputer-story)",
      Curioso: "一个用 AI 驱动对话把好奇心变成知识的 iOS app。",
      AIBT: "AI Behavior Test — 让 AI 通过分析你的对话历史，给你做一份行为画像。",
    },
    chromeExtensionDescriptions: {
      "拾刻 (Shike)": "Chrome 新标签页插件，拾取文学经典中的每一个时刻",
      "Tab Cleanup": "一键清理浏览器标签页",
    },
    openSourceDescriptions: {
      "macos-calendar-assistant-skill":
        "OpenClaw 原生 macOS 日历技能，IM 优先的日程管理",
      "oc-doctor": "一条命令诊断你的 OpenClaw 配置",
      "cc-speed": "分析 Claude Code token 输出速度的 CLI 工具",
      "skill-publisher":
        "一条命令把 agent skill 发布到 GitHub、ClawdHub 和 skills.sh",
    },
  },
  en: {
    nav: {
      thoughts: "thoughts",
      posts: "posts",
      projects: "projects",
      about: "about",
    },
    home: {
      intro:
        "Hi, I'm Bryant — PM turned builder. 7 years in product, now building AI companions and developer tools. One lives on your desktop, the other lives in your pocket.",
      recentThoughts: "Recent thoughts",
      recentPosts: "Recent posts",
      all: "all",
    },
    thoughts: {
      title: "Thoughts",
      empty: "Nothing here yet.",
    },
    posts: {
      title: "Posts",
      empty: "Nothing here yet.",
    },
    projects: {
      title: "Projects",
    },
    evolution: {
      title: "Evolution",
      subtitle: "How this site grew, one feature at a time.",
    },
    about: {
      title: "About",
      intro1:
        "I'm Bryant — 7 years in product, now building AI companions. One lives on your desktop, the other lives in your pocket.",
      intro2Pre: "Former PM at ",
      intro2Link: "Motiff",
      intro2Post:
        " (AI design tools). Went independent in 2026 to build things I care about.",
      building: "What I'm building",
      openSource: "Open source",
      tech: "Tech I work with",
      techDetail:
        "C++, TypeScript, Python, Swift, Shell. ESP32 for hardware. Claude for AI.",
      contact: "Get in touch",
      stars: "stars on GitHub",
      chromeExtensions: "Chrome Extensions",
      projectStatus: {
        earning: "Earning",
        live: "Live",
        building: "Building",
        paused: "Paused",
        archived: "Archived",
      },
    },
    projectDescriptions: {
      MemoryX:
        "Your AI memory companion. Chrome extension is live — automatically remembers, organizes, and surfaces what matters as you browse. Desktop app in exploration and dogfooding, to be released when ready.",
      ClawPuter:
        "A pixel desktop companion for M5Stack Cardputer (ESP32-S3). AI chat, voice input, real-time weather, synced macOS desktop pet. [View slides](https://img.bryantchen.cc/slides/clawputer-story)",
      Curioso:
        "An iOS app that turns curiosity into knowledge through AI-powered conversations.",
      AIBT: "AI Behavior Test — AI analyzes your conversation history to build a behavioral profile of you.",
    },
    chromeExtensionDescriptions: {
      "拾刻 (Shike)":
        "Chrome new tab extension that surfaces literary moments",
      "Tab Cleanup": "Clean up your browser tabs in one click",
    },
    openSourceDescriptions: {
      "macos-calendar-assistant-skill":
        "OpenClaw-native macOS calendar skill for IM-first schedule management",
      "oc-doctor": "One command to diagnose your entire OpenClaw setup",
      "cc-speed": "CLI tool to analyze Claude Code token output speed",
      "skill-publisher":
        "One command to publish your agent skill to GitHub, ClawdHub, and skills.sh",
    },
  },
} as const;

export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export function isValidLocale(lang: string): lang is Locale {
  return locales.includes(lang as Locale);
}
