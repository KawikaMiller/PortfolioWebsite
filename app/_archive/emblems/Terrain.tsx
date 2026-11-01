"use client";

import { useEffect, useRef } from "react";

// Wireframe terrain scrolling toward the viewer: a vector-era horizon with a striped sun and ridges.
const N = 11;
const HORIZON = 120;
const BOTTOM = 296;

function y(i: number, phase: number) {
  const p = ((i + phase) % N) / N;
  return { y: HORIZON + (BOTTOM - HORIZON) * p * p, p };
}

export default function Terrain() {
  const lines = useRef<(SVGLineElement | null)[]>([]);

  const draw = (phase: number) => {
    for (let i = 0; i < N; i++) {
      const l = lines.current[i];
      if (!l) continue;
      const { y: yy, p } = y(i, phase);
      l.setAttribute("y1", yy.toFixed(1));
      l.setAttribute("y2", yy.toFixed(1));
      l.setAttribute("opacity", (0.25 + 0.75 * p).toFixed(2));
    }
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      draw(0);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      draw(((now - start) / 1000) * 0.55);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const radials = Array.from({ length: 17 }, (_, k) => 200 + (k - 8) * 52);
  return (
    <svg className="em" viewBox="0 0 400 330" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="em-terrain-clip">
          <rect x="30" y="30" width="340" height="266" />
        </clipPath>
        <mask id="em-sun-mask">
          <rect x="120" y="50" width="160" height="70" fill="#fff" />
          <rect x="120" y="92" width="160" height="3" fill="#000" />
          <rect x="120" y="102" width="160" height="5" fill="#000" />
          <rect x="120" y="112" width="160" height="8" fill="#000" />
        </mask>
      </defs>
      <g clipPath="url(#em-terrain-clip)">
        <circle className="f1" cx="200" cy="120" r="62" mask="url(#em-sun-mask)" />
        <path className="s2" strokeWidth="2.5" strokeLinejoin="round" d="M30 120L66 92L92 110L128 72L160 112L196 96L228 118L262 84L296 112L326 90L370 120" />
        <path className="sl" strokeWidth="1.5" strokeLinejoin="round" d="M30 120L58 106L86 120L116 100L150 120L190 108L226 120L270 104L310 120L346 108L370 120" />
        <rect className="f3" x="30" y="119" width="340" height="2.5" />
        {radials.map((x, i) => (
          <line key={i} className="s3" strokeWidth="1.6" opacity="0.8" x1="200" y1={HORIZON} x2={x} y2={BOTTOM} />
        ))}
        {Array.from({ length: N }, (_, i) => (
          <line
            key={i}
            ref={(el) => {
              lines.current[i] = el;
            }}
            className="s2"
            strokeWidth="2"
            x1="30"
            x2="370"
            y1={y(i, 0).y.toFixed(1)}
            y2={y(i, 0).y.toFixed(1)}
          />
        ))}
      </g>
      <path className="s1" strokeWidth="3" d="M30 30H62M30 30V58M370 30H338M370 30V58M30 296H62M30 296V268M370 296H338M370 296V268" />
    </svg>
  );
}
