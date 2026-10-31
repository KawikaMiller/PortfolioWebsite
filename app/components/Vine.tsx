// A thin vine with leaves, used under section titles. Decorative.
export default function Vine() {
  const pts = Array.from({ length: 11 }, (_, i) => {
    const x = 12 + i * 34;
    const y = 18 + Math.sin(i * 0.9) * 6;
    return { x, y, up: i % 2 === 0 };
  });
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  return (
    <svg className="vine" viewBox="0 0 380 36" aria-hidden="true" focusable="false">
      <path className="vine-line" d={`${d}`} />
      {pts.slice(1, -1).map((p, i) => (
        <path
          key={i}
          className="vine-leaf"
          d={`M${p.x} ${p.y} q ${p.up ? "6 -12 16 -10" : "6 12 16 10"} q ${p.up ? "-4 10 -16 10" : "-4 -10 -16 -10"} z`}
        />
      ))}
    </svg>
  );
}
