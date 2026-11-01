"use client";

import { useEffect, useRef } from "react";

// A slowly turning wireframe icosahedron: nodded to the game-art / 3D side of the background.
const phi = (1 + Math.sqrt(5)) / 2;
const V: [number, number, number][] = [
  [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
  [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
  [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
];
const E: [number, number][] = [];
for (let i = 0; i < V.length; i++)
  for (let j = i + 1; j < V.length; j++) {
    const d = Math.hypot(V[i][0] - V[j][0], V[i][1] - V[j][1], V[i][2] - V[j][2]);
    if (Math.abs(d - 2) < 0.01) E.push([i, j]);
  }

function project(t: number) {
  const ay = t;
  const ax = 0.55;
  return V.map(([x, y, z]) => {
    const x1 = x * Math.cos(ay) + z * Math.sin(ay);
    const z1 = -x * Math.sin(ay) + z * Math.cos(ay);
    const y2 = y * Math.cos(ax) - z1 * Math.sin(ax);
    const z2 = y * Math.sin(ax) + z1 * Math.cos(ax);
    return { x: 200 + x1 * 62, y: 165 + y2 * 62, z: z2 };
  });
}

export default function Wireframe() {
  const lines = useRef<(SVGLineElement | null)[]>([]);

  const draw = (t: number) => {
    const p = project(t);
    E.forEach(([a, b], i) => {
      const l = lines.current[i];
      if (!l) return;
      l.setAttribute("x1", p[a].x.toFixed(1));
      l.setAttribute("y1", p[a].y.toFixed(1));
      l.setAttribute("x2", p[b].x.toFixed(1));
      l.setAttribute("y2", p[b].y.toFixed(1));
      const front = (p[a].z + p[b].z) / 2 > 0;
      l.setAttribute("opacity", front ? "1" : "0.28");
      l.setAttribute("stroke-width", front ? "3" : "1.5");
    });
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      draw(0.6);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      draw(0.6 + ((now - start) / 1000) * 0.45);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const p0 = project(0.6);
  return (
    <svg className="em" viewBox="0 0 400 330" aria-hidden="true" focusable="false">
      <circle className="sl" cx="200" cy="165" r="132" strokeWidth="1.5" strokeDasharray="2 7" />
      <circle className="s3" cx="200" cy="165" r="148" strokeWidth="2" strokeDasharray="60 30" />
      {E.map(([a, b], i) => (
        <line
          key={i}
          ref={(el) => {
            lines.current[i] = el;
          }}
          className="s2"
          strokeLinecap="round"
          x1={p0[a].x.toFixed(1)}
          y1={p0[a].y.toFixed(1)}
          x2={p0[b].x.toFixed(1)}
          y2={p0[b].y.toFixed(1)}
        />
      ))}
      <circle className="f1" cx="200" cy="165" r="5" />
    </svg>
  );
}
