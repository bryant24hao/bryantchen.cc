export type Theme = "light" | "dark";
export const THEME_STORAGE_KEY = "bryant-reading-light";

// Runs in <head>, before the body is painted. Storage may be unavailable in
// private / embedded browsers; system preference still works in that case.
export const themeInitScript = `(() => {
  let saved;
  try { saved = localStorage.getItem('${THEME_STORAGE_KEY}'); } catch {}
  const theme = saved === 'light' || saved === 'dark'
    ? saved : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.dataset.theme = theme;
})();`;
