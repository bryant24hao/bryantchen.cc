# Reading light theme

The selected A interaction is the only theme control. The bookmark, sunset,
concept selector, preview query handling and preview session storage have been
removed. Old preview URLs still open the site with the reading-light control.

## Interaction and theme

- Click, tap, Space or Enter toggles day/night. Pull down 24px to toggle once;
  shorter pulls return without switching. Escape or pointer cancellation cancels.
- Day uses warm paper `#f7f4ed`; night uses warm charcoal `#201f1c`.
- First visit follows the OS. An explicit choice is saved in `bryant-reading-light`
  localStorage and synchronized between tabs. Removing that key resumes OS mode.
- The inline head initializer selects the theme before body paint. Invalid or
  unavailable storage falls back safely. Without JS, CSS follows the OS.
- The native switch has localized labels and checked state, a visible keyboard
  focus ring, and a target at least 44px wide. Reduced-motion disables rebound and
  color transitions. Mobile navigation leaves room for the fully extended cord;
  its hint appears above the brand row instead of covering navigation links.
- All site templates and MDX surfaces share the theme. Original images, exported
  share-card artwork and standalone legacy slide decks retain their own colors.
- No npm dependencies added.

## Non-production preview

https://feat-reading-light-theme.bryantchen-cc.pages.dev/zh

English: https://feat-reading-light-theme.bryantchen-cc.pages.dev/en

The existing Cloudflare Pages GitHub integration automatically deploys pushes to
`feat/reading-light-theme` as previews. Main and production are not changed. The
branch preserves main's article/translation commit `2ebaba3`.

## Local preview and validation

```sh
pnpm build
python3 scripts/serve-theme-preview.py
```

Open `http://127.0.0.1:3000/zh`. The local server is loopback-only.

```sh
pnpm exec tsc --noEmit
pnpm exec eslint app components lib scripts/theme-browser-check.cjs
node --test scripts/brand-cover-integration.test.mjs
PLAYWRIGHT_MODULE=/path/to/playwright-or-playwright-core node scripts/theme-browser-check.cjs
```

The browser suite blocks all other origins, tests system/manual preference,
initial paint before React, refresh, blocked storage, cross-tab updates, mouse,
keyboard, touch, reduced motion, and page templates in both languages at 320,
390, 768 and 1280px. It also checks every article at 390px and tests that the
fully extended handle and hint do not cover navigation. Results and four final
screenshots are written to `../final-theme-evidence` (or `THEME_EVIDENCE_DIR`).

`CHROME_PATH` and `THEME_PREVIEW_URL` can be overridden. Touch validation is
Chromium emulation, not a physical iPhone Safari test. The first build requires
the existing Inter font download. Use `pnpm exec eslint`; the repository's old
`pnpm lint` command invokes the removed `next lint` command.

Cross-page checks also exposed and fixed narrow MDX table overflow, nested
anchors in project cards, and the heatmap's initialization during server render.
Long English post dates stack below titles on mobile to prevent 320px overflow;
desktop date alignment remains unchanged.
