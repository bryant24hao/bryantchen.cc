# Project Category Filters Implementation Plan

**Goal:** Filter the bilingual projects page by App, Web, Extension, Hardware, or Skill. Include cc-speed under Skill because it supports the `/speed` skill workflow; no separate Tool category.

**Architecture:** Add explicit, multi-valued categories to project data. A client list component owns a single selected category, initially All, while the page remains server rendered with its existing metadata. Display the confirmed bilingual descriptions, status, links, and project periods. Preserve the reading-light interaction and pure-white light theme.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS.

1. Add a typed category list and category assignments in `lib/projects.ts`.
2. Add Chinese and English category labels and result announcements in `lib/i18n.ts`.
3. Add `components/project-list.tsx` with wrapping native filter buttons, pressed states, keyboard focus indicators, and an accessible result count. Render every project on the initial server response.
4. Use the list component in `app/[lang]/projects/page.tsx`.
5. Run the production build and inspect each category, reset, both languages, and narrow-screen layout in the browser. Use the existing preview server; no new dependency or mirrored unit test is needed.
6. All project details were confirmed individually. Refresh the five open-source star counts, verify the combined update, publish, and check the live page.

## Confirmed project links

- ColorWander links to `https://colorwander.app`.
- StepRoll links to `https://apps.apple.com/app/id6819030613` and belongs to App. Its copy, live status, and timeline are confirmed below.

## Per-project confirmations

- ColorWander: App; 2026.04–present; earning and actively developed. Approved Chinese copy: 从照片中提取配色，做成色卡、票据、明信片和动态纪念卡。搭配文字与不同版式，让喜欢的照片有更多表达。目前的主力项目。
- StepRoll: App; 2026.10–present; live. Approved Chinese copy: 把 Apple 健康里的跑步、散步和骑行记录变成运动小票。用路线墙回看走过的路，也能生成不同时间段的运动总结。
- deskpet-firmware: Hardware; 2026.04–present; open source. Approved Chinese copy: M5 Cardputer 上的像素桌宠，通过蓝牙响应 Claude Code 的工作状态，还能直接用键盘批准或拒绝操作。基于 anthropics/claude-desktop-buddy 的社区移植版。
- User requested current GitHub star counts; refresh them again before final publication.
- User clarified that Shike and Tab Cleanup should not be presented as open-source projects. Keep their Extension category and Live status, link to the Chrome Web Store, and do not display GitHub star counts for either.
- ClawPuter: Hardware; 2026.03–present; open source; GitHub link. Approved Chinese copy: M5Stack Cardputer 上的像素伙伴，结合 AI 对话、语音、实时天气和 Mac 桌宠同步，把 AI 放进一台小设备。
- MemoryX: Desktop App and Extension; 2026.01–2026.04; paused since April 2026; link to `https://memoryx.cc`. Use the cross-platform AI memory description with explicit desktop app and extension positioning. Do not show an ongoing date range or imply active development.
- AIBT: Confirmed Web category, earning status, and `https://aibtapp.com` link. Time is `2026.04 · 一晚完成` / `2026.04 · Built in one night`, without an ongoing range. Approved Chinese copy: 一个晚上做出来的 AI 行为画像小工具：让 AI 分析你的历史对话，生成个人行为画像。也是我的第一个获得付费收入的产品。
- Curioso: Confirmed App category and February 2026 start; status must read `Demo 未推进` (English: `Demo · Not pursued`), not Paused. Approved Chinese copy: AI 博物馆伴侣：拍照识别艺术品、收听讲解，并把看过的作品整理成自己的艺术旅行记录。 No end date or public link supplied; do not invent either or imply ongoing development.
- Shike: Extension; time is the single month `2026.03`, without an ongoing range; status Live (`已上线`); Chrome Web Store link; no star count. Confirmed Chinese copy: 用文学作品中的时间描写显示此刻，让新标签页成为一座文学时钟。背景随时间变色，也能把喜欢的片刻导出成图片。
- Tab Cleanup: Extension; time is the single month `2024.12`; status Live (`已上线`); Chrome Web Store link; no star count. Confirmed Chinese copy: 按闲置时间整理浏览器标签页，支持定时自动清理，并保留当前、固定和正在播放音频的标签页。
- macos-calendar-assistant-skill: Skill; `2026.03`; Open source; GitHub link and current stars. Confirmed Chinese copy: 在聊天中安排和调整日程，同步到 macOS 日历，把每周计划、每日执行与复盘连起来。
- oc-doctor: Skill; `2026.03`; Open source; GitHub link and current stars. Confirmed Chinese copy: 给 OpenClaw 做一次配置体检，检查会话、模型、定时任务和网关等问题，生成报告并协助修复。
- cc-speed: Skill; `2026.02`; Open source; GitHub link and current stars. Confirmed Chinese copy: 从本地日志分析 Claude Code 的输出速度，按模型查看统计、每日趋势和图表，也可通过 /speed 技能调用。

## About page update

The user supplied an updated introduction and career history: seven years in product management, now a full-time indie developer; building independently with AI since February 2026; Motiff (AI design tools), 2022–2026; Yuanfudao / Zebra AI children's products, 2020–2022; NetEase children's coding products, 2019–2020. Apply this to both languages and retain the Motiff link. Reuse the confirmed project data on About so StepRoll, links, descriptions, periods, statuses and star counts agree across pages. Preserve the existing counters, activity heatmap, contacts, and the additional skill-publisher entry.

## Validation

Additional user-approved About copy for the technical stack: CTO 是 Claude Code，偶尔用 Codex（生图、computer use、杂事），Grok Bot 是管家。 Replace the programming-language list and translate this division of responsibilities into English.

Add user-provided social links to About in both languages: Threads `https://www.threads.com/@bryantchenzhenghao` and 即刻 / Jike `https://okjk.co/SNgVMs`. Preserve the supplied URLs and do not infer the Jike account name from its short-link ID.

- Production build and TypeScript checks passed.
- Browser checks: all five filters plus All; App 4, Web 1, Extension 3, Hardware 2, Skill 3, total 12. MemoryX appears under both App and Extension.
- Chinese and English projects fit 320, 390 and 1280px; filter targets are 44px high. Both About pages fit 320px and contain no nested links.
- Keyboard activation, dark/light switching, pure-white light background, confirmed dates and links, and the five intended star counts verified.
- Final GitHub snapshot on 2026-11-15: deskpet-firmware 36; ClawPuter 160; macos-calendar-assistant-skill 11; oc-doctor 2; cc-speed 2. Shike and Tab Cleanup intentionally omit stars.
