"use client";

import { useRef, useState, type CSSProperties, type PointerEvent } from "react";
import type { Locale } from "@/lib/i18n";
import type { Theme } from "@/lib/theme";

export function ThemeAlternatives({ concept, lang, theme, toggle, chooseTheme }: {
  concept: "bookmark" | "sunset";
  lang: Locale;
  theme: Theme | null;
  toggle: () => void;
  chooseTheme: (theme: Theme) => void;
}) {
  const [dragProgress, setDragProgress] = useState<number | null>(null);
  const gesture = useRef<{ id: number; x: number; start: number; progress: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const isOn = theme !== "dark";
  const progress = dragProgress ?? (isOn ? 0 : 1);
  const isBookmark = concept === "bookmark";
  const label = lang === "zh" ? (isBookmark ? "书签阅读灯" : "日落阅读灯") : (isBookmark ? "Bookmark reading light" : "Sunset reading light");
  const hint = lang === "zh"
    ? (isBookmark ? `翻面${isOn ? "关灯" : "开灯"}` : "点击或左右滑动，切换日夜")
    : (isBookmark ? `Flip to turn ${isOn ? "off" : "on"}` : "Click or slide to change day / night");

  function finish(event: PointerEvent<HTMLButtonElement>, cancelled = false) {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    gesture.current = null;
    setDragProgress(null);
    suppressClick.current = cancelled || current.moved;
    if (!cancelled && current.moved) chooseTheme(current.progress >= 0.5 ? "dark" : "light");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return (
    <div className={`reading-light theme-${concept}`}>
      <button
        type="button"
        className={`theme-alternative-button ${concept}-button`}
        role="switch"
        aria-label={label}
        aria-checked={isOn}
        aria-describedby="reading-light-hint"
        disabled={theme === null}
        data-dragging={dragProgress !== null || undefined}
        style={{ "--sun-progress": progress } as CSSProperties}
        onClick={() => {
          if (suppressClick.current) { suppressClick.current = false; return; }
          toggle();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") suppressClick.current = false;
          if (!isBookmark && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
            event.preventDefault();
            chooseTheme(["ArrowLeft", "ArrowUp", "Home"].includes(event.key) ? "light" : "dark");
          }
          if (event.key === "Escape" && gesture.current) {
            gesture.current = null;
            suppressClick.current = true;
            setDragProgress(null);
          }
        }}
        onPointerDown={(event) => {
          suppressClick.current = false;
          if (isBookmark || !event.isPrimary || event.button !== 0) return;
          const start = isOn ? 0 : 1;
          gesture.current = { id: event.pointerId, x: event.clientX, start, progress: start, moved: false };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const current = gesture.current;
          if (!current || current.id !== event.pointerId) return;
          const distance = event.clientX - current.x;
          current.moved ||= Math.abs(distance) > 6;
          current.progress = Math.min(1, Math.max(0, current.start + distance / 28));
          setDragProgress(current.progress);
        }}
        onPointerUp={(event) => finish(event)}
        onPointerCancel={(event) => finish(event, true)}
        onLostPointerCapture={(event) => finish(event, true)}
      >
        {isBookmark ? (
          <span className="bookmark-paper" aria-hidden="true">
            <span className="bookmark-face bookmark-day"><span>日</span><i /></span>
            <span className="bookmark-face bookmark-night"><span>夜</span><i /></span>
          </span>
        ) : (
          <span className="sunset-scene" aria-hidden="true">
            <span className="sunset-orb" />
            <span className="sunset-ground" />
            <span className="sunset-horizon" />
            <span className="sunset-star">·</span>
          </span>
        )}
      </button>
      <span id="reading-light-hint" className="reading-light-hint">{hint}</span>
    </div>
  );
}
