/**
 * Exact Figma tracks for "§ Process — Scroll Story (animated)" (691:49981), read via use_figma.
 * Timeline 0..4s; the four Scroll Bands are 225px each, so 1s === 225px of scroll.
 * Key = [timelinePosition(s), value, easing arriving at this key (0 = linear)].
 * Track values are DELTAS from each node's static pose (OPACITY is absolute).
 */
export type Bez = [number, number, number, number];
export type Key = [number, number, Bez | 0];
export type NodeTracks = Partial<Record<"OPACITY" | "TX" | "TY" | "ROT" | "SX" | "SY", Key[]>>;

const E1: Bez = [0.5, 0, 0.5, 1];
const E2: Bez = [0.22, 0.61, 0.36, 1];
const B: Bez = [0.45, 0, 0.2, 1];
const T: Bez = [0.6, 0, 0.4, 1];
const L1: Bez = [0.3, 0, 0.2, 1];
const L2: Bez = [0.4, 0, 0.2, 1];

export const TIMELINE = 4; // seconds
export const PX_PER_SECOND = 225;

export const processTracks: Record<string, NodeTracks> = {
  sheet3: {
    OPACITY: [[0, 0, E1], [3.25, 0, E1], [3.7, 1, E2]],
    TX: [[0, -40, E1], [3.25, -40, E1], [3.75, 0, E2]],
    TY: [[0, -16, E1], [3.25, -16, E1], [3.75, 0, E2]],
  },
  sheet2: {
    OPACITY: [[0, 0, E1], [2, 0, E1], [2.45, 1, E2]],
    TX: [[0, -40, E1], [2, -40, E1], [2.5, 0, E2]],
    TY: [[0, -16, E1], [2, -16, E1], [2.5, 0, E2]],
  },
  sheet1: {
    OPACITY: [[0, 0, E1], [0.75, 0, E1], [1.2, 1, E2]],
    TX: [[0, -40, E1], [0.75, -40, E1], [1.25, 0, E2]],
    TY: [[0, -16, E1], [0.75, -16, E1], [1.25, 0, E2]],
  },
  // Page 4 — Hand over and improve
  p4: {
    TX: [[0, 0, E1], [1.65, 0, E1], [2.35, 58.37, B], [2.9, 58.37, E1], [3.6, 32.081, B]],
    TY: [[0, 0, E1], [1.65, 0, E1], [2.35, -44.064, B], [2.9, -44.064, E1], [3.6, -35.74, B]],
    ROT: [[0, 0, E1], [1.65, 0, E1], [2.35, 8.5, B], [2.9, 8.5, E1], [3.6, 5, B]],
  },
  s4: { OPACITY: [[0, 0.2, E1], [1.65, 0.2, E1], [2.35, 0.14, B], [2.9, 0.14, E1], [3.6, 0, B]] },
  // Page 3 — Build with visibility
  p3: {
    OPACITY: [[0, 1, E1], [0.4, 1, E1], [1.65, 1, E1], [2.75, 1, E1], [3.27, 1, E1], [3.33, 0, 0]],
    TX: [[0, 0, E1], [0.4, 0, E1], [1.1, 58.37, B], [1.65, 58.37, E1], [2.35, 32.081, B], [2.75, 32.081, E1], [3.3, -217.519, T]],
    TY: [[0, 0, E1], [0.4, 0, E1], [1.1, -44.064, B], [1.65, -44.064, E1], [2.35, -35.74, B], [2.75, -35.74, E1], [3.05, -47.74, E2], [3.3, -39.74, T]],
    ROT: [[0, 0, E1], [0.4, 0, E1], [1.1, 8.5, B], [1.65, 8.5, E1], [2.35, 5, B], [2.75, 5, E1], [3.3, 6.5, T]],
    SX: [[0, 1, E1], [0.4, 1, E1], [1.65, 1, E1], [2.75, 1, E1], [3.3, 0.04, T]],
  },
  s3: { OPACITY: [[0, 0.2, E1], [0.4, 0.2, E1], [1.1, 0.14, B], [1.65, 0.14, E1], [2.35, 0, B], [2.75, 0, E1], [3.3, 0.75, T]] },
  // Page 2 — Test before committing
  p2: {
    OPACITY: [[0, 1, E1], [0.4, 1, E1], [1.5, 1, E1], [2.02, 1, E1], [2.08, 0, 0]],
    TX: [[0, 0, E1], [0.4, 0, E1], [1.1, -26.289, B], [1.5, -26.289, E1], [2.05, -275.889, T]],
    TY: [[0, 0, E1], [0.4, 0, E1], [1.1, 8.324, B], [1.5, 8.324, E1], [1.8, -3.676, E2], [2.05, 4.324, T]],
    ROT: [[0, 0, E1], [0.4, 0, E1], [1.1, -3.5, B], [1.5, -3.5, E1], [2.05, -2, T]],
    SX: [[0, 1, E1], [0.4, 1, E1], [1.5, 1, E1], [2.05, 0.04, T]],
  },
  s2: { OPACITY: [[0, 0.14, E1], [0.4, 0.14, E1], [1.1, 0, B], [1.5, 0, E1], [2.05, 0.75, T]] },
  // Page 1 — Understand the business
  p1: {
    OPACITY: [[0, 1, E1], [0.25, 1, E1], [0.77, 1, E1], [0.83, 0, 0]],
    TX: [[0, 0, E1], [0.25, 0, E1], [0.8, -249.6, T]],
    TY: [[0, 0, E1], [0.25, 0, E1], [0.55, -12, E2], [0.8, -4, T]],
    ROT: [[0, 0, E1], [0.25, 0, E1], [0.8, 1.5, T]],
    SX: [[0, 1, E1], [0.25, 1, E1], [0.8, 0.04, T]],
  },
  s1: { OPACITY: [[0, 0, E1], [0.25, 0, E1], [0.8, 0.75, T]] },
  line: {
    TY: [[0, 0, E1], [0.35, 0, E1], [0.75, 70, L1], [1.15, 140, L2], [1.6, 140, E1], [2, 210, L1], [2.4, 280, L2], [2.85, 280, E1], [3.25, 350, L1], [3.65, 420, L2]],
    SY: [[0, 1, E1], [0.35, 1, E1], [0.75, 2.346, L1], [1.15, 1, L2], [1.6, 1, E1], [2, 2.346, L1], [2.4, 1, L2], [2.85, 1, E1], [3.25, 2.346, L1], [3.65, 1, L2]],
  },
};

/** CSS cubic-bezier(x1,y1,x2,y2) evaluated at progress x in 0..1. */
function bezier(b: Bez, x: number): number {
  const [x1, y1, x2, y2] = b;
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (u: number) => ((ax * u + bx) * u + cx) * u;
  const sy = (u: number) => ((ay * u + by) * u + cy) * u;
  let u = x;
  for (let i = 0; i < 8; i++) {
    const err = sx(u) - x;
    if (Math.abs(err) < 1e-6) return sy(u);
    const d = (3 * ax * u + 2 * bx) * u + cx;
    if (Math.abs(d) < 1e-6) break;
    u -= err / d;
  }
  let lo = 0, hi = 1;
  u = x;
  for (let i = 0; i < 24; i++) {
    const v = sx(u);
    if (Math.abs(v - x) < 1e-6) break;
    if (v < x) lo = u; else hi = u;
    u = (lo + hi) / 2;
  }
  return sy(u);
}

export function sampleKeys(keys: Key[], t: number): number {
  if (t <= keys[0][0]) return keys[0][1];
  const last = keys[keys.length - 1];
  if (t >= last[0]) return last[1];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t >= a[0] && t <= b[0]) {
      const k = (t - a[0]) / (b[0] - a[0] || 1);
      const e = b[2] ? bezier(b[2], k) : k; // easing of the keyframe being arrived at
      return a[1] + (b[1] - a[1]) * e;
    }
  }
  return last[1];
}

export type NodeStyle = { opacity?: number; translate?: string; rotate?: string; scale?: string };

/** Style props for a node at time t. rotate is negated: Figma rotation is counter-clockwise positive. */
export function styleAt(id: string, t: number): NodeStyle {
  const tr = processTracks[id];
  const s: NodeStyle = {};
  if (!tr) return s;
  if (tr.OPACITY) s.opacity = sampleKeys(tr.OPACITY, t);
  if (tr.TX || tr.TY) s.translate = `${tr.TX ? sampleKeys(tr.TX, t) : 0}px ${tr.TY ? sampleKeys(tr.TY, t) : 0}px`;
  if (tr.ROT) s.rotate = `${-sampleKeys(tr.ROT, t)}deg`;
  if (tr.SX || tr.SY) s.scale = `${tr.SX ? sampleKeys(tr.SX, t) : 1} ${tr.SY ? sampleKeys(tr.SY, t) : 1}`;
  return s;
}

/**
 * Static pose -> CSS left/top for a 520x484 box that rotates about its centre.
 * (tx,ty) = Figma relativeTransform translation (top-left corner after rotation), deg = CSS clockwise degrees.
 */
export function restPose(tx: number, ty: number, deg: number, w = 520, h = 484) {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  const cx = tx + (w / 2) * c - (h / 2) * s;
  const cy = ty + (w / 2) * s + (h / 2) * c;
  return { left: cx - w / 2, top: cy - h / 2, transform: `rotate(${deg}deg)` };
}
