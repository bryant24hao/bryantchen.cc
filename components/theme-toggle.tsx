"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";
import { ReadingLight } from "./reading-light";

export function ThemeToggle({ lang }: { lang: Locale }) {
  const [theme, setTheme] = useState<Theme | null>(null);
  const preference = useRef<Theme | null>(null);

  useEffect(() => {
    const system = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = (next: Theme) => {
      document.documentElement.dataset.theme = next;
      setTheme(next);
    };
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      preference.current = saved === "light" || saved === "dark" ? saved : null;
    } catch { /* Private / embedded browsers can still use a session preference. */ }
    const syncSystem = () => apply(preference.current ?? (system.matches ? "dark" : "light"));
    const syncStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
      preference.current = event.newValue === "light" || event.newValue === "dark" ? event.newValue : null;
      syncSystem();
    };
    syncSystem();
    system.addEventListener("change", syncSystem);
    window.addEventListener("storage", syncStorage);
    return () => {
      system.removeEventListener("change", syncSystem);
      window.removeEventListener("storage", syncStorage);
    };
  }, []);

  function chooseTheme(next: Theme) {
    preference.current = next;
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try { localStorage.setItem(THEME_STORAGE_KEY, next); } catch { /* Session-only fallback. */ }
  }

  const toggle = () => chooseTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");

  return <ReadingLight lang={lang} theme={theme} toggle={toggle} />;
}
