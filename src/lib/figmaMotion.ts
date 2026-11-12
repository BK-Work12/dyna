/**
 * Plays Figma manualKeyframeTracks / TextStagger data with the Web Animations API.
 *
 * Figma data shape (from node.manualKeyframeTracks, via use_figma):
 *   { OPACITY: { keyframes: [{ timelinePosition: sec, value: {type:'FLOAT',value:n}, easing:{type, easingFunctionCubicBezier:{x1,y1,x2,y2}} }] }, ... }
 * Compact form used in code (Kf): { t: seconds, v: number | {x,y}, e?: [x1,y1,x2,y2] }  (e omitted = linear)
 *
 * Conventions:
 *  - A keyframe's easing is the curve used to ARRIVE at that keyframe (segment prev -> this).
 *  - Values before the first / after the last keyframe are held (fill: both).
 *  - TRANSLATION_X/Y in px, SCALE_* as multipliers, ROTATION in degrees, counter-clockwise positive in Figma
 *    (so CSS rotate is negated). Uses the individual CSS properties translate / rotate / scale so the element's
 *    own static `transform` is never overwritten.
 */

export type Bezier = [number, number, number, number];
export type Kf = { t: number; v: number | { x: number; y: number }; e?: Bezier };
export type TrackName =
  | "OPACITY"
  | "TRANSLATION_X"
  | "TRANSLATION_Y"
  | "ROTATION"
  | "SCALE_X"
  | "SCALE_Y"
  | "SCALE_XY"
  | "WIDTH"
  | "HEIGHT";
export type Tracks = Partial<Record<TrackName, Kf[]>>;

export const EASE = {
  linear: [0, 0, 1, 1] as Bezier,
  out: [0, 0, 0.58, 1] as Bezier, // Figma EASE_OUT
  in: [0.42, 0, 1, 1] as Bezier,
  inOut: [0.42, 0, 0.58, 1] as Bezier,
  dyna: [0.2, 0, 0, 1] as Bezier,
};

const bez = (b?: Bezier) => (b ? `cubic-bezier(${b.join(",")})` : "linear");

/** Solve a CSS cubic-bezier(x1,y1,x2,y2) at progress x in [0,1]. */
function solveBezier(b: Bezier | undefined, x: number): number {
  if (!b || (b[0] === 0 && b[1] === 0 && b[2] === 1 && b[3] === 1)) return x;
  const [x1, y1, x2, y2] = b;
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  let t = x;
  for (let i = 0; i < 8; i++) {
    const fx = ((ax * t + bx) * t + cx) * t - x;
    const dx = (3 * ax * t + 2 * bx) * t + cx;
    if (Math.abs(fx) < 1e-6 || Math.abs(dx) < 1e-6) break;
    t -= fx / dx;
  }
  t = Math.min(1, Math.max(0, t));
  return ((ay * t + by) * t + cy) * t;
}

function valueAt(kfs: Kf[], t: number): number | { x: number; y: number } {
  if (t <= kfs[0].t) return kfs[0].v;
  const last = kfs[kfs.length - 1];
  if (t >= last.t) return last.v;
  for (let i = 0; i < kfs.length - 1; i++) {
    const a = kfs[i];
    const b = kfs[i + 1];
    if (t >= a.t && t <= b.t) {
      // each track uses the easing of the keyframe it arrives at (own curve per property)
      const k = solveBezier(b.e, (t - a.t) / (b.t - a.t || 1));
      if (typeof a.v === "number" && typeof b.v === "number") return a.v + (b.v - a.v) * k;
      const av = a.v as { x: number; y: number };
      const bv = b.v as { x: number; y: number };
      return { x: av.x + (bv.x - av.x) * k, y: av.y + (bv.y - av.y) * k };
    }
  }
  return last.v;
}

/** Build WAAPI keyframes from tracks over a timeline of `timeline` seconds. */
export function buildKeyframes(tracks: Tracks, timeline: number): Keyframe[] {
  const times = new Set<number>();
  for (const kfs of Object.values(tracks)) {
    const list = kfs ?? [];
    list.forEach((k, i) => {
      times.add(k.t);
      // eased segments are sampled so every property keeps its own curve inside one animation
      const prev = list[i - 1];
      const e = k.e;
      if (prev && e && !(e[0] === 0 && e[1] === 0 && e[2] === 1 && e[3] === 1)) {
        for (let n = 1; n < 16; n++) times.add(prev.t + ((k.t - prev.t) * n) / 16);
      }
    });
  }
  const sorted = [...times].sort((a, b) => a - b);
  if (sorted[0] > 0) sorted.unshift(0);
  if (sorted[sorted.length - 1] < timeline) sorted.push(timeline);

  return sorted.map((t, i) => {
    const f: Keyframe = { offset: Math.min(1, Math.max(0, t / timeline)) };
    let tx = 0, ty = 0, hasT = false;
    for (const [name, kfs] of Object.entries(tracks) as [TrackName, Kf[]][]) {
      if (!kfs?.length) continue;
      const v = valueAt(kfs, t);
      switch (name) {
        case "OPACITY": f.opacity = v as number; break;
        case "TRANSLATION_X": tx = v as number; hasT = true; break;
        case "TRANSLATION_Y": ty = v as number; hasT = true; break;
        case "ROTATION": f.rotate = `${-(v as number)}deg`; break;
        case "SCALE_X": f.scale = `${v} ${(valueAt(tracks.SCALE_Y ?? [{ t: 0, v: 1 }], t) as number)}`; break;
        case "SCALE_Y": if (!tracks.SCALE_X) f.scale = `1 ${v}`; break;
        case "SCALE_XY": { const s = v as { x: number; y: number }; f.scale = `${s.x} ${s.y}`; break; }
        case "WIDTH": f.width = `${v}px`; break;
        case "HEIGHT": f.height = `${v}px`; break;
      }
    }
    if (hasT) f.translate = `${tx}px ${ty}px`;
    f.easing = "linear"; // curves are already baked into the sampled keyframes
    void i;
    return f;
  });
}

export type PlayOpts = {
  /** timeline length in seconds (Figma frame timeline, e.g. 12 for Home) */
  timeline: number;
  loop?: boolean;
  /** extra delay in seconds before the timeline starts */
  delay?: number;
  /** stop at the end state instead of reverting (non-looping) */
  hold?: boolean;
};

export function playTracks(el: Element, tracks: Tracks, o: PlayOpts): Animation | null {
  if (typeof (el as HTMLElement).animate !== "function") return null;
  if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return null;
  return (el as HTMLElement).animate(buildKeyframes(tracks, o.timeline), {
    duration: o.timeline * 1000,
    delay: (o.delay ?? 0) * 1000,
    iterations: o.loop ? Infinity : 1,
    fill: "both",
    easing: "linear",
  });
}

/* ---------- Figma TextStagger preset ---------- */
export type StaggerProps = {
  /** total span of the stagger in seconds (Figma `duration`) */
  duration: number;
  distance?: number; // px
  direction?: "bottom" | "top" | "left" | "right";
  blur?: number; // px, 0 = none
  overlap?: number; // 0-100 (presetStaggerOverlap)
  ease?: Bezier;
  delay?: number; // seconds
  from?: "in" | "out";
};

/** Staggers already-split groups (lines/words/chars) in: opacity 0 + offset + blur -> rest. */
export function staggerIn(els: Element[], p: StaggerProps): Animation[] {
  if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return [];
  const n = els.length || 1;
  const overlap = (p.overlap ?? 50) / 100;
  // each item runs for `each` seconds; consecutive starts are shifted by each*(1-overlap); total = duration
  const each = p.duration / (1 + (n - 1) * (1 - overlap));
  const step = each * (1 - overlap);
  const d = p.distance ?? 32;
  const off = { bottom: `0px ${d}px`, top: `0px ${-d}px`, left: `${-d}px 0px`, right: `${d}px 0px` }[p.direction ?? "bottom"];
  return els.map((el, i) =>
    (el as HTMLElement).animate(
      [
        { opacity: 0, translate: off, filter: p.blur ? `blur(${p.blur}px)` : "none" },
        { opacity: 1, translate: "0px 0px", filter: "blur(0px)" },
      ],
      {
        duration: each * 1000,
        delay: ((p.delay ?? 0) + i * step) * 1000,
        easing: bez(p.ease ?? EASE.out),
        fill: "both",
      },
    ),
  );
}
