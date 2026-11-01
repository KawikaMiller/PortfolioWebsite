// Random palette generator with guaranteed contrast, three accents.
// Body text, text on accent fills, and accent-colored text all stay above WCAG thresholds.

export type Palette = {
  name: string;
  bg: string; // page background
  fg: string; // body text
  a1: string; // accent fills
  a2: string;
  a3: string;
  a1t: string; // accents tuned for use as text on bg (>= 4.5:1)
  a2t: string;
  a3t: string;
  "on-a1": string; // text on each accent fill (>= 4.5:1)
  "on-a2": string;
  "on-a3": string;
  muted: string; // secondary text on bg (>= 4.5:1)
};

// Must match the :root defaults in globals.css.
export const DEFAULT_PALETTE: Palette = {
  name: "Hot Pink, Cyan & Lime · Night",
  bg: "#130f2e",
  fg: "#f3f0ff",
  a1: "#ff3d8b",
  a2: "#19e0ff",
  a3: "#c8f53a",
  a1t: "#ff3d8b",
  a2t: "#19e0ff",
  a3t: "#c8f53a",
  "on-a1": "#130f2e",
  "on-a2": "#130f2e",
  "on-a3": "#130f2e",
  muted: "#b4aedd",
};

export const PALETTE_KEYS = [
  "bg", "fg", "a1", "a2", "a3", "a1t", "a2t", "a3t", "on-a1", "on-a2", "on-a3", "muted",
] as const;

type RGB = [number, number, number];

export function hslToRgb(h: number, s: number, l: number): RGB {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

export const toHex = ([r, g, b]: RGB) =>
  "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");

export function luminance([r, g, b]: RGB): number {
  const c = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

export function contrast(a: RGB, b: RGB): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

const mix = (a: RGB, b: RGB, t: number): RGB => [
  Math.round(a[0] * t + b[0] * (1 - t)),
  Math.round(a[1] * t + b[1] * (1 - t)),
  Math.round(a[2] * t + b[2] * (1 - t)),
];

const rnd = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(xs: T[]): T => xs[Math.floor(Math.random() * xs.length)];

// Walk lightness outward from `l` (+0, +1, -1, +2, -2 ...) until `ok` accepts the colour.
function tune(h: number, s: number, l: number, ok: (rgb: RGB) => boolean): RGB {
  let best = hslToRgb(h, s, l);
  for (let d = 0; d <= 70; d++) {
    for (const sign of d === 0 ? [1] : [1, -1]) {
      const rgb = hslToRgb(h, s, Math.max(0, Math.min(100, l + sign * d)));
      if (ok(rgb)) return rgb;
      best = rgb;
    }
  }
  return best;
}

// Move lightness toward whichever extreme (black or white) contrasts more with the background.
function ensureContrast(h: number, s: number, l: number, bg: RGB, min: number): RGB {
  const dir = contrast([0, 0, 0], bg) >= contrast([255, 255, 255], bg) ? -1 : 1;
  let rgb = hslToRgb(h, s, l);
  for (let i = 0; i < 100 && contrast(rgb, bg) < min; i++) {
    l = Math.max(0, Math.min(100, l + dir));
    rgb = hslToRgb(h, s, l);
  }
  return rgb;
}

// The better of a near-black and a near-white tinted with the hue.
function readableOn(bg: RGB, h: number): RGB {
  const dark = hslToRgb(h, 35, 8);
  const light = hslToRgb(h, 30, 97);
  return contrast(dark, bg) >= contrast(light, bg) ? dark : light;
}

const HUES = ["Red", "Vermilion", "Amber", "Citron", "Lime", "Moss", "Jade", "Teal", "Cyan", "Azure", "Cobalt", "Indigo", "Violet", "Magenta", "Rose"];
const hueName = (h: number) => HUES[Math.floor((((h % 360) + 360) % 360) / 24)];

const dist = (a: number, b: number) => {
  const d = Math.abs((((a - b) % 360) + 360) % 360);
  return Math.min(d, 360 - d);
};

export function randomPalette(): Palette {
  // Mostly night: neon reads best against deep colour, with some daylight and poster variants.
  const mode = pick(["dark", "dark", "dark", "light", "bold"] as const);
  const h = rnd(0, 360);

  const bgRaw =
    mode === "light"
      ? { s: rnd(15, 45), l: rnd(89, 96) }
      : mode === "dark"
        ? { s: rnd(30, 60), l: rnd(6, 13) }
        : { s: rnd(55, 85), l: rnd(54, 68) };
  const bgRgb = tune(h, bgRaw.s, bgRaw.l, (c) => contrast(readableOn(c, h), c) >= 7);
  const fgRgb = readableOn(bgRgb, h);

  // Three accent hues, each clearly apart from the others and from the background.
  let hs = [h, h, h];
  for (let i = 0; i < 80; i++) {
    const h1 = rnd(0, 360);
    const h2 = h1 + rnd(70, 160);
    const h3 = h2 + rnd(70, 160);
    hs = [h1, h2, h3];
    if (
      dist(h1, h3) >= 55 &&
      hs.every((x) => dist(x, h) >= 35)
    )
      break;
  }

  const readable = (hue: number) => (c: RGB) => contrast(readableOn(c, hue), c) >= 4.7;
  const fills = hs.map((hue) => tune(hue, rnd(85, 100), rnd(52, 64), readable(hue)));
  const texts = hs.map((hue) => ensureContrast(hue, 90, 60, bgRgb, 4.5));

  let t = 0.68;
  let mutedRgb = mix(fgRgb, bgRgb, t);
  while (contrast(mutedRgb, bgRgb) < 4.5 && t < 1) {
    t += 0.03;
    mutedRgb = mix(fgRgb, bgRgb, Math.min(t, 1));
  }

  return {
    name: `${hueName(hs[0])}, ${hueName(hs[1])} & ${hueName(hs[2])} · ${mode === "light" ? "Day" : mode === "dark" ? "Night" : "Poster"}`,
    bg: toHex(bgRgb),
    fg: toHex(fgRgb),
    a1: toHex(fills[0]),
    a2: toHex(fills[1]),
    a3: toHex(fills[2]),
    a1t: toHex(texts[0]),
    a2t: toHex(texts[1]),
    a3t: toHex(texts[2]),
    "on-a1": toHex(readableOn(fills[0], hs[0])),
    "on-a2": toHex(readableOn(fills[1], hs[1])),
    "on-a3": toHex(readableOn(fills[2], hs[2])),
    muted: toHex(mutedRgb),
  };
}

const parse = (hex: string): RGB => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

export function audit(p: Palette) {
  const bg = parse(p.bg);
  return {
    body: contrast(parse(p.fg), bg),
    muted: contrast(parse(p.muted), bg),
    onA1: contrast(parse(p["on-a1"]), parse(p.a1)),
    onA2: contrast(parse(p["on-a2"]), parse(p.a2)),
    onA3: contrast(parse(p["on-a3"]), parse(p.a3)),
    a1Text: contrast(parse(p.a1t), bg),
    a2Text: contrast(parse(p.a2t), bg),
    a3Text: contrast(parse(p.a3t), bg),
  };
}
