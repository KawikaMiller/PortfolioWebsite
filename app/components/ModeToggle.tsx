"use client";

import { useSyncExternalStore } from "react";

// Light/dark for the minimal theme. Dark is the default; only "light" is stored. The inline script
// in layout.tsx applies a saved choice before first paint. Neon ignores this (CSS hides the button).
type Mode = "dark" | "light";

const KEY = "km-mode";
const EVENT = "km-mode-change";

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}

const getMode = (): Mode => (document.documentElement.dataset.mode === "light" ? "light" : "dark");

export default function ModeToggle() {
  const mode = useSyncExternalStore(subscribe, getMode, () => "dark" as Mode);

  const toggle = () => {
    const next: Mode = mode === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.classList.add("palette-anim"); // brief color fade
    window.setTimeout(() => root.classList.remove("palette-anim"), 500);
    root.dataset.mode = next;
    try {
      if (next === "light") localStorage.setItem(KEY, "light");
      else localStorage.removeItem(KEY);
    } catch {
      /* storage can be blocked; the choice just won't persist */
    }
    window.dispatchEvent(new Event(EVENT));
  };

  const label = mode === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button type="button" className="mode" onClick={toggle} aria-label={label} title={label}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        {mode === "dark" ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        ) : (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        )}
      </svg>
    </button>
  );
}
