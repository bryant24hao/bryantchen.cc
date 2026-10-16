// Run against a locally served static export. Reuses an available Playwright
// installation; no runtime or package dependency is added to the website.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.THEME_PREVIEW_URL || 'http://127.0.0.1:3000';
const output = path.resolve(process.env.THEME_EVIDENCE_DIR || '../theme-evidence');
const KEY = 'bryant-reading-light';
const report = { checks: [], screenshots: [], errors: [] };
fs.mkdirSync(output, { recursive: true });
const pass = (name) => { report.checks.push(name); console.log('PASS', name); };
const sleep = page => page.waitForTimeout(450);
async function assertTheme(page, expected) {
  await sleep(page);
  const result = await page.evaluate(() => ({
    theme: document.documentElement.dataset.theme,
    bg: getComputedStyle(document.body).backgroundColor,
    scheme: getComputedStyle(document.documentElement).colorScheme,
  }));
  assert.equal(result.theme, expected);
  assert.equal(result.bg, expected === 'dark' ? 'rgb(32, 31, 28)' : 'rgb(247, 244, 237)');
  assert.equal(result.scheme, expected);
}
async function ready(page, url = '/zh') {
  await page.goto(base + url);
  await page.getByRole('switch').waitFor();
  await page.waitForFunction(() => !document.querySelector('[role="switch"]').disabled);
}
async function choose(page, concept) {
  await page.locator(`input[value="${concept}"]`).check();
}
async function drag(page, dx, dy, pointerType = 'mouse') {
  const button = page.getByRole('switch');
  const b = await button.boundingBox();
  const x = b.x + b.width / 2, y = b.y + Math.min(b.height - 15, 52);
  if (pointerType === 'touch') {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + dx, y: y + dy }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await cdp.detach();
  } else {
    await page.mouse.move(x, y); await page.mouse.down();
    await page.mouse.move(x + dx, y + dy, { steps: 5 }); await page.mouse.up();
  }
}
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  async function context(options = {}) {
    const ctx = await browser.newContext(options);
    // No production-domain access: all outside requests are blocked.
    await ctx.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
    return ctx;
  }
  try {
    const ctx = await context({ colorScheme: 'dark', viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    page.on('pageerror', error => report.errors.push({ url: page.url(), message: error.message }));
    await ready(page);
    await assertTheme(page, 'dark'); pass('First visit follows dark OS preference');
    await page.emulateMedia({ colorScheme: 'light' }); await assertTheme(page, 'light');
    await page.emulateMedia({ colorScheme: 'dark' }); await assertTheme(page, 'dark');
    pass('System changes apply before an explicit choice');
    await page.getByRole('switch').click(); await assertTheme(page, 'light');
    await page.reload(); await assertTheme(page, 'light');
    await page.emulateMedia({ colorScheme: 'light' }); await page.emulateMedia({ colorScheme: 'dark' });
    await assertTheme(page, 'light'); pass('Explicit choice persists through reload and overrides OS');
    for (const concept of ['cord', 'bookmark', 'sunset']) {
      await choose(page, concept); await assertTheme(page, 'light');
      const button = page.getByRole('switch');
      assert.equal(await button.getAttribute('aria-checked'), 'true');
      assert.ok((await button.getAttribute('aria-label')).length);
      await button.focus(); await page.keyboard.press('Space'); await assertTheme(page, 'dark');
      await page.keyboard.press('Enter'); await assertTheme(page, 'light');
      await button.click(); await assertTheme(page, 'dark');
      await button.click(); await assertTheme(page, 'light');
      pass(`${concept}: click, Space, Enter, shared state, switch semantics`);
    }
    await choose(page, 'cord');
    await drag(page, 0, 34); await assertTheme(page, 'dark');
    await drag(page, 0, 12); await assertTheme(page, 'dark');
    await drag(page, 0, 34); await assertTheme(page, 'light');
    pass('Cord drag toggles once; short pull does not toggle');
    const button = page.getByRole('switch'); const b = await button.boundingBox();
    await page.mouse.move(b.x + 24, b.y + 50); await page.mouse.down(); await page.mouse.move(b.x + 24, b.y + 85);
    await page.keyboard.press('Escape'); await page.mouse.up(); await assertTheme(page, 'light');
    await button.click(); await assertTheme(page, 'dark'); await button.click();
    pass('Escape cancels cord gesture; next click still works');
    await choose(page, 'sunset');
    await drag(page, 30, 0); await assertTheme(page, 'dark');
    await drag(page, -30, 0); await assertTheme(page, 'light');
    await page.getByRole('switch').focus(); await page.keyboard.press('ArrowRight'); await assertTheme(page, 'dark');
    await page.keyboard.press('ArrowLeft'); await assertTheme(page, 'light');
    pass('Sunset drag and arrow-key alternatives work in both directions');
    // One preference across tabs, including resetting to the system.
    const tab = await ctx.newPage(); await ready(tab, '/en');
    await tab.getByRole('switch').click(); await assertTheme(page, 'dark');
    await tab.evaluate(key => localStorage.removeItem(key), KEY); await assertTheme(page, 'dark');
    await page.emulateMedia({ colorScheme: 'light' }); await assertTheme(page, 'light');
    await tab.close(); pass('Storage changes synchronize between tabs; reset resumes system preference');

    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 844 });
      for (const lang of ['zh', 'en']) {
        for (const route of ['', '/posts', '/thoughts', '/projects', '/talks', '/about', '/evolution', '/posts/ios-proxy-client-pitfalls']) {
          await ready(page, `/${lang}${route}`);
          const geometry = await page.evaluate(() => {
            const s = document.querySelector('[role="switch"]').getBoundingClientRect();
            return {
              width: innerWidth, scroll: document.documentElement.scrollWidth,
              minTarget: Math.min(s.width, s.height),
              overlap: [...document.querySelectorAll('.site-nav a')].some(a => { const r = a.getBoundingClientRect(); return r.left < s.right && r.right > s.left && r.top < s.bottom && r.bottom > s.top; }),
            };
          });
          assert.ok(geometry.scroll <= geometry.width, `Overflow at ${width}/${lang}${route}: ${JSON.stringify(geometry)}`);
          assert.ok(geometry.minTarget >= 44);
          assert.equal(geometry.overlap, false, `Navigation overlap at ${width}/${lang}${route}`);
        }
      }
      pass(`Both languages / all page templates at ${width}px: no overflow, 44px targets, no nav overlap`);
    }
    await ready(page, '/en/projects');
    assert.equal(await page.locator('a a').count(), 0);
    assert.ok(await page.locator('main p a').count() > 0);
    pass('Project cards retain their description links without nested anchors');
    // Article surfaces must obey explicit mode even under the opposite OS.
    await ready(page, '/en/posts/ios-proxy-client-pitfalls');
    await page.emulateMedia({ colorScheme: 'light' });
    await page.getByRole('switch').click(); await assertTheme(page, 'dark');
    const prose = await page.locator('.prose pre').first().evaluate(el => ({ bg: getComputedStyle(el).backgroundColor, text: getComputedStyle(el).color }));
    assert.equal(prose.bg, 'rgb(40, 38, 34)');
    assert.notEqual(prose.text, prose.bg); pass('MDX code and table page uses explicit night surfaces');

    for (const size of ['mobile', 'desktop']) {
      await page.setViewportSize(size === 'mobile' ? { width: 390, height: 844 } : { width: 1280, height: 900 });
      await ready(page, '/zh');
      for (const concept of ['cord', 'bookmark', 'sunset']) {
        await choose(page, concept);
        for (const mode of ['light', 'dark']) {
          if (await page.evaluate(() => document.documentElement.dataset.theme) !== mode) await page.getByRole('switch').click();
          await assertTheme(page, mode); await page.mouse.move(0, 300); await page.getByRole('switch').blur();
          const file = `${concept}-${mode}-${size}.png`;
          await page.screenshot({ path: path.join(output, file) }); report.screenshots.push(file);
        }
      }
    }
    pass('Captured all three concepts × both themes × desktop/mobile');
    await ctx.close();

    const mobile = await context({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, colorScheme: 'light', reducedMotion: 'reduce' });
    const touch = await mobile.newPage(); await ready(touch);
    await drag(touch, 0, 34, 'touch'); await assertTheme(touch, 'dark');
    await touch.getByRole('switch').tap(); await assertTheme(touch, 'light');
    await choose(touch, 'sunset'); await drag(touch, 30, 0, 'touch'); await assertTheme(touch, 'dark');
    await drag(touch, -30, 0, 'touch'); await assertTheme(touch, 'light');
    await choose(touch, 'bookmark'); await touch.getByRole('switch').tap(); await assertTheme(touch, 'dark');
    const motion = await touch.locator('.bookmark-paper').evaluate(el => getComputedStyle(el).transitionDuration);
    assert.equal(motion, '0s'); pass('Touch tap/pull/slide and reduced-motion mode');
    await mobile.close();

    for (const saved of [null, 'light', 'dark', 'invalid']) {
      const initial = await context({ colorScheme: 'dark' });
      if (saved) await initial.addInitScript(({ key, value }) => localStorage.setItem(key, value), { key: KEY, value: saved });
      await initial.route('**/_next/**/*.js', route => route.abort());
      const p = await initial.newPage(); await p.goto(base + '/zh');
      await assertTheme(p, saved === 'light' ? 'light' : 'dark');
      await initial.close();
    }
    pass('Correct initial paint before React loads, including invalid storage fallback');
    const blocked = await context({ colorScheme: 'dark' });
    await blocked.addInitScript(() => { Storage.prototype.getItem = () => { throw new Error('blocked'); }; Storage.prototype.setItem = () => { throw new Error('blocked'); }; });
    const p = await blocked.newPage(); await ready(p); await assertTheme(p, 'dark');
    await p.getByRole('switch').click(); await assertTheme(p, 'light');
    await p.emulateMedia({ colorScheme: 'light' }); await p.emulateMedia({ colorScheme: 'dark' }); await assertTheme(p, 'light');
    await blocked.close(); pass('Blocked storage still supports system preference and in-session manual choice');
    const nojs = await context({ javaScriptEnabled: false, colorScheme: 'dark' });
    const nj = await nojs.newPage(); await nj.goto(base + '/zh');
    assert.equal(await nj.evaluate(() => getComputedStyle(document.body).backgroundColor), 'rgb(32, 31, 28)');
    await nojs.close(); pass('No-JavaScript dark-system fallback');
    assert.deepEqual(report.errors, []); pass('No uncaught browser errors during normal interaction');
    report.result = 'PASS';
  } catch (error) { report.result = 'FAIL'; report.failure = error.stack; process.exitCode = 1; console.error(error); }
  finally { fs.writeFileSync(path.join(output, 'browser-results.json'), JSON.stringify(report, null, 2)); await browser.close(); }
})();
