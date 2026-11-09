/** Northern-hemisphere meteorological seasons, from the visitor's local date. */
export const SEASONS = ["spring", "summer", "autumn", "winter"] as const;
export type Season = (typeof SEASONS)[number];

export function isSeason(value: string | null | undefined): value is Season {
  return (
    value === "spring" ||
    value === "summer" ||
    value === "autumn" ||
    value === "winter"
  );
}

/** Month is 0–11, local time. Mar–May spring, Jun–Aug summer, Sep–Nov autumn, Dec–Feb winter. */
export function seasonFromDate(date: Date): Season {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}

/** `?season=spring|summer|autumn|winter`. Anything else returns null. */
export function seasonFromSearch(search: string): Season | null {
  const value = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search,
  )
    .get("season")
    ?.toLowerCase();
  return isSeason(value) ? value : null;
}
