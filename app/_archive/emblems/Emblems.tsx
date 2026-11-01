// Seven candidate emblems for the hero ID plate. Scratch work for choosing a replacement.
const C = { x: 200, y: 165 };

export function Reticle() {
  const ticks = Array.from({ length: 72 }, (_, i) => {
    const a = (i * 5 * Math.PI) / 180;
    const major = i % 6 === 0;
    const mid = i % 3 === 0;
    const r0 = major ? 104 : mid ? 112 : 118;
    const r1 = 128;
    return { major, x1: C.x + Math.cos(a) * r0, y1: C.y + Math.sin(a) * r0, x2: C.x + Math.cos(a) * r1, y2: C.y + Math.sin(a) * r1 };
  });
  return (
    <svg className="em" viewBox="0 0 400 330" aria-hidden="true" focusable="false">
      <g className="em-spin">
        {ticks.map((t, i) => (
          <line key={i} className={t.major ? "s1" : "sf"} strokeWidth={t.major ? 3 : 1.5} opacity={t.major ? 1 : 0.55} x1={t.x1.toFixed(1)} y1={t.y1.toFixed(1)} x2={t.x2.toFixed(1)} y2={t.y2.toFixed(1)} />
        ))}
      </g>
      <circle className="s2" cx={C.x} cy={C.y} r="96" strokeWidth="2" />
      <g className="em-rev">
        <circle className="s3" cx={C.x} cy={C.y} r="80" strokeWidth="7" strokeDasharray="46 18 8 18" />
      </g>
      <circle className="sl" cx={C.x} cy={C.y} r="58" strokeWidth="1.5" />
      <path className="s1" strokeWidth="3" d="M200 22V66M200 264V308M57 165H101M299 165H343" />
      <circle className="s1" cx={C.x} cy={C.y} r="22" strokeWidth="2" />
      <circle className="f1" cx={C.x} cy={C.y} r="7" />
    </svg>
  );
}

export function Topology() {
  return (
    <svg className="em" viewBox="0 0 400 330" aria-hidden="true" focusable="false">
      <g className="s2" strokeWidth="2">
        <path className="em-flow" d="M170 150H70V76" />
        <path className="em-flow" d="M230 150H330V92" />
        <path className="em-flow" d="M170 180H70V254" />
        <path className="em-flow" d="M230 180H330V250" />
        <path className="em-flow" d="M200 135V44" />
        <path className="em-flow" d="M200 195V286" />
      </g>
      <path className="sl" strokeWidth="1.5" d="M86 60H316M86 270H316" />
      <circle className="f2" cx="70" cy="60" r="16" />
      <rect className="f3" x="316" y="60" width="28" height="28" transform="translate(-0 0)" />
      <rect className="f3" x="56" y="254" width="28" height="28" />
      <circle className="f2" cx="330" cy="268" r="16" />
      <rect className="f1" x="188" y="20" width="24" height="24" />
      <circle className="f1" cx="200" cy="298" r="12" />
      <rect className="f1" x="170" y="135" width="60" height="60" />
      <rect className="fb" x="184" y="149" width="32" height="32" />
      <rect className="f3 em-blink" x="194" y="159" width="12" height="12" />
    </svg>
  );
}

export function Shield() {
  const S = "M200 36L314 78V168C314 234 262 274 200 298C138 274 86 234 86 168V78Z";
  return (
    <svg className="em" viewBox="0 0 400 330" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="em-shield-clip">
          <path d={S} />
        </clipPath>
      </defs>
      <path d={S} className="f1" opacity="0.16" />
      <g clipPath="url(#em-shield-clip)">
        <g transform="skewX(-22)">
          <rect className="f2" x="215" y="0" width="26" height="330" opacity="0.55" />
          <rect className="f3" x="255" y="0" width="26" height="330" opacity="0.55" />
          <rect className="f1" x="295" y="0" width="26" height="330" opacity="0.55" />
        </g>
      </g>
      <path d={S} className="s1" strokeWidth="5" />
      <g transform="translate(200 167) scale(0.86) translate(-200 -167)">
        <path d={S} className="s2" strokeWidth="2" />
      </g>
      <circle className="f3" cx="200" cy="148" r="26" />
      <path className="f3" d="M186 166H214L224 222H176Z" />
      <circle className="fb" cx="200" cy="148" r="10" />
    </svg>
  );
}

export function Planet() {
  return (
    <svg className="em" viewBox="0 0 400 330" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="em-dots" width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="4.5" cy="4.5" r="2.7" className="f1" />
        </pattern>
        <pattern id="em-dots2" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="1.1" className="f1" />
        </pattern>
        <linearGradient id="em-fade" x1="0.1" y1="0" x2="0.95" y2="0.9">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.55" stopColor="#888" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <mask id="em-lit">
          <circle cx={C.x} cy={C.y} r="98" fill="url(#em-fade)" />
        </mask>
      </defs>
      <g transform="rotate(-18 200 165)">
        <ellipse className="s2" cx={C.x} cy={C.y} rx="168" ry="42" strokeWidth="2" />
        <ellipse className="sl" cx={C.x} cy={C.y} rx="148" ry="34" strokeWidth="1" strokeDasharray="3 6" />
        <circle className="f3" cx="368" cy="165" r="9" />
      </g>
      <circle className="s1" cx={C.x} cy={C.y} r="98" strokeWidth="3.5" />
      <g mask="url(#em-lit)">
        <rect x="100" y="65" width="200" height="200" fill="url(#em-dots)" />
        <rect x="100" y="65" width="200" height="200" fill="url(#em-dots2)" opacity="0.7" />
      </g>
      <path className="s3" strokeWidth="3" d="M118 205H282" />
      <path className="sl" strokeWidth="1.5" d="M60 40V290M52 40H68M52 165H68M52 290H68" />
    </svg>
  );
}

export function Monogram() {
  return (
    <svg className="em" viewBox="0 0 400 330" aria-hidden="true" focusable="false">
      <circle className="s1" cx={C.x} cy={C.y} r="122" strokeWidth="9" />
      <circle className="sl" cx={C.x} cy={C.y} r="106" strokeWidth="1.5" />
      <path className="sf" strokeWidth="2" d="M200 28V46M200 284V302M62 165H80M320 165H338" />
      <g className="f2">
        <rect x="104" y="108" width="24" height="114" />
        <polygon points="128,158 170,108 200,108 154,164 204,222 172,222 128,172" />
      </g>
      <g className="f3">
        <polygon points="212,222 212,108 238,108 256,160 274,108 300,108 300,222 276,222 276,152 264,188 248,188 236,152 236,222" />
      </g>
      <rect className="f1" x="104" y="234" width="196" height="8" />
    </svg>
  );
}

export function Scope() {
  const pts: string[] = [];
  for (let x = 0; x <= 640; x += 4) {
    const t = (x / 160) * Math.PI * 2;
    const y = 165 + Math.sin(t) * 34 + Math.sin(t * 3) * 14 + (Math.sin(t * 5) > 0.92 ? -26 : 0);
    pts.push(`${x === 0 ? "M" : "L"}${x + 40} ${y.toFixed(1)}`);
  }
  const grid: string[] = [];
  for (let y = 60; y <= 270; y += 30) grid.push(`M40 ${y}H360`);
  for (let x = 40; x <= 360; x += 40) grid.push(`M${x} 60V270`);
  return (
    <svg className="em" viewBox="0 0 400 330" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="em-scope-clip">
          <rect x="40" y="60" width="320" height="210" />
        </clipPath>
      </defs>
      <path className="sl" strokeWidth="1" opacity="0.7" d={grid.join("")} />
      <rect className="s2" x="40" y="60" width="320" height="210" strokeWidth="2.5" />
      <g clipPath="url(#em-scope-clip)">
        <g className="em-wave">
          <path className="s3" strokeWidth="3" strokeLinejoin="round" d={pts.join("")} />
        </g>
        <g className="em-sweep">
          <rect className="f1" x="40" y="60" width="3" height="210" opacity="0.85" />
        </g>
      </g>
      <path className="s1" strokeWidth="3" d="M40 40H80M360 40H320M40 292H80M360 292H320" />
      <rect className="f1 em-blink" x="40" y="22" width="10" height="10" />
    </svg>
  );
}
