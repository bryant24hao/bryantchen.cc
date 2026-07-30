# Blog Brand Cover Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Produce and integrate brand cover assets for `bryantchen.cc` that share the approved “行走中的蓝窗” visual system.

**Architecture:** Generate a canonical 3:5 ZINE poster with the installed `gc-minimal-zine-poster-v0-1` prompt compiler, then create a wide homepage interpretation from the same visual grammar. Derive the compact list preview from the wide asset so the symbol, color, and paper treatment remain consistent. Add the wide image once at the top of the homepage and show the compact image only on the full posts index, keeping the homepage's recent-post list text-only to avoid repetition.

**Tech Stack:** Built-in image generation, ImageMagick for deterministic resizing/cropping, local PNG assets.

---

### Task 1: Generate the 3:5 brand master

**Files:**
- Create: `public/images/brand/blog-cover-master-v1.png`

**Step 1:** Compile the approved concept into the skill's four-paragraph Standard Mode prompt.

**Step 2:** Generate one 3:5 raster image with the built-in image-generation tool.

**Step 3:** Inspect the image for paper ratio, negative space, blue-anchor visibility, single-metaphor clarity, and exact rendering of `陈正豪`.

**Step 4:** If one quality gate clearly fails, regenerate once with only that failure tightened.

**Step 5:** Save the selected master to `public/images/brand/blog-cover-master-v1.png` without overwriting existing assets.

### Task 2: Generate the homepage-wide variant

**Files:**
- Create: `public/images/brand/blog-cover-hero-v1.png`

**Step 1:** Recompose the approved symbol and typography for a 5:3 landscape frame, keeping the blue window and path in the lower-left safe area.

**Step 2:** Generate the wide variant using the selected master as the visual reference.

**Step 3:** Inspect at the blog's approximate 672px content width; verify that the image reads as a quiet editorial header rather than a commercial hero banner.

**Step 4:** Save the selected image to `public/images/brand/blog-cover-hero-v1.png`.

### Task 3: Create and verify the list thumbnail

**Files:**
- Create: `public/images/brand/blog-cover-thumb-v1.png`

**Step 1:** Use ImageMagick to crop/resize the hero image to a compact 3:2 thumbnail while preserving the lower-left symbol cluster.

**Step 2:** Inspect the thumbnail at small display size and confirm the cobalt window remains the first visual anchor.

**Step 3:** Report all preview paths, the final generation prompts, and the selected variation recipe.

### Task 4: Add a failing integration check

**Files:**
- Create: `scripts/brand-cover-integration.test.mjs`

**Step 1:** Assert that the homepage references the wide cover, `PostCard` supports an optional cover, and the full posts index enables it.

**Step 2:** Run `node --test scripts/brand-cover-integration.test.mjs` and confirm it fails because the cover has not been integrated.

### Task 5: Integrate the cover assets

**Files:**
- Modify: `app/[lang]/page.tsx`
- Modify: `app/[lang]/posts/page.tsx`
- Modify: `components/post-card.tsx`

**Step 1:** Add the wide image above the homepage introduction using `next/image`, a responsive size hint, localized alt text, and eager loading.

**Step 2:** Add an optional `showCover` presentation to `PostCard`, keeping the existing text-only rendering as the default.

**Step 3:** Enable `showCover` only from the full posts index.

**Step 4:** Run `node --test scripts/brand-cover-integration.test.mjs` and confirm it passes.

**Step 5:** Run lint/type/build verification and inspect the rendered homepage and posts page at desktop and mobile widths.
