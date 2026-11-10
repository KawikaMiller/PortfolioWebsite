"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  DEFAULT_PALETTE,
  PALETTE_KEYS,
  randomPalette,
  type Palette,
} from "../lib/palette";

const STORAGE_KEY = "km-palette-neon"; // per-design key so palettes from other designs never leak in
const EVENT = "km-palette-change";

// The saved palette is an external store (localStorage). `memory` covers browsers where
// storage is blocked, so the swatches still follow the shuffle within a visit.
let memory: string | null | undefined;

function read(): string | null {
  if (memory !== undefined) return memory;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function write(p: Palette | null) {
  memory = p ? JSON.stringify(p) : null;
  try {
    if (memory) localStorage.setItem(STORAGE_KEY, memory);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage can be blocked; the palette just won't persist */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function apply(p: Palette) {
  const root = document.documentElement;
  // Brief colour transition only while shuffling, so normal interaction stays snappy.
  root.classList.add("palette-anim");
  window.setTimeout(() => root.classList.remove("palette-anim"), 500);
  for (const k of PALETTE_KEYS) root.style.setProperty(`--${k}`, p[k]);
}

export default function ThemeShuffle() {
  const saved = useSyncExternalStore(subscribe, read, () => null);
  const palette = useMemo<Palette>(() => {
    if (!saved) return DEFAULT_PALETTE;
    try {
      return JSON.parse(saved) as Palette;
    } catch {
      return DEFAULT_PALETTE;
    }
  }, [saved]);
  const custom = saved !== null;
  // Palettes you've moved away from this visit, so Back only appears when it has somewhere to go.
  const [history, setHistory] = useState<Palette[]>([]);

  const shuffle = () => {
    setHistory((h) => [...h.slice(-9), palette]);
    const next = randomPalette();
    apply(next);
    write(next);
  };

  const back = () => {
    const prev = history[history.length - 1];
    if (!prev) return;
    setHistory(history.slice(0, -1));
    apply(prev);
    write(prev === DEFAULT_PALETTE ? null : prev);
  };

  const reset = () => {
    setHistory([]);
    apply(DEFAULT_PALETTE);
    write(null);
  };

  return (
    <div className="shuffle">
      <button type="button" className="shuffle-btn" onClick={shuffle} aria-label="Shuffle colors">
        <span className="swatches" aria-hidden="true">
          <i style={{ background: palette.a1 }} />
          <i style={{ background: palette.a2 }} />
          <i style={{ background: palette.a3 }} />
        </span>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
          <path
            d="M3 7h3.2c1.6 0 3 .8 3.9 2.1l3.8 5.8c.9 1.3 2.3 2.1 3.9 2.1H21M3 17h3.2c1.6 0 3-.8 3.9-2.1M13.9 9.1c.9-1.3 2.3-2.1 3.9-2.1H21M18 4l3 3-3 3M18 14l3 3-3 3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
          />
        </svg>
      </button>
      {custom && (
        <>
          {history.length > 0 && (
            <button type="button" className="shuffle-mini" onClick={back} aria-label="Previous palette">
              ←
            </button>
          )}
          <button type="button" className="shuffle-mini" onClick={reset}>
            Reset
          </button>
        </>
      )}
      <span className="shuffle-name" aria-hidden="true">
        {palette.name}
      </span>
      <span className="sr-only" role="status" aria-live="polite">
        Color palette: {palette.name}
      </span>
    </div>
  );
}
