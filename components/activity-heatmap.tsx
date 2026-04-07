"use client";

import { useState, useMemo, useRef } from "react";
import type { ActivityDay } from "@/lib/content";

interface Props {
  data: ActivityDay[];
  locale: "zh" | "en";
}

const WEEKS = 26;
const CELL_SIZE = 12;
const GAP = 3;

function getLevel(wordCount: number): number {
  if (wordCount === 0) return 0;
  if (wordCount <= 200) return 1;
  if (wordCount <= 500) return 2;
  if (wordCount <= 1000) return 3;
  return 4;
}

const LEVEL_COLORS = [
  "bg-neutral-100 dark:bg-neutral-800",
  "bg-neutral-300 dark:bg-neutral-600",
  "bg-neutral-400 dark:bg-neutral-500",
  "bg-neutral-600 dark:bg-neutral-400",
  "bg-neutral-800 dark:bg-neutral-200",
];

const MONTH_LABELS_ZH = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
const MONTH_LABELS_EN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_LABELS_ZH = ["一", "三", "五"];
const DAY_LABELS_EN = ["Mon", "Wed", "Fri"];

function toLocalDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

type DayCell = {
  date: string;
  wordCount: number;
  posts: number;
  thoughts: number;
  future: boolean;
};

function computeGrid(data: ActivityDay[]) {
  const dataMap = new Map(data.map((d) => [d.date, d]));
  const today = new Date();

  const endDay = new Date(today);
  endDay.setDate(endDay.getDate() + (6 - endDay.getDay()));

  const startDay = new Date(endDay);
  startDay.setDate(startDay.getDate() - WEEKS * 7 + 1);
  startDay.setDate(startDay.getDate() - startDay.getDay());

  const weeks: DayCell[][] = [];
  const cursor = new Date(startDay);

  while (cursor <= endDay) {
    const week: DayCell[] = [];
    for (let d = 0; d < 7; d++) {
      const key = toLocalDateKey(cursor);
      const isFuture = cursor > today;
      const entry = dataMap.get(key);
      week.push({
        date: key,
        wordCount: entry?.wordCount || 0,
        posts: entry?.posts || 0,
        thoughts: entry?.thoughts || 0,
        future: isFuture,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
}

export function ActivityHeatmap({ data, locale }: Props) {
  const [mounted, setMounted] = useState(false);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    day: DayCell;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Defer grid computation to client to avoid hydration mismatch
  useState(() => { setMounted(true); });

  const weeks = useMemo(() => (mounted ? computeGrid(data) : null), [data, mounted]);

  const monthLabels = locale === "zh" ? MONTH_LABELS_ZH : MONTH_LABELS_EN;
  const dayLabels = locale === "zh" ? DAY_LABELS_ZH : DAY_LABELS_EN;

  const months = useMemo(() => {
    if (!weeks) return [];
    const result: { label: string; col: number }[] = [];
    let lastMonth = -1;
    for (let w = 0; w < weeks.length; w++) {
      const [, m] = weeks[w][0].date.split("-").map(Number);
      const month = m - 1;
      if (month !== lastMonth) {
        result.push({ label: monthLabels[month], col: w });
        lastMonth = month;
      }
    }
    return result;
  }, [weeks, monthLabels]);

  const dayLabelWidth = 28;

  function formatTooltip(day: DayCell) {
    const d = new Date(day.date + "T00:00:00");
    const dateStr = d.toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US", {
      month: "short",
      day: "numeric",
      weekday: "short",
    });
    if (day.wordCount === 0) {
      return locale === "zh" ? `${dateStr} — 无内容` : `${dateStr} — No activity`;
    }
    const parts: string[] = [];
    if (day.posts > 0) parts.push(locale === "zh" ? `${day.posts} 篇文章` : `${day.posts} post${day.posts > 1 ? "s" : ""}`);
    if (day.thoughts > 0) parts.push(locale === "zh" ? `${day.thoughts} 条碎碎念` : `${day.thoughts} thought${day.thoughts > 1 ? "s" : ""}`);
    const wordStr = locale === "zh" ? `${day.wordCount} 字` : `${day.wordCount} words`;
    return `${dateStr} — ${parts.join(", ")} · ${wordStr}`;
  }

  function handleMouseEnter(e: React.MouseEvent, day: DayCell) {
    const rect = e.currentTarget.getBoundingClientRect();
    const parent = containerRef.current;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    setTooltip({
      x: rect.left - parentRect.left + rect.width / 2,
      y: rect.top - parentRect.top - 8,
      day,
    });
  }

  // Render a fixed-height placeholder during SSR to avoid layout shift
  if (!weeks) {
    const placeholderHeight = 7 * (CELL_SIZE + GAP) - GAP + 40;
    return (
      <div className="mt-8 mb-2">
        <h2 className="font-semibold mb-3">
          {locale === "zh" ? "写作热力图" : "Writing Activity"}
        </h2>
        <div style={{ height: placeholderHeight }} />
      </div>
    );
  }

  return (
    <div className="mt-8 mb-2">
      <h2 className="font-semibold mb-3">
        {locale === "zh" ? "写作热力图" : "Writing Activity"}
      </h2>
      <div className="overflow-x-auto" ref={containerRef}>
        <div className="inline-block relative" style={{ paddingLeft: dayLabelWidth }}>
          {/* Month labels */}
          <div className="flex text-xs text-neutral-400 dark:text-neutral-500 mb-1">
            {months.map((m, i) => (
              <span
                key={i}
                className="absolute"
                style={{ left: dayLabelWidth + m.col * (CELL_SIZE + GAP) }}
              >
                {m.label}
              </span>
            ))}
          </div>

          {/* Grid */}
          <div className="flex gap-[3px] mt-4 relative">
            {/* Day labels */}
            <div
              className="absolute flex flex-col text-xs text-neutral-400 dark:text-neutral-500"
              style={{
                left: -dayLabelWidth,
                top: 0,
                height: 7 * (CELL_SIZE + GAP) - GAP,
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                <span
                  key={d}
                  className="flex items-center"
                  style={{ height: CELL_SIZE + GAP, lineHeight: `${CELL_SIZE}px` }}
                >
                  {d === 1 ? dayLabels[0] : d === 3 ? dayLabels[1] : d === 5 ? dayLabels[2] : ""}
                </span>
              ))}
            </div>

            {weeks.map((week, w) => (
              <div key={w} className="flex flex-col gap-[3px]">
                {week.map((day, d) => {
                  if (day.future) {
                    return (
                      <div
                        key={d}
                        style={{ width: CELL_SIZE, height: CELL_SIZE }}
                      />
                    );
                  }
                  const level = getLevel(day.wordCount);
                  return (
                    <div
                      key={d}
                      className={`rounded-sm transition-colors ${LEVEL_COLORS[level]}`}
                      style={{ width: CELL_SIZE, height: CELL_SIZE }}
                      onMouseEnter={(e) => handleMouseEnter(e, day)}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Tooltip */}
          {tooltip && (
            <div
              className="absolute pointer-events-none z-10 px-2 py-1 text-xs rounded bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 whitespace-nowrap"
              style={{
                left: tooltip.x,
                top: tooltip.y,
                transform: "translate(-50%, -100%)",
              }}
            >
              {formatTooltip(tooltip.day)}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3 text-xs text-neutral-400 dark:text-neutral-500">
        <span>{locale === "zh" ? "少" : "Less"}</span>
        {LEVEL_COLORS.map((cls, i) => (
          <div
            key={i}
            className={`rounded-sm ${cls}`}
            style={{ width: CELL_SIZE - 2, height: CELL_SIZE - 2 }}
          />
        ))}
        <span>{locale === "zh" ? "多" : "More"}</span>
      </div>
    </div>
  );
}
