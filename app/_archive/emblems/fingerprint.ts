// Procedural fingerprint ridges. Instead of concentric ovals, ridges are evenly spaced streamlines
// through an orientation field with one core (a loop) and one delta, which is how loop-type
// fingerprints are actually structured. Deterministic: no randomness, so output is stable.

export type Pt = [number, number];

export type FingerprintOptions = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  spacing: number;
  core: Pt;
  delta: Pt;
  arch: number; // background curvature of the ridges
  flip?: boolean; // reverse the winding (core and delta swap roles)
  base?: number; // rotate the whole field (radians)
};

export const DEFAULTS: FingerprintOptions = {
  cx: 200,
  cy: 165,
  rx: 98,
  ry: 120,
  spacing: 7.4,
  core: [208, 148],
  delta: [146, 238],
  arch: 0.55,
};

export function ridges(opt: FingerprintOptions = DEFAULTS): Pt[][] {
  const { cx, cy, rx, ry, spacing, core, delta, arch, flip = false, base = 0 } = opt;
  const dsep = spacing;
  const dtest = dsep * 0.62;
  const h = 1.7;

  const inMask = (x: number, y: number) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;

  // Ridge orientation: a half-turn around the core and the opposite around the delta (Sherlock-Monro),
  // plus a gentle global arch so the far field curves instead of running flat.
  const sgn = flip ? -1 : 1;
  const theta = (x: number, y: number) =>
    sgn * 0.5 * (Math.atan2(y - delta[1], x - delta[0]) - Math.atan2(y - core[1], x - core[0])) +
    base +
    arch * ((x - cx) / rx);

  // spatial hash of accepted points
  const cell = dsep;
  const grid = new Map<string, { x: number; y: number; line: number; i: number }[]>();
  const key = (x: number, y: number) => `${Math.floor(x / cell)},${Math.floor(y / cell)}`;
  const add = (x: number, y: number, line: number, i: number) => {
    const k = key(x, y);
    const a = grid.get(k);
    if (a) a.push({ x, y, line, i });
    else grid.set(k, [{ x, y, line, i }]);
  };
  const nearest = (x: number, y: number, selfLine = -1, selfI = 0) => {
    let best = Infinity;
    const gx = Math.floor(x / cell);
    const gy = Math.floor(y / cell);
    for (let a = -1; a <= 1; a++)
      for (let b = -1; b <= 1; b++) {
        const pts = grid.get(`${gx + a},${gy + b}`);
        if (!pts) continue;
        for (const p of pts) {
          if (p.line === selfLine && Math.abs(p.i - selfI) < 6) continue; // ignore the line's own recent tail
          const d = Math.hypot(p.x - x, p.y - y);
          if (d < best) best = d;
        }
      }
    return best;
  };

  const lines: Pt[][] = [];

  const dirAt = (x: number, y: number, ref: Pt | null): Pt => {
    const t = theta(x, y);
    let dx = Math.cos(t);
    let dy = Math.sin(t);
    if (ref && dx * ref[0] + dy * ref[1] < 0) {
      dx = -dx;
      dy = -dy;
    }
    return [dx, dy];
  };

  const nearSingular = (x: number, y: number) =>
    Math.hypot(x - core[0], y - core[1]) < 5 || Math.hypot(x - delta[0], y - delta[1]) < 5;

  const trace = (sx: number, sy: number, sign: 1 | -1, line: number, start: number): Pt[] => {
    const out: Pt[] = [];
    let x = sx;
    let y = sy;
    let ref: Pt | null = null;
    for (let step = 0; step < 520; step++) {
      let d = dirAt(x, y, ref ?? [sign, 0]);
      if (!ref) d = [d[0] * 1, d[1] * 1];
      if (!ref && step === 0) {
        // fix the starting direction so the two halves leave in opposite ways
        const t = theta(x, y);
        d = [Math.cos(t) * sign, Math.sin(t) * sign];
      }
      const mx = x + (d[0] * h) / 2;
      const my = y + (d[1] * h) / 2;
      const dm = dirAt(mx, my, d);
      const nx = x + dm[0] * h;
      const ny = y + dm[1] * h;
      if (!inMask(nx, ny) || nearSingular(nx, ny)) break;
      if (step > 3 && nearest(nx, ny, line, start + step * sign) < dtest) break;
      out.push([nx, ny]);
      ref = dm;
      x = nx;
      y = ny;
    }
    return out;
  };

  const accept = (sx: number, sy: number) => {
    const id = lines.length;
    // reserve the seed so the two halves don't collide with each other
    add(sx, sy, id, 0);
    const fwd = trace(sx, sy, 1, id, 0);
    fwd.forEach((p, i) => add(p[0], p[1], id, i + 1));
    const back = trace(sx, sy, -1, id, 0);
    back.forEach((p, i) => add(p[0], p[1], id, -(i + 1)));
    const line: Pt[] = [...back.reverse(), [sx, sy], ...fwd];
    if (line.length >= 6) lines.push(line);
    return line;
  };

  const queue: Pt[] = [[cx, cy]];
  let guard = 0;
  while (queue.length && guard++ < 4000) {
    const [sx, sy] = queue.shift() as Pt;
    if (!inMask(sx, sy) || nearest(sx, sy) < dsep * 0.97) continue;
    const line = accept(sx, sy);
    for (let i = 0; i < line.length; i += 4) {
      const [px, py] = line[i];
      const t = theta(px, py);
      const nxv = -Math.sin(t);
      const nyv = Math.cos(t);
      queue.push([px + nxv * dsep, py + nyv * dsep], [px - nxv * dsep, py - nyv * dsep]);
    }
  }

  // fill any gaps the queue left behind
  for (let y = cy - ry; y <= cy + ry; y += dsep * 0.5)
    for (let x = cx - rx; x <= cx + rx; x += dsep * 0.5) {
      if (!inMask(x, y) || nearSingular(x, y)) continue;
      if (nearest(x, y) >= dsep * 1.02) accept(x, y);
    }

  return lines;
}

// Smooth polyline -> SVG path using quadratic midpoints, thinned to keep the markup light.
export function toPath(line: Pt[], every = 3): string {
  const pts = line.filter((_, i) => i % every === 0 || i === line.length - 1);
  if (pts.length < 2) return "";
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2;
    const my = (pts[i][1] + pts[i + 1][1]) / 2;
    d += `Q${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  const last = pts[pts.length - 1];
  d += `L${last[0].toFixed(1)} ${last[1].toFixed(1)}`;
  return d;
}
