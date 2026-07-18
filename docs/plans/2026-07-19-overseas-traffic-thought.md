# Bilingual Overseas Traffic Thought Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Publish the July 18 overseas-traffic diary entry in Chinese and English as a bilingual thought.

**Architecture:** The site's filesystem content loader reads Markdown files from locale-specific `content/<locale>/thoughts` directories. Two files with the same date and slug provide equivalent entries on the Chinese and English thought pages.

**Tech Stack:** Markdown, gray-matter front matter, Next.js static build

---

### Task 1: Add the bilingual thought

**Files:**
- Create: `content/zh/thoughts/2026-07-18-overseas-traffic-is-hard.md`
- Create: `content/en/thoughts/2026-07-18-overseas-traffic-is-hard.md`

**Step 1: Add the Chinese source**

Copy the diary body unchanged and add the site's standard date and tags front matter.

**Step 2: Add the English translation**

Translate the diary naturally while preserving its tone and meaning. Use the same date, tags, and slug as the Chinese entry.

**Step 3: Run the production build**

Run: `pnpm build`

Expected: sitemap and RSS generation complete, followed by a successful Next.js production build.

**Step 4: Inspect the scoped diff**

Run: `git diff --check -- content/zh/thoughts/2026-07-18-overseas-traffic-is-hard.md content/en/thoughts/2026-07-18-overseas-traffic-is-hard.md`

Expected: no output and exit code 0.

**Step 5: Commit and deploy**

Stage only the two thought files and these publication notes, commit them, and push `main` to trigger the existing Cloudflare Pages deployment.
