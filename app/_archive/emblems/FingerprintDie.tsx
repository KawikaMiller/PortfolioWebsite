import { type FingerprintOptions, ridges, toPath } from "./fingerprint";

// Hero badge art: a fingerprint pressed onto a chip. The die and its traces sit behind a procedurally
// generated loop-type print (see fingerprint.ts), with a scan bar sweeping across it.
const OPT: FingerprintOptions = {
  cx: 200,
  cy: 165,
  rx: 92,
  ry: 112,
  spacing: 7.2,
  core: [196, 142],
  delta: [238, 232],
  arch: 0.7,
  flip: true,
  base: -0.15,
};

// Generated once per build; the generator is deterministic.
let cache: string[] | undefined;
function paths() {
  cache ??= ridges(OPT).map((l) => toPath(l));
  return cache;
}

const stroke = ["art-s1", "art-s2", "art-s3"];
const fill = ["art-f1", "art-f2", "art-f3"];
const sideY = [92, 122, 152, 182, 212, 242];
const topX = [132, 166, 200, 234, 268];

export default function FingerprintDie() {
  return (
    <svg className="art" viewBox="0 0 400 330" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="art-print-clip">
          <ellipse cx={OPT.cx} cy={OPT.cy} rx={OPT.rx + 3} ry={OPT.ry + 3} />
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

      {/* the print */}
      <g clipPath="url(#art-print-clip)">
        {paths().map((p, i) => (
          <path key={i} d={p} className={i % 6 === 0 ? "art-s1" : "art-s2"} strokeWidth="3" strokeLinecap="round" />
        ))}
        <g className="art-scan">
          <rect className="art-f3" x="96" y="56" width="208" height="5" opacity="0.95" />
          <rect className="art-f3" x="96" y="38" width="208" height="18" opacity="0.2" />
        </g>
      </g>
    </svg>
  );
}
