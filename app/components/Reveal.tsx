"use client";

import { useEffect } from "react";

// Scroll reveals. The page is fully visible without JS or with reduced motion; this only hides
// things that start below the fold, then un-hides them as they scroll into view. The .rv/.rv-in
// classes (styled per theme in theme.css) are removed again once the reveal has played, so they
// never leave a lingering transition behind to fight hover effects.
const TARGETS = ".sign-head, .rack > div, .neon, .metro > li, .poster, .shop, .pull";
const CLEAN_AFTER = 1400;

export default function Reveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cutoff = window.innerHeight * 0.92;
    const els = [...document.querySelectorAll<HTMLElement>(TARGETS)].filter(
      (el) => el.getBoundingClientRect().top > cutoff,
    );
    const timers: number[] = [];

    for (const el of els) {
      const peers = [...(el.parentElement?.children ?? [])].filter((c) => c.matches(TARGETS));
      el.style.setProperty("--rv-i", String(Math.min(peers.indexOf(el), 5)));
      el.classList.add("rv");
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          io.unobserve(el);
          el.classList.add("rv-in");
          timers.push(
            window.setTimeout(() => {
              el.classList.remove("rv", "rv-in");
              el.style.removeProperty("--rv-i");
            }, CLEAN_AFTER),
          );
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      timers.forEach(window.clearTimeout);
      for (const el of els) {
        el.classList.remove("rv", "rv-in");
        el.style.removeProperty("--rv-i");
      }
    };
  }, []);

  return null;
}
