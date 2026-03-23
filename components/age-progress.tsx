"use client";

import { useEffect, useState } from "react";

const BIRTHDAY = new Date("1994-06-21T00:00:00+08:00").getTime();
const LIFE_EXPECTANCY = 90;

function getAge() {
  const now = Date.now();
  const ageMs = now - BIRTHDAY;
  return ageMs / (365.25 * 24 * 60 * 60 * 1000);
}

export function AgeProgress() {
  const [age, setAge] = useState<number | null>(null);
  const [showETD, setShowETD] = useState(false);

  useEffect(() => {
    setAge(getAge());
    const timer = setInterval(() => setAge(getAge()), 50);
    return () => clearInterval(timer);
  }, []);

  if (age === null) return null;

  const yearsLeft = LIFE_EXPECTANCY - age;

  return (
    <p
      className="mt-6 font-mono text-sm text-neutral-400 dark:text-neutral-500 cursor-pointer select-none tabular-nums"
      onClick={() => setShowETD((v) => !v)}
    >
      {showETD ? (
        <>
          <span>{yearsLeft.toFixed(20)} ETD</span>
        </>
      ) : (
        <>
          <span>{age.toFixed(20)}</span>
        </>
      )}
    </p>
  );
}
