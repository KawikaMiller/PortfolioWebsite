// Hero badge art: a default-avatar silhouette on a chip die. The die and its traces stay from the
// earlier fingerprint badge; the silhouette is filled with scanline ridges and swept by a scan bar,
// like a profile slot waiting for a face.
const stroke = ["art-s1", "art-s2", "art-s3"];
const fill = ["art-f1", "art-f2", "art-f3"];
const sideY = [92, 122, 152, 182, 212, 242];
const topX = [132, 166, 200, 234, 268];

const HEAD = { cx: 200, cy: 118, r: 52 };
const BODY = "M102 278C102 208 146 184 200 184C254 184 298 208 298 278Z";
const lines = Array.from({ length: 28 }, (_, i) => 70 + i * 7.6);

export default function ProfileDie() {
  return (
    <svg className="art" viewBox="0 0 400 330" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="art-avatar-clip">
          <circle cx={HEAD.cx} cy={HEAD.cy} r={HEAD.r} />
          <path d={BODY} />
        </clipPath>
      </defs>

      {/* traces behind the die: left and right fan out with a 45-degree jog, top and bottom run short */}
      {sideY.map((y, i) => {
        const jog = i % 2 === 0 ? -14 : 14;
        return (
          <g key={y}>
            <path className={`${stroke[i % 3]} art-flow`} strokeWidth="2.4" strokeLinejoin="round" d={`M78 ${y}H60L44 ${y + jog}H16`} />
            <circle className={fill[i % 3]} cx="16" cy={y + jog} r="5" />
            <path className={`${stroke[(i + 1) % 3]} art-flow`} strokeWidth="2.4" strokeLinejoin="round" d={`M322 ${y}H340L356 ${y - jog}H384`} />
            <circle className={fill[(i + 1) % 3]} cx="384" cy={y - jog} r="5" />
          </g>
        );
      })}
      {topX.map((x, i) => (
        <g key={x}>
          <path className={`${stroke[i % 3]} art-flow`} strokeWidth="2.4" d={`M${x} 40V24`} />
          <circle className={fill[i % 3]} cx={x} cy="16" r="4.5" />
          <path className={`${stroke[(i + 2) % 3]} art-flow`} strokeWidth="2.4" d={`M${x} 290V306`} />
          <circle className={fill[(i + 2) % 3]} cx={x} cy="314" r="4.5" />
        </g>
      ))}

      {/* the die */}
      <rect x="78" y="40" width="244" height="250" rx="8" className="art-fb" stroke="var(--a1)" strokeWidth="3.5" />
      <rect x="90" y="52" width="220" height="226" rx="3" className="art-sl" strokeWidth="1.5" />
      <rect className="art-f3 art-blink" x="84" y="46" width="8" height="8" />

      {/* the silhouette: scanline fill, bright outline, sweeping scan bar */}
      <g clipPath="url(#art-avatar-clip)">
        {lines.map((y, i) => (
          <rect key={y} x="100" y={y} width="200" height="3.2" className={i % 4 === 0 ? "art-f1" : "art-f2"} opacity={i % 4 === 0 ? 0.95 : 0.7} />
        ))}
        <g className="art-scan">
          <rect className="art-f3" x="96" y="56" width="208" height="5" opacity="0.95" />
          <rect className="art-f3" x="96" y="38" width="208" height="18" opacity="0.3" />
        </g>
      </g>
      <circle cx={HEAD.cx} cy={HEAD.cy} r={HEAD.r} className="art-s1" strokeWidth="3" />
      <path d={BODY} className="art-s1" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}
