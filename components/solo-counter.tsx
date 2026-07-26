"use client";

import { useEffect, useState } from "react";

const SOLO_START = new Date("2026-01-22T00:00:00+08:00").getTime();
const DAY_MS = 24 * 60 * 60 * 1000;

// digits are tuned for the current magnitude: same rendered width, similar last-digit tick rate
const UNITS = [
  { name: "Day", days: 1, digits: 8 },
  { name: "Week", days: 7, digits: 9 },
  { name: "Year", days: 365.25, digits: 10 },
];

function getDays() {
  return (Date.now() - SOLO_START) / DAY_MS;
}

export function SoloCounter({ lang }: { lang: string }) {
  const [days, setDays] = useState<number | null>(null);
  const [unitIndex, setUnitIndex] = useState(0);

  useEffect(() => {
    setDays(getDays());
    const timer = setInterval(() => setDays(getDays()), 50);
    return () => clearInterval(timer);
  }, []);

  if (days === null) return null;

  const label = lang === "zh" ? "一人公司" : "Solo Company";
  const unit = UNITS[unitIndex];

  const cycle = () => setUnitIndex((i) => (i + 1) % UNITS.length);

  return (
    <p
      className="font-mono text-sm text-neutral-400 dark:text-neutral-500 cursor-pointer select-none tabular-nums"
      role="button"
      tabIndex={0}
      aria-label={lang === "zh" ? "切换时间单位" : "Switch time unit"}
      onClick={cycle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          cycle();
        }
      }}
    >
      {label} {unit.name} {(days / unit.days).toFixed(unit.digits)}
    </p>
  );
}
