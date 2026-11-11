"use client";

import { useEffect, useRef, useState } from "react";
import {
  GROVE_COLS,
  GROVE_ROWS,
  groveColors,
  groveFor,
  paletteFor,
  poseAt,
  project,
  spawnLeaves,
  stepLeaves,
  type FallingLeaf,
} from "@/lib/pixel-grove";
import { seasonFromDate, seasonFromSearch, type Season } from "@/lib/season";

const CSS_SCALE = 4;
const MAX_LEAVES = 28;

type SeasonNames = Record<Season, string>;

function resolveSeason(): Season {
  return seasonFromSearch(window.location.search) ?? seasonFromDate(new Date());
}

function readDark(): boolean {
  const theme = document.documentElement.dataset.theme;
  if (theme === "dark") return true;
  if (theme === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function SeasonalPixelTree({
  shakeLabel,
  stillLabel,
  seasons,
}: {
  shakeLabel: string;
  stillLabel: string;
  seasons: SeasonNames;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shakeRef = useRef<(x: number) => void>(() => {});
  const reducedRef = useRef(false);
  const [season, setSeason] = useState<Season | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const seasonNow = resolveSeason();
    setSeason(seasonNow);
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedRef.current = motionQuery.matches;
    setReduced(motionQuery.matches);

    const pixels = groveFor(seasonNow);
    let dark = readDark();
    let shakeAmp = 0;
    let shakeDir = 1;
    const leaves: FallingLeaf[] = [];
    const scratch = new Int16Array(pixels.length * 3 + 64);
    let frame = 0;
    let looping = false;
    let last = performance.now();
    let visible = true;
    let running = true;

    const fit = () => {
      const box = canvas.parentElement;
      const avail = box?.parentElement?.clientWidth || box?.clientWidth || GROVE_COLS * CSS_SCALE;
      const cssScale = Math.max(2, Math.min(CSS_SCALE, Math.floor(avail / GROVE_COLS) || 2));
      const cssW = GROVE_COLS * cssScale;
      const cssH = GROVE_ROWS * cssScale;
      if (box) box.style.width = `${cssW}px`;
      const dpr = window.devicePixelRatio || 1;
      const deviceScale = Math.max(cssScale, Math.round(cssScale * dpr));
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      const bitmapW = GROVE_COLS * deviceScale;
      const bitmapH = GROVE_ROWS * deviceScale;
      if (canvas.width !== bitmapW || canvas.height !== bitmapH) {
        canvas.width = bitmapW;
        canvas.height = bitmapH;
      }
      ctx.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };

    const paint = (time: number) => {
      const palette = paletteFor(seasonNow, dark);
      const pose = reducedRef.current
        ? { treeShift: 0, bushShift: 0 }
        : poseAt(time, shakeAmp, shakeDir);
      const count = project(pixels, pose, scratch);
      ctx.clearRect(0, 0, GROVE_COLS, GROVE_ROWS);
      for (let color = 0; color < palette.length; color++) {
        const [r, g, b] = palette[color] ?? [0, 0, 0];
        ctx.fillStyle = `rgb(${r} ${g} ${b})`;
        for (let i = 0; i < count; i++) {
          if (scratch[i * 3 + 2] !== color) continue;
          ctx.fillRect(scratch[i * 3] ?? 0, scratch[i * 3 + 1] ?? 0, 1, 1);
        }
      }
      if (!reducedRef.current && seasonNow === "autumn") {
        for (const leaf of leaves) {
          const [r, g, b] = palette[leaf.color] ?? [0, 0, 0];
          ctx.fillStyle = `rgb(${r} ${g} ${b})`;
          const x = Math.round(leaf.x);
          const y = Math.round(leaf.y);
          ctx.fillRect(x, y, 2, 1);
          ctx.fillRect(x, y + 1, 1, 1);
        }
      }
      if (!reducedRef.current && seasonNow === "winter") {
        const [r, g, b] = palette[groveColors.snow] ?? [247, 244, 237];
        ctx.fillStyle = `rgb(${r} ${g} ${b})`;
        for (let i = 0; i < 5; i++) {
          const x = Math.round((6 + i * 10 + Math.sin(time * 0.45 + i) * 2.4) % GROVE_COLS);
          const y = Math.round((time * 3.2 + i * 9.5) % (GROVE_ROWS + 6) - 3);
          if (y >= 0 && y < GROVE_ROWS - 2) ctx.fillRect(x, y, 1, 1);
        }
      }
    };

    const loop = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (shakeAmp > 0) {
        shakeAmp *= Math.exp(-3.4 * dt);
        if (shakeAmp < 0.02) shakeAmp = 0;
      }
      if (seasonNow === "autumn" && leaves.length) stepLeaves(leaves, dt, now / 1000);
      paint(now / 1000);
      if (!reducedRef.current && visible && document.visibilityState !== "hidden") {
        frame = requestAnimationFrame(loop);
      } else {
        looping = false;
      }
    };

    const start = () => {
      if (reducedRef.current) {
        cancelAnimationFrame(frame);
        looping = false;
        leaves.length = 0;
        shakeAmp = 0;
        paint(0);
        return;
      }
      if (looping) return;
      last = performance.now();
      looping = true;
      frame = requestAnimationFrame(loop);
    };

    shakeRef.current = (x: number) => {
      if (reducedRef.current) return;
      const treeCenter = 36;
      shakeDir = x < treeCenter ? 1 : -1;
      shakeAmp = 1;
      if (seasonNow === "autumn" && leaves.length < MAX_LEAVES) {
        const born = spawnLeaves(pixels, shakeDir, Math.random);
        for (const leaf of born) {
          if (leaves.length < MAX_LEAVES) leaves.push(leaf);
        }
      }
      if (!looping) start();
    };

    fit();
    start();

    const onMotion = () => {
      reducedRef.current = motionQuery.matches;
      setReduced(motionQuery.matches);
      start();
    };
    const onTheme = () => {
      dark = readDark();
      if (reducedRef.current) paint(0);
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") start();
      else {
        cancelAnimationFrame(frame);
        looping = false;
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible) start();
      else {
        cancelAnimationFrame(frame);
        looping = false;
      }
    });
    const themeObserver = new MutationObserver(onTheme);
    const colorQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const resizeHost = canvas.parentElement?.parentElement ?? canvas.parentElement;
    const resizeObserver = new ResizeObserver(() => {
      fit();
      if (reducedRef.current) paint(0);
    });

    motionQuery.addEventListener("change", onMotion);
    colorQuery.addEventListener("change", onTheme);
    document.addEventListener("visibilitychange", onVisibility);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    observer.observe(canvas);
    if (resizeHost) resizeObserver.observe(resizeHost);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      motionQuery.removeEventListener("change", onMotion);
      colorQuery.removeEventListener("change", onTheme);
      document.removeEventListener("visibilitychange", onVisibility);
      themeObserver.disconnect();
      observer.disconnect();
      resizeObserver.disconnect();
      shakeRef.current = () => {};
    };
  }, []);

  const seasonName = season ? seasons[season] : "";
  const label = reduced
    ? seasonName
      ? `${stillLabel} (${seasonName})`
      : stillLabel
    : seasonName
      ? `${shakeLabel} (${seasonName})`
      : shakeLabel;

  return (
    <div
      role={reduced ? "img" : "button"}
      tabIndex={reduced ? -1 : 0}
      aria-label={label}
      className={
        reduced
          ? "block max-w-full cursor-default select-none"
          : "block max-w-full cursor-pointer select-none touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-500"
      }
      style={{ width: GROVE_COLS * CSS_SCALE, WebkitTapHighlightColor: "transparent" }}
      onPointerUp={(event) => {
        if (event.button !== 0 || reducedRef.current) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * GROVE_COLS;
        shakeRef.current(x);
      }}
      onKeyDown={(event) => {
        if (reducedRef.current) return;
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        shakeRef.current(GROVE_COLS / 2);
      }}
    >
      <canvas
        ref={canvasRef}
        width={GROVE_COLS}
        height={GROVE_ROWS}
        aria-hidden="true"
        className="block h-auto w-full"
        style={{ imageRendering: "pixelated", aspectRatio: `${GROVE_COLS} / ${GROVE_ROWS}` }}
      />
    </div>
  );
}
