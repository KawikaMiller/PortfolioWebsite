"use client";

import { useEffect, useRef } from "react";

// Three orthogonal great circles turning in 3D around a core, like a gyroscope or armillary sphere.
const STEPS = 72;
const RINGS = [0, 1, 2].map((k) =>
  Array.from({ length: STEPS }, (_, i) => {
    const a = (i / STEPS) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    return (k === 0 ? [c, s, 0] : k === 1 ? [0, c, s] : [c, 0, s]) as [number, number, number];
  }),
);

function pathFor(k: number, t: number) {
  const ax = 0.75;
  return (
    RINGS[k]
      .map(([x, y, z], i) => {
        const x1 = x * Math.cos(t) + z * Math.sin(t);
        const z1 = -x * Math.sin(t) + z * Math.cos(t);
        const y2 = y * Math.cos(ax) - z1 * Math.sin(ax);
        return `${i === 0 ? "M" : "L"}${(200 + x1 * 108).toFixed(1)} ${(165 + y2 * 108).toFixed(1)}`;
      })
      .join("") + "Z"
  );
}

export default function Gyroscope() {
  const paths = useRef<(SVGPathElement | null)[]>([]);

  const draw = (t: number) => {
    for (let k = 0; k < 3; k++) paths.current[k]?.setAttribute("d", pathFor(k, t + k * 0.35));
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      draw(0.5);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      draw(0.5 + ((now - start) / 1000) * 0.7);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const cls = ["s1", "s2", "s3"];
  return (
    <svg className="em" viewBox="0 0 400 330" aria-hidden="true" focusable="false">
      <circle className="sl" cx="200" cy="165" r="134" strokeWidth="1.5" strokeDasharray="2 8" />
      {[0, 1, 2].map((k) => (
        <path
          key={k}
          ref={(el) => {
            paths.current[k] = el;
          }}
          className={cls[k]}
          strokeWidth="4"
          strokeLinejoin="round"
          d={pathFor(k, 0.5 + k * 0.35)}
        />
      ))}
      <circle className="f1" cx="200" cy="165" r="12" />
      <circle className="s1" cx="200" cy="165" r="22" strokeWidth="2" />
    </svg>
  );
}
