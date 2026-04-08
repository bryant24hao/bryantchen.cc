"use client";

import { useState, useEffect } from "react";

const COUNTER_API = "https://stats.bryantchen.cc";

interface Props {
  locale: "zh" | "en";
}

export function VisitorCounter({ locale }: Props) {
  const [stats, setStats] = useState<{ total: number; today: number } | null>(
    null
  );

  useEffect(() => {
    const visited = sessionStorage.getItem("visited");

    if (visited) {
      fetch(`${COUNTER_API}/api/stats`)
        .then((r) => r.json())
        .then(setStats)
        .catch(() => {});
    } else {
      fetch(`${COUNTER_API}/api/visit`, { method: "POST" })
        .then((r) => r.json())
        .then((data) => {
          setStats(data);
          sessionStorage.setItem("visited", "1");
        })
        .catch(() => {});
    }
  }, []);

  if (!stats) return null;

  return (
    <p className="font-mono text-sm text-neutral-400 dark:text-neutral-500 tabular-nums">
      {locale === "zh"
        ? `${stats.total.toLocaleString()} 位访客到过这里`
        : `${stats.total.toLocaleString()} visitors have been here`}
    </p>
  );
}
