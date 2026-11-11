import type { Season } from "./season";

/**
 * Original pixel grove for the about page.
 * The scene is drawn in code for this site. It is not FeralUI art or code.
 * Grid is y-down. Group 0 is the tree, group 1 is the bush.
 */

export const GROVE_COLS = 56;
export const GROVE_ROWS = 48;

export const groveColors = {
  trunk: 0,
  trunkDark: 1,
  branch: 2,
  leaf: 3,
  leafDark: 4,
  accent: 5,
  snow: 6,
  snowShade: 7,
  ground: 8,
} as const;

export type RGB = readonly [number, number, number];

const LIGHT: Record<Season, readonly RGB[]> = {
  spring: [
    [98, 68, 46],
    [68, 46, 32],
    [122, 86, 58],
    [126, 158, 98],
    [82, 116, 70],
    [212, 142, 158],
    [255, 252, 248],
    [214, 206, 196],
    [198, 188, 172],
  ],
  summer: [
    [90, 62, 42],
    [58, 40, 28],
    [112, 78, 52],
    [62, 112, 58],
    [40, 78, 42],
    [112, 156, 86],
    [255, 252, 248],
    [214, 206, 196],
    [198, 188, 172],
  ],
  autumn: [
    [104, 70, 46],
    [70, 46, 32],
    [128, 86, 54],
    [196, 98, 48],
    [148, 62, 36],
    [214, 164, 72],
    [255, 252, 248],
    [214, 206, 196],
    [198, 188, 172],
  ],
  winter: [
    [112, 90, 72],
    [78, 62, 50],
    [132, 108, 86],
    [126, 158, 98],
    [82, 116, 70],
    [212, 142, 158],
    [255, 255, 255],
    [168, 186, 198],
    [186, 176, 162],
  ],
};

const DARK: Record<Season, readonly RGB[]> = {
  spring: [
    [186, 146, 108],
    [132, 98, 70],
    [204, 164, 122],
    [156, 188, 122],
    [104, 142, 88],
    [232, 170, 184],
    [247, 244, 237],
    [168, 180, 188],
    [74, 68, 58],
  ],
  summer: [
    [176, 136, 100],
    [120, 88, 62],
    [196, 154, 112],
    [102, 164, 96],
    [62, 112, 64],
    [156, 198, 118],
    [247, 244, 237],
    [168, 180, 188],
    [74, 68, 58],
  ],
  autumn: [
    [196, 150, 108],
    [140, 100, 70],
    [214, 164, 114],
    [224, 122, 64],
    [176, 78, 48],
    [236, 186, 96],
    [247, 244, 237],
    [168, 180, 188],
    [74, 68, 58],
  ],
  winter: [
    [196, 168, 140],
    [140, 114, 92],
    [214, 186, 156],
    [156, 188, 122],
    [104, 142, 88],
    [232, 170, 184],
    [247, 244, 237],
    [176, 190, 198],
    [82, 74, 64],
  ],
};

export function paletteFor(season: Season, dark: boolean): readonly RGB[] {
  return dark ? DARK[season] : LIGHT[season];
}

export type GrovePixel = {
  x: number;
  y: number;
  color: number;
  /** 0 at the root, about 1 at a tip. Wind and shake scale by this. */
  flex: number;
  group: 0 | 1;
  layer: number;
};

export type FallingLeaf = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: number;
  phase: number;
};

type Stamp = {
  x: number;
  y: number;
  color: number;
  flex: number;
  group: 0 | 1;
  layer: number;
};

function hash(x: number, y: number, salt: number): number {
  let n =
    Math.imul(x | 0, 374761393) +
    Math.imul(y | 0, 668265263) +
    Math.imul(salt | 0, 1442695041);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

function buildGrove(season: Season): GrovePixel[] {
  const cells = new Map<string, Stamp>();

  function put(
    x: number,
    y: number,
    color: number,
    flex: number,
    group: 0 | 1,
    layer: number,
  ) {
    if (x < 0 || y < 0 || x >= GROVE_COLS || y >= GROVE_ROWS) return;
    const key = `${x},${y}`;
    const prev = cells.get(key);
    if (prev && prev.layer > layer) return;
    cells.set(key, { x, y, color, flex, group, layer });
  }

  function stroke(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    color: number,
    dark: number,
    flex0: number,
    flex1: number,
    group: 0 | 1,
    thick: boolean,
  ) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = Math.round(x0 + (x1 - x0) * t);
      const y = Math.round(y0 + (y1 - y0) * t);
      const flex = flex0 + (flex1 - flex0) * t;
      put(x, y, color, flex, group, 1);
      if (thick) {
        put(x - 1, y, dark, flex, group, 1);
        put(x, y + 1, dark, flex, group, 1);
        put(x + 1, y, color, flex * 0.96, group, 1);
      } else if ((i & 1) === 0) {
        put(x, y + 1, dark, flex, group, 1);
      }
    }
  }

  function clump(
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    flex: number,
    group: 0 | 1,
    salt: number,
  ) {
    const scale = season === "spring" ? 0.84 : season === "summer" ? 1.16 : 1;
    const density = season === "spring" ? 0.6 : season === "summer" ? 0.92 : 0.76;
    const accentRate =
      season === "spring" ? 0.34 : season === "summer" ? 0.12 : 0.24;
    const radiusX = rx * scale;
    const radiusY = ry * scale;
    const x0 = Math.floor(cx - radiusX - 1);
    const x1 = Math.ceil(cx + radiusX + 1);
    const y0 = Math.floor(cy - radiusY - 1);
    const y1 = Math.ceil(cy + radiusY + 1);
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const nx = (x - cx) / radiusX;
        const ny = (y - cy) / radiusY;
        const wobble = (hash(x >> 1, y >> 1, salt) - 0.5) * 0.62;
        if (nx * nx + ny * ny + wobble > 1) continue;
        const h = hash(x, y, salt + 3);
        if (h > density) continue;
        let color: number = groveColors.leaf;
        if (ny > 0.2 || hash(x, y, salt + 9) < 0.26) color = groveColors.leafDark;
        if (hash(x, y, salt + 5) < accentRate) color = groveColors.accent;
        const sway = flex * (0.9 + hash(x, y, salt + 11) * 0.18);
        put(x, y, color, Math.min(1.2, sway), group, 2);
      }
    }
  }

  for (let x = 3; x <= 52; x++) {
    if (hash(x, 45, 2) > 0.12) {
      put(x, 45, groveColors.ground, 0, 0, 0);
    }
    if (x % 5 !== 0 && hash(x, 46, 4) > 0.62) {
      put(x, 46, groveColors.ground, 0, 0, 0);
    }
  }

  // Bush, left. Twigs stay in winter; leaves cover them the rest of the year.
  stroke(13, 44, 12, 36, groveColors.trunk, groveColors.trunkDark, 0.04, 0.28, 1, true);
  stroke(11, 43, 7, 38, groveColors.branch, groveColors.trunkDark, 0.12, 0.4, 1, false);
  stroke(14, 42, 19, 37, groveColors.branch, groveColors.trunkDark, 0.12, 0.42, 1, false);
  stroke(12, 37, 6, 33, groveColors.branch, groveColors.trunkDark, 0.28, 0.62, 1, false);
  stroke(13, 37, 19, 32, groveColors.branch, groveColors.trunkDark, 0.28, 0.64, 1, false);
  stroke(12, 35, 12, 31, groveColors.branch, groveColors.trunkDark, 0.3, 0.7, 1, false);

  // Tree trunk and limbs. Flex grows toward the tips so wind bends the crown.
  stroke(36, 44, 35, 27, groveColors.trunk, groveColors.trunkDark, 0.03, 0.2, 0, true);
  stroke(36, 44, 31, 46, groveColors.trunk, groveColors.trunkDark, 0.02, 0.05, 0, true);
  stroke(36, 44, 41, 46, groveColors.trunk, groveColors.trunkDark, 0.02, 0.05, 0, true);
  stroke(35, 38, 22, 31, groveColors.branch, groveColors.trunkDark, 0.22, 0.72, 0, false);
  stroke(36, 36, 49, 29, groveColors.branch, groveColors.trunkDark, 0.22, 0.74, 0, false);
  stroke(35, 32, 20, 22, groveColors.branch, groveColors.trunkDark, 0.32, 0.88, 0, false);
  stroke(36, 31, 50, 20, groveColors.branch, groveColors.trunkDark, 0.32, 0.9, 0, false);
  stroke(35, 28, 27, 16, groveColors.branch, groveColors.trunkDark, 0.4, 1, 0, false);
  stroke(36, 28, 44, 14, groveColors.branch, groveColors.trunkDark, 0.4, 1, 0, false);
  stroke(35, 27, 35, 13, groveColors.branch, groveColors.trunkDark, 0.42, 1, 0, false);
  stroke(24, 30, 17, 26, groveColors.branch, groveColors.trunkDark, 0.55, 0.9, 0, false);
  stroke(47, 28, 53, 24, groveColors.branch, groveColors.trunkDark, 0.55, 0.92, 0, false);
  stroke(22, 22, 15, 17, groveColors.branch, groveColors.trunkDark, 0.7, 1.05, 0, false);
  stroke(48, 20, 53, 15, groveColors.branch, groveColors.trunkDark, 0.7, 1.05, 0, false);
  stroke(29, 16, 24, 11, groveColors.branch, groveColors.trunkDark, 0.8, 1.1, 0, false);
  stroke(42, 15, 48, 10, groveColors.branch, groveColors.trunkDark, 0.8, 1.1, 0, false);

  if (season !== "winter") {
    clump(13, 34, 7, 5, 0.62, 1, 8);
    clump(8, 37, 4, 3, 0.5, 1, 9);
    clump(20, 29, 5, 4, 0.78, 0, 1);
    clump(49, 27, 5, 4, 0.8, 0, 2);
    clump(18, 20, 6, 5, 0.92, 0, 3);
    clump(49, 18, 6, 5, 0.94, 0, 4);
    clump(32, 13, 7, 6, 1.02, 0, 5);
    clump(42, 14, 6, 5, 1.04, 0, 6);
    clump(34, 22, 6, 5, 0.88, 0, 7);
    if (season === "summer") {
      clump(28, 18, 5, 4, 0.96, 0, 12);
      clump(40, 20, 5, 4, 0.96, 0, 13);
    }
  } else {
    const wood = [...cells.values()];
    for (const pixel of wood) {
      if (pixel.layer !== 1 || pixel.y > 38) continue;
      if (cells.has(`${pixel.x},${pixel.y - 1}`)) continue;
      if (hash(pixel.x, pixel.y, 21) > 0.48) continue;
      // The cool cap replaces the top wood pixel so snow still reads on cream paper.
      put(pixel.x, pixel.y, groveColors.snowShade, pixel.flex, pixel.group, 3);
      put(pixel.x, pixel.y - 1, groveColors.snow, pixel.flex, pixel.group, 3);
    }
  }

  return [...cells.values()].sort((a, b) => a.layer - b.layer || a.y - b.y || a.x - b.x);
}

const groveCache = new Map<Season, GrovePixel[]>();

export function groveFor(season: Season): GrovePixel[] {
  const cached = groveCache.get(season);
  if (cached) return cached;
  const built = buildGrove(season);
  groveCache.set(season, built);
  return built;
}

export type Pose = { treeShift: number; bushShift: number };

export function poseAt(time: number, shakeAmp: number, shakeDir: number): Pose {
  const breeze = Math.sin(time * 0.85) * 0.7 + Math.sin(time * 0.27 + 0.8) * 0.35;
  const gustPoint = (time % 8.5) - 5.8;
  const gust = Math.exp(-(gustPoint * gustPoint) / 0.4);
  const wind = breeze * (1 + gust * 0.95);
  const wobble = Math.sin(time * 22) * shakeAmp * 1.2;
  const bend = shakeDir * shakeAmp * 3.6 + wobble;
  const bushWind = Math.sin(time * 1.08 + 1.5) * 0.6 + Math.sin(time * 0.34) * 0.25;
  return {
    treeShift: wind * 1.45 + bend,
    bushShift: bushWind * 1.15 + bend * 0.7,
  };
}

/** Writes x, y, color triples. Returns how many pixels were written. */
export function project(pixels: readonly GrovePixel[], pose: Pose, out: Int16Array): number {
  let count = 0;
  for (const pixel of pixels) {
    const shift = (pixel.group === 0 ? pose.treeShift : pose.bushShift) * pixel.flex;
    const x = pixel.x + Math.round(shift);
    const y = pixel.y + Math.round(Math.abs(shift) * 0.28);
    if (x < 0 || y < 0 || x >= GROVE_COLS || y >= GROVE_ROWS) continue;
    const index = count * 3;
    out[index] = x;
    out[index + 1] = y;
    out[index + 2] = pixel.color;
    count++;
  }
  return count;
}

export function spawnLeaves(
  pixels: readonly GrovePixel[],
  dir: number,
  random: () => number,
): FallingLeaf[] {
  const canopy = pixels.filter(
    (pixel) => pixel.group === 0 && pixel.layer === 2 && pixel.flex > 0.75,
  );
  const leaves: FallingLeaf[] = [];
  const count = Math.min(12, canopy.length);
  for (let i = 0; i < count; i++) {
    const swap = i + Math.floor(random() * (canopy.length - i));
    const pixel = canopy[swap];
    canopy[swap] = canopy[i];
    if (!pixel) continue;
    leaves.push({
      x: pixel.x + dir * (2 + random() * 3),
      y: pixel.y + 1,
      vx: dir * (12 + random() * 16),
      vy: 3 + random() * 7,
      color: random() < 0.7 ? groveColors.accent : groveColors.leafDark,
      phase: random() * Math.PI * 2,
    });
  }
  return leaves;
}

export function stepLeaves(leaves: FallingLeaf[], dt: number, time: number) {
  let write = 0;
  for (let i = 0; i < leaves.length; i++) {
    const leaf = leaves[i];
    if (!leaf) continue;
    leaf.vy += 36 * dt;
    leaf.vx += Math.sin(time * 2.4 + leaf.phase) * 10 * dt;
    leaf.x += leaf.vx * dt;
    leaf.y += leaf.vy * dt;
    if (leaf.y < GROVE_ROWS && leaf.x > -2 && leaf.x < GROVE_COLS + 2) {
      leaves[write++] = leaf;
    }
  }
  leaves.length = write;
}
