// Ten more candidate emblems. Scratch work for choosing the hero badge.
const C = { x: 200, y: 165 };

function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f1 = (n: number) => n.toFixed(1);

/* I: isometric stack of cubes, like services stacked up */
export function IsoStack() {
  const s = 48;
  const k = 0.866;
  const origin = { x: 200, y: 200 };
  const cubes = [
    [0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0],
    [0, 0, 1], [1, 1, 1], [0, 1, 1],
    [0, 0, 2],
  ].map(([gx, gy, gz], i) => ({
    gx, gy, gz, i,
    cx: origin.x + (gx - gy) * k * s,
    cy: origin.y + (gx + gy) * 0.5 * s - gz * s,
  }));
  cubes.sort((a, b) => a.gx + a.gy + a.gz - (b.gx + b.gy + b.gz));
  const pts = (a: [number, number][]) => a.map(([x, y]) => `${f1(x)},${f1(y)}`).join(" ");
  return (
    <svg className="em" viewBox="0 0 400 330" aria-hidden="true" focusable="false">
      {cubes.map((c) => {
        const fill = ["f1", "f2", "f3"][c.i % 3];
        const { cx, cy } = c;
        return (
          <g key={`${c.gx}${c.gy}${c.gz}`} className={fill}>
            <polygon points={pts([[cx, cy - s], [cx + k * s, cy - s / 2], [cx, cy], [cx - k * s, cy - s / 2]])} />
            <polygon opacity="0.62" points={pts([[cx - k * s, cy - s / 2], [cx, cy], [cx, cy + s], [cx - k * s, cy + s / 2]])} />
            <polygon opacity="0.36" points={pts([[cx, cy], [cx + k * s, cy - s / 2], [cx + k * s, cy + s / 2], [cx, cy + s]])} />
            <polyline className="fb" fill="none" stroke="var(--bg)" strokeWidth="2" points={pts([[cx - k * s, cy - s / 2], [cx, cy], [cx + k * s, cy - s / 2]])} />
            <line stroke="var(--bg)" strokeWidth="2" x1={f1(cx)} y1={f1(cy)} x2={f1(cx)} y2={f1(cy + s)} />
          </g>
        );
      })}
      <rect className="f3 em-blink" x="190" y="30" width="20" height="8" />
    </svg>
  );
}

/* J: radar sweep with blips */
export function Radar() {
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const a = (i * 6 * Math.PI) / 180;
    const r0 = i % 5 === 0 ? 118 : 123;
    return { x1: C.x + Math.cos(a) * r0, y1: C.y + Math.sin(a) * r0, x2: C.x + Math.cos(a) * 130, y2: C.y + Math.sin(a) * 130, major: i % 5 === 0 };
  });
  const blips = [[262, 118], [148, 214], [286, 208], [136, 112], [214, 252]];
  return (
    <svg className="em" viewBox="0 0 400 330" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="em-radar-grad" gradientUnits="userSpaceOnUse" x1="320" y1="165" x2="277" y2="73">
          <stop offset="0" stopColor="var(--a3)" stopOpacity="0.75" />
          <stop offset="1" stopColor="var(--a3)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((t, i) => (
        <line key={i} className={t.major ? "s1" : "sf"} strokeWidth={t.major ? 2.5 : 1} opacity={t.major ? 1 : 0.5} x1={f1(t.x1)} y1={f1(t.y1)} x2={f1(t.x2)} y2={f1(t.y2)} />
      ))}
      {[40, 80, 118].map((r) => (
        <circle key={r} className="s2" cx={C.x} cy={C.y} r={r} strokeWidth="1.8" opacity={r === 118 ? 1 : 0.65} />
      ))}
      <path className="sl" strokeWidth="1.5" d="M200 47V283M82 165H318" />
      <g className="em-radar">
        <path d="M200 165L277 73A120 120 0 0 1 320 165Z" fill="url(#em-radar-grad)" />
        <line className="s3" strokeWidth="3" x1="200" y1="165" x2="320" y2="165" />
      </g>
      {blips.map(([x, y], i) => (
        <circle key={i} className="f1 em-ping" cx={x} cy={y} r="5" style={{ animationDelay: `${i * 0.8}s` }} />
      ))}
      <circle className="f2" cx={C.x} cy={C.y} r="5" />
    </svg>
  );
}

/* L: fingerprint scan */
export function Fingerprint() {
  const r = rng(5);
  const ridges = Array.from({ length: 17 }, (_, i) => {
    const rad = 9 + i * 6.6;
    const rx = rad * 0.9;
    const ry = rad * 1.12;
    const circ = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
    const dash = Math.max(18, circ * (0.55 + r() * 0.3));
    return { rx, ry, dash, gap: circ - dash + 6, off: r() * circ, hot: i % 5 === 0 };
  });
  return (
    <svg className="em" viewBox="0 0 400 330" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="em-fp-clip">
          <ellipse cx="200" cy="168" rx="122" ry="146" />
        </clipPath>
      </defs>
      <g clipPath="url(#em-fp-clip)">
        {ridges.map((g, i) => (
          <ellipse
            key={i}
            className={g.hot ? "s1" : "s2"}
            cx="200"
            cy="170"
            rx={f1(g.rx)}
            ry={f1(g.ry)}
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeDasharray={`${f1(g.dash)} ${f1(g.gap)}`}
            strokeDashoffset={f1(g.off)}
          />
        ))}
        <g className="em-scan">
          <rect className="f3" x="70" y="22" width="260" height="6" opacity="0.9" />
          <rect className="f3" x="70" y="2" width="260" height="20" opacity="0.18" />
        </g>
      </g>
      <path className="s1" strokeWidth="3" d="M64 28H92M64 28V56M336 28H308M336 28V56M64 308H92M64 308V280M336 308H308M336 308V280" />
    </svg>
  );
}

/* M: a chip die with traces fanning out */
export function Circuit() {
  const colors = ["s1", "s2", "s3"];
  const pins = [-2, -1, 0, 1, 2];
  return (
    <svg className="em" viewBox="0 0 400 330" aria-hidden="true" focusable="false">
      <g transform="translate(200 165) scale(1.14) translate(-200 -165)">
      {[0, 90, 180, 270].map((rot, side) => (
        <g key={rot} transform={`rotate(${rot} 200 165)`}>
          {pins.map((j, n) => {
            const x = 200 + j * 14;
            const x2 = 200 + j * 28;
            const cls = colors[(n + side) % 3];
            return (
              <g key={j}>
                <path className={`${cls} em-flow`} strokeWidth="2.4" strokeLinejoin="round" d={`M${x} 124V104L${x2} 84V${46 - (n % 2) * 8}`} />
                <circle className={`f${((n + side) % 3) + 1}`} cx={x2} cy={46 - (n % 2) * 8} r="5" />
              </g>
            );
          })}
        </g>
      ))}
      <rect x="160" y="125" width="80" height="80" rx="6" className="fb" stroke="var(--a1)" strokeWidth="3.5" />
      <rect x="172" y="137" width="56" height="56" className="sl" strokeWidth="1.5" />
      <rect className="f1" x="186" y="151" width="28" height="28" />
      <rect className="fb" x="194" y="159" width="12" height="12" />
      <rect className="f3 em-blink" x="165" y="130" width="7" height="7" />
      </g>
    </svg>
  );
}

/* N: hex cluster with a few cells blinking */
export function HexCluster() {
  const size = 30;
  const cells: { x: number; y: number; ring: number; i: number }[] = [];
  let idx = 0;
  for (let q = -2; q <= 2; q++)
    for (let rr = -2; rr <= 2; rr++) {
      if (Math.abs(q + rr) > 2) continue;
      cells.push({
        x: C.x + size * Math.sqrt(3) * (q + rr / 2),
        y: C.y + size * 1.5 * rr,
        ring: Math.max(Math.abs(q), Math.abs(rr), Math.abs(q + rr)),
        i: idx++,
      });
    }
  const hex = (x: number, y: number, s: number) =>
    Array.from({ length: 6 }, (_, k) => {
      const a = ((60 * k - 30) * Math.PI) / 180;
      return `${f1(x + Math.cos(a) * s)},${f1(y + Math.sin(a) * s)}`;
    }).join(" ");
  return (
    <svg className="em" viewBox="0 0 400 330" aria-hidden="true" focusable="false">
      {cells.map((c) => {
        const filled = c.ring === 0 || (c.ring === 1 && c.i % 2 === 0) || (c.ring === 2 && c.i % 5 === 0);
        const cls = c.ring === 0 ? "f1" : c.ring === 1 ? (c.i % 4 === 0 ? "f2" : "f3") : "f2";
        const blink = c.i % 7 === 3;
        return (
          <polygon
            key={c.i}
            points={hex(c.x, c.y, size - 3)}
            className={filled ? `${cls}${blink ? " em-blink" : ""}` : `sl${blink ? " em-blink" : ""}`}
            opacity={filled ? (c.ring === 2 ? 0.8 : 1) : 1}
            stroke={filled ? "none" : "var(--fg)"}
            strokeWidth="2"
            fill={filled ? undefined : "none"}
            style={blink ? { animationDelay: `${c.i * 0.23}s` } : undefined}
          />
        );
      })}
      <polygon points={hex(C.x, C.y, 142)} className="s3" strokeWidth="2.5" strokeDasharray="14 10" />
    </svg>
  );
}

/* O: a faction-style sigil made of the same flat shapes as the hero */
export function Sigil() {
  return (
    <svg className="em" viewBox="0 0 400 330" aria-hidden="true" focusable="false">
      <circle className="s2" cx={C.x} cy={C.y} r="116" strokeWidth="11" />
      <circle className="sl" cx={C.x} cy={C.y} r="98" strokeWidth="1.5" />
      <polygon className="f1" points="200,62 292,226 108,226" />
      <polygon className="fb" points="200,106 258,208 142,208" />
      <circle className="f3" cx={C.x} cy="178" r="30" />
      <path className="f2" d="M72 165A128 128 0 0 1 90 100L150 140A60 60 0 0 0 140 165Z" opacity="0.9" />
      <rect className="f2" x="110" y="238" width="180" height="9" />
      <rect className="f1" x="176" y="254" width="48" height="9" />
      <path className="sf" strokeWidth="2" d="M200 24V40M200 290V306M44 165H60M340 165H356" />
    </svg>
  );
}

/* P: audio spectrum, a nod to the visualizer project */
export function Spectrum() {
  const n = 22;
  const bars = Array.from({ length: n }, (_, i) => {
    const h = 34 + Math.abs(Math.sin(i * 0.52 + 0.4)) * 96 + (i % 4) * 6;
    return { x: 46 + i * 14.2, h, c: i < n / 3 ? "f1" : i < (2 * n) / 3 ? "f2" : "f3", d: 0.7 + ((i * 37) % 11) / 10 };
  });
  const base = 196;
  return (
    <svg className="em" viewBox="0 0 400 330" aria-hidden="true" focusable="false">
      <g>
        {bars.map((b, i) => (
          <rect key={i} className={`${b.c} em-bar`} x={f1(b.x)} y={f1(base - b.h)} width="9" height={f1(b.h)} style={{ animationDuration: `${b.d}s`, animationDelay: `${-i * 0.11}s` }} />
        ))}
      </g>
      <g transform={`translate(0 ${base * 2 + 8}) scale(1 -1)`} opacity="0.22">
        {bars.map((b, i) => (
          <rect key={i} className={`${b.c} em-bar`} x={f1(b.x)} y={f1(base - b.h * 0.6)} width="9" height={f1(b.h * 0.6)} style={{ animationDuration: `${b.d}s`, animationDelay: `${-i * 0.11}s` }} />
        ))}
      </g>
      <rect className="ff" x="40" y={base + 2} width="320" height="3" opacity="0.85" />
      <path className="sl" strokeWidth="1.5" d="M40 58H360" />
      <rect className="f1 em-blink" x="40" y="40" width="10" height="10" />
    </svg>
  );
}

/* Q: orb and web, a straight-lined nod to Orbweaver */
export function OrbWeb() {
  const hexPts = (r: number) =>
    Array.from({ length: 6 }, (_, k) => {
      const a = ((60 * k - 90) * Math.PI) / 180;
      return [C.x + Math.cos(a) * r, C.y + Math.sin(a) * r] as const;
    });
  const rings = [46, 88, 130];
  return (
    <svg className="em" viewBox="0 0 400 330" aria-hidden="true" focusable="false">
      <polygon className="sl" strokeWidth="1.5" strokeDasharray="3 7" points={hexPts(152).map((p) => p.join(",")).join(" ")} />
      {hexPts(142).map(([x, y], i) => (
        <line key={i} className="s2" strokeWidth="2.2" x1={C.x} y1={C.y} x2={f1(x)} y2={f1(y)} />
      ))}
      {rings.map((r, i) => (
        <polygon key={r} className={i === 1 ? "s3" : "s2"} strokeWidth={i === 1 ? 3 : 2} points={hexPts(r).map((p) => p.map(f1).join(",")).join(" ")} />
      ))}
      {hexPts(130).map(([x, y], i) => (
        <circle key={i} className="f3" cx={f1(x)} cy={f1(y)} r="5.5" />
      ))}
      <circle className="s1 em-blink" cx={C.x} cy={C.y} r="32" strokeWidth="2" />
      <circle className="f1" cx={C.x} cy={C.y} r="18" />
    </svg>
  );
}
