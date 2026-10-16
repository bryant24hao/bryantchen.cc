# Reading light — three interactive concepts

Preview branch: `feat/reading-light-theme`.

The A/B/C radio selector is temporary review UI. Only one switch appears in the
navigation at a time, and all concepts share the same theme preference. Choose a
direction before merging; remove the picker and unused alternatives at that point.

| Concept | Pointer / touch | Keyboard |
| --- | --- | --- |
| A · Cord | Click or pull down 24px; a short pull returns without switching | Space / Enter; Escape cancels a pull |
| B · Bookmark | Click to flip the paper bookmark | Space / Enter |
| C · Sunset | Click or slide right for night, left for day | Space / Enter; arrows or Home / End |

The cord is the recommended direction: it fits the narrow paper-like reading
layout, remains unobtrusive, and most closely follows the reference concept.
Bookmark emphasizes the reading metaphor. Sunset is the clearest spatial gesture.

## Local preview

```sh
pnpm build
python3 scripts/serve-theme-preview.py
```

- `http://127.0.0.1:3000/zh?themePreview=cord`
- `http://127.0.0.1:3000/zh?themePreview=bookmark`
- `http://127.0.0.1:3000/zh?themePreview=sunset`
- Use `/en` for English labels.

This is loopback-only, so an iPhone cannot open it remotely. No account, tunnel,
public deployment, or network-security changes were introduced. A pre-existing
authenticated non-production deployment path was not established during this task.

## Theme behavior

- First visit follows the system, including subsequent system changes until an
  explicit choice. The `bryant-reading-light` localStorage entry persists a choice;
  changes synchronize across tabs. Removing that key resumes system following.
- The small inline head script applies the mode before body paint, independently
  of React hydration. Invalid or inaccessible storage falls back safely.
- All site templates, cards, navigation, footer, heatmap and MDX surfaces use the
  same explicit theme. Day is `#f7f4ed`; night is `#201f1c`. Existing images and the
  intentionally white exported share-card bitmap retain their original colors.
- Standalone legacy slide decks under `public/talk/` have their own documents and
  visual systems; this change covers the site's Talks listing, not those decks.
- Native buttons expose a localized switch label and checked state. Targets are
  at least 44px. Reduced-motion disables the flip, rebound and color transitions.
- No new npm dependency. Existing Tailwind dark utilities now respect the selected
  mode; the system remains a CSS fallback when JavaScript is disabled.

## Checks

```sh
pnpm exec tsc --noEmit
pnpm exec eslint app components lib scripts/theme-browser-check.cjs
node --test scripts/brand-cover-integration.test.mjs
pnpm build
PLAYWRIGHT_MODULE=/path/to/playwright-or-playwright-core node scripts/theme-browser-check.cjs
```

`CHROME_PATH`, `THEME_PREVIEW_URL` and `THEME_EVIDENCE_DIR` may also be overridden.
The browser check only permits requests to the local preview origin. It covers
system/manual preference, first paint without React, refresh, blocked storage,
cross-tab updates, pointer/keyboard/touch gestures, reduced motion, and all page
templates in both languages at 320, 390, 768 and 1280px. It writes JSON results and
12 screenshots (three concepts × two themes × desktop/mobile).

The repository's existing `pnpm lint` invokes `next lint`, which is not available
in the installed Next version; use `pnpm exec eslint` as above. The first build
needs the existing Google Fonts Inter download. No production domain was opened.

## Small issues exposed by cross-page validation

- MDX tables scroll within their own width on narrow screens; long prose tokens
  wrap instead of expanding the page.
- Project cards no longer wrap description links inside another anchor. A stretched
  title link preserves the clickable card while description links remain separate.
- The heatmap now initializes after mounting, matching its intended placeholder
  behavior and avoiding server-side date-dependent initial markup.
