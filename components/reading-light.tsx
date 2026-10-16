"use client";

import { useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import type { Locale } from "@/lib/i18n";
import { type Theme } from "@/lib/theme";

export function ReadingLight({ lang, theme, toggle }: {
  lang: Locale;
  theme: Theme | null;
  toggle: () => void;
}) {
  const [pull, setPull] = useState(0);
  const gesture = useRef<{ id: number; y: number; distance: number } | null>(null);
  const suppressClick = useRef(false);

  function startPull(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    suppressClick.current = false;
    gesture.current = { id: event.pointerId, y: event.clientY, distance: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function movePull(event: PointerEvent<HTMLButtonElement>) {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    current.distance = Math.max(0, event.clientY - current.y);
    setPull(Math.min(36, current.distance * 0.55));
  }

  function endPull(event: PointerEvent<HTMLButtonElement>, cancelled = false) {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    gesture.current = null;
    setPull(0);
    // A drag toggles only once; the synthetic click after pointerup is ignored.
    suppressClick.current = cancelled || current.distance > 6;
    if (!cancelled && current.distance >= 24) toggle();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const isOn = theme !== "dark";
  const label = lang === "zh" ? "阅读灯" : "Reading light";
  const hint = lang === "zh"
    ? `点击或轻拉${isOn ? "关灯" : "开灯"}`
    : `Click or pull to turn ${isOn ? "off" : "on"}`;

  return (
    <div className="reading-light" style={{ "--pull": `${pull}px` } as CSSProperties}>
      <button
        type="button"
        className="reading-light-button"
        role="switch"
        aria-label={label}
        aria-checked={isOn}
        aria-describedby="reading-light-hint"
        disabled={theme === null}
        data-pulling={pull > 0 || undefined}
        onPointerDown={startPull}
        onPointerMove={movePull}
        onPointerUp={(event) => endPull(event)}
        onPointerCancel={(event) => endPull(event, true)}
        onLostPointerCapture={(event) => endPull(event, true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") suppressClick.current = false;
          if (event.key === "Escape" && gesture.current) {
            gesture.current = null;
            suppressClick.current = true;
            setPull(0);
          }
        }}
        onClick={() => {
          if (suppressClick.current) { suppressClick.current = false; return; }
          toggle();
        }}
      >
        <span className="reading-light-cord" aria-hidden="true" />
        <svg className="reading-light-handle" width="20" height="22" viewBox="0 0 20 22" aria-hidden="true">
          <path d="M6.5 2h7l3.5 16a1 1 0 0 1-1 1.2H4A1 1 0 0 1 3 18L6.5 2Z" />
          <path className="reading-light-mark" d="M8 15h4" />
        </svg>
      </button>
      <span id="reading-light-hint" className="reading-light-hint">{hint}</span>
    </div>
  );
}
