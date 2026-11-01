"use client";

import { useState, useSyncExternalStore } from "react";
import { PALETTE_KEYS } from "../lib/palette";

// Two looks share one page. "pro" is the quiet default; "neon" is the original loud design and
// is the easter egg. The choice lives in <html data-theme>, which the inline script in layout.tsx
// sets before first paint from localStorage.
type Theme = "pro" | "neon";

const THEME_KEY = "km-theme";
const PALETTE_KEY = "km-palette-neon"; // same key ThemeShuffle uses
const EVENT = "km-theme-change";

// Timeline of the glitch, in ms. The swap happens while the screen is covered.
const SWAP_AT = 560;
const DONE_AT = 1250;

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}

const getTheme = (): Theme =>
  document.documentElement.dataset.theme === "neon" ? "neon" : "pro";

// Neon palettes are applied as inline custom properties, which would beat the pro stylesheet,
// so they are cleared on the way out and restored from storage on the way back in.
function commit(next: Theme) {
  const root = document.documentElement;
  root.dataset.theme = next;
  try {
    if (next === "neon") localStorage.setItem(THEME_KEY, "neon");
    else localStorage.removeItem(THEME_KEY);
  } catch {
    /* storage can be blocked; the choice just won't persist */
  }
  for (const k of PALETTE_KEYS) root.style.removeProperty(`--${k}`);
  if (next === "neon") {
    try {
      const p = JSON.parse(localStorage.getItem(PALETTE_KEY) || "null");
      if (p) for (const k of PALETTE_KEYS) root.style.setProperty(`--${k}`, p[k]);
    } catch {
      /* fall back to the default neon palette from the stylesheet */
    }
  }
  window.dispatchEvent(new Event(EVENT));
}

const LOG: Record<Theme, string[]> = {
  neon: ["> sudo vibe --enable", "> loading neon.css ........ ok", "> signal: ████████ 100%"],
  pro: ["> vibe --disable", "> restoring default.css ... ok", "> standing by"],
};

export default function ThemeSwitch() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "pro" as Theme);
  const [fx, setFx] = useState<Theme | null>(null); // the theme being glitched toward

  const go = () => {
    if (fx) return;
    const next: Theme = theme === "pro" ? "neon" : "pro";
    const root = document.documentElement;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // No glitch: a plain colour fade is enough.
      root.classList.add("palette-anim");
      commit(next);
      window.setTimeout(() => root.classList.remove("palette-anim"), 500);
      return;
    }

    setFx(next);
    root.classList.add("glitching");
    window.setTimeout(() => commit(next), SWAP_AT);
    window.setTimeout(() => {
      root.classList.remove("glitching");
      setFx(null);
    }, DONE_AT);
  };

  return (
    <>
      <button
        type="button"
        className="egg"
        onClick={go}
        disabled={fx !== null}
        aria-label={theme === "pro" ? "Switch to the colorful design" : "Switch to the minimal design"}
        title={theme === "pro" ? "Switch to the colorful design" : "Back to the minimal design"}
      >
        <span aria-hidden="true">{theme === "pro" ? "sudo vibe" : "exit"}</span>
      </button>
      {fx && (
        <div className="glitch-fx" aria-hidden="true">
          <i className="gl-flash" />
          <i className="gl-scan" />
          {Array.from({ length: 9 }, (_, n) => (
            <i key={n} className="gl-bar" />
          ))}
          <p className="gl-log">
            {LOG[fx].map((l, n) => (
              <span key={l} style={{ animationDelay: `${0.12 + n * 0.2}s` }}>
                {l}
              </span>
            ))}
          </p>
        </div>
      )}
    </>
  );
}
