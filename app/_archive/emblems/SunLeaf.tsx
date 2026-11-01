// Solarpunk emblem for the hero billboard: a radiant sun over a cluster of leaves. Decorative.
const leaf = "M0 0 C 26 -34 78 -34 104 0 C 78 34 26 34 0 0 Z";

export default function SunLeaf({ className = "" }: { className?: string }) {
  const rays = Array.from({ length: 20 }, (_, i) => {
    const a = (i / 20) * Math.PI * 2;
    const r0 = 74;
    const r1 = i % 2 === 0 ? 112 : 96;
    return {
      x1: 200 + Math.cos(a) * r0,
      y1: 168 + Math.sin(a) * r0,
      x2: 200 + Math.cos(a) * r1,
      y2: 168 + Math.sin(a) * r1,
    };
  });
  const leaves = [
    { r: -118, s: 1.0 },
    { r: -92, s: 1.15 },
    { r: -62, s: 1.0 },
    { r: -30, s: 0.85 },
    { r: -150, s: 0.8 },
  ];
  return (
    <svg className={`sunleaf ${className}`} viewBox="0 0 400 330" aria-hidden="true" focusable="false">
      <g className="sl-rays">
        {rays.map((r, i) => (
          <line key={i} x1={r.x1.toFixed(1)} y1={r.y1.toFixed(1)} x2={r.x2.toFixed(1)} y2={r.y2.toFixed(1)} />
        ))}
      </g>
      <circle className="sl-sun-fill" cx="200" cy="168" r="58" />
      <circle className="sl-sun" cx="200" cy="168" r="58" />
      <circle className="sl-sun-in" cx="200" cy="168" r="42" />
      <g transform="translate(200 318)">
        {leaves.map((l, i) => (
          <g key={i} transform={`rotate(${l.r}) scale(${l.s})`}>
            <g className="sl-leaf" style={{ animationDelay: `${i * -1.3}s` }}>
              <path d={leaf} />
              <path className="rib" d="M6 0 L98 0" />
            </g>
          </g>
        ))}
        <circle className="sl-seed" r="5" />
      </g>
    </svg>
  );
}
