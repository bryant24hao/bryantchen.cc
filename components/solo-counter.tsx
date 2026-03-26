"use client";

import { useEffect, useState } from "react";

const SOLO_START = new Date("2026-01-22T00:00:00+08:00").getTime();

function getDays() {
  return (Date.now() - SOLO_START) / (24 * 60 * 60 * 1000);
}

export function SoloCounter({ lang }: { lang: string }) {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(getDays());
    const timer = setInterval(() => setDays(getDays()), 50);
    return () => clearInterval(timer);
  }, []);

  if (days === null) return null;

  const label = lang === "zh" ? "一人公司" : "Solo Company";

  return (
    <p className="font-mono text-sm text-neutral-400 dark:text-neutral-500 tabular-nums">
      {label} Day {days.toFixed(8)}
    </p>
  );
}
