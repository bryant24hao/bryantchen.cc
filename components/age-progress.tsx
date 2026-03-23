"use client";

import { useEffect, useState } from "react";

const BIRTHDAY = new Date("1994-06-21T00:00:00+08:00").getTime();
const LIFE_EXPECTANCY = 90;

function getAge() {
  const now = Date.now();
  const ageMs = now - BIRTHDAY;
  const ageYears = ageMs / (365.25 * 24 * 60 * 60 * 1000);
  return ageYears;
}

export function AgeProgress() {
  const [age, setAge] = useState<number | null>(null);

  useEffect(() => {
    setAge(getAge());
    const timer = setInterval(() => setAge(getAge()), 50);
    return () => clearInterval(timer);
  }, []);

  if (age === null) return null;

  const progress = (age / LIFE_EXPECTANCY) * 100;
  const yearsLeft = LIFE_EXPECTANCY - age;

  return (
    <div className="mt-6">
      <div className="flex items-baseline justify-between text-xs text-neutral-400 dark:text-neutral-500 mb-1.5 font-mono">
        <span>{age.toFixed(8)}</span>
        <span>{yearsLeft.toFixed(2)} yrs left</span>
      </div>
      <div className="h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-neutral-900 dark:bg-neutral-100 rounded-full transition-none"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
}
