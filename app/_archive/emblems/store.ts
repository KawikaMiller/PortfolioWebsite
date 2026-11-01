// Tiny external store for the currently previewed badge (temporary study tooling).
// Persists to localStorage; `memory` covers browsers where storage is blocked.
// `liked` marks the ones you picked out, so they're easy to spot while cycling.
export const OPTIONS = [
  { id: "0", name: "Sun & lotus (current)" },
  { id: "A", name: "Reticle" },
  { id: "B", name: "Service topology" },
  { id: "C", name: "Shield + keyhole", liked: true },
  { id: "D", name: "Dithered planet", liked: true },
  { id: "E", name: "Wireframe solid", liked: true },
  { id: "F", name: "KM monogram" },
  { id: "G", name: "Signal scope", liked: true },
  { id: "H", name: "Wireframe terrain" },
  { id: "I", name: "Isometric stack" },
  { id: "J", name: "Radar sweep" },
  { id: "K", name: "Gyroscope" },
  { id: "L", name: "Fingerprint scan" },
  { id: "M", name: "Circuit die" },
  { id: "N", name: "Hex cluster" },
  { id: "O", name: "Faction sigil" },
  { id: "P", name: "Spectrum bars" },
  { id: "Q", name: "Orb & web" },
  { id: "R", name: "Fingerprint + die (L+M)" },
] as { id: string; name: string; liked?: boolean }[];

// Bumped so the newest option shows first the next time the page loads.
const KEY = "km-emblem-v2";
const DEFAULT_INDEX = OPTIONS.length - 1;
const EVENT = "km-emblem-change";
let memory: number | undefined;

export function readIndex(): number {
  if (memory !== undefined) return memory;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return DEFAULT_INDEX;
    const n = Number(raw);
    return Number.isInteger(n) && n >= 0 && n < OPTIONS.length ? n : DEFAULT_INDEX;
  } catch {
    return DEFAULT_INDEX;
  }
}

export function setIndex(n: number) {
  memory = ((n % OPTIONS.length) + OPTIONS.length) % OPTIONS.length;
  try {
    localStorage.setItem(KEY, String(memory));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
