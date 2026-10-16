"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";
import { ReadingLight } from "./reading-light";
import { ThemeAlternatives } from "./theme-alternatives";

type Concept = "cord" | "bookmark" | "sunset";

// Temporary review UI: one shared theme, one active switch in the navigation.
export function ThemePreview({ lang, children }: { lang: Locale; children: ReactNode }) {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [concept, setConcept] = useState<Concept>("cord");
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
      const savedConcept = sessionStorage.getItem("theme-preview-concept");
      if (savedConcept === "cord" || savedConcept === "bookmark" || savedConcept === "sunset") setConcept(savedConcept);
    } catch { /* Private / embedded browsers can still use a session preference. */ }
    const query = new URLSearchParams(window.location.search).get("themePreview");
    if (query === "cord" || query === "bookmark" || query === "sunset") setConcept(query);
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
  const labels = lang === "zh" ? ["A · 灯绳", "B · 书签", "C · 日落"] : ["A · Cord", "B · Bookmark", "C · Sunset"];

  return (
    <>
      <nav className="site-nav" aria-label={lang === "zh" ? "主导航" : "Main navigation"}>
        {children}
        {concept === "cord"
          ? <ReadingLight lang={lang} theme={theme} toggle={toggle} />
          : <ThemeAlternatives key={concept} concept={concept} lang={lang} theme={theme} toggle={toggle} chooseTheme={chooseTheme} />}
      </nav>
      <fieldset className="theme-preview-picker">
        <legend>{lang === "zh" ? "交互预览" : "Interaction preview"}</legend>
        {(["cord", "bookmark", "sunset"] as const).map((value, index) => (
          <label key={value}>
            <input type="radio" name="theme-concept" value={value} checked={concept === value} onChange={() => {
              setConcept(value);
              try { sessionStorage.setItem("theme-preview-concept", value); } catch { /* Optional preview preference. */ }
              const url = new URL(window.location.href);
              url.searchParams.set("themePreview", value);
              window.history.replaceState(null, "", url);
            }} />
            <span>{labels[index]}</span>
          </label>
        ))}
      </fieldset>
    </>
  );
}
