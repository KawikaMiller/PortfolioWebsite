// A deterministic barcode, used as graphic texture (serial-number plates). Decorative: it encodes nothing.
function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function Barcode({ seed = 7, className = "" }: { seed?: number; className?: string }) {
  const r = rng(seed);
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  while (x < 196) {
    const w = 1 + Math.floor(r() * 4);
    bars.push({ x, w });
    x += w + 1 + Math.floor(r() * 3);
  }
  return (
    <svg
      className={`barcode ${className}`}
      viewBox="0 0 200 30"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y="0" width={b.w} height="30" fill="currentColor" />
      ))}
    </svg>
  );
}
