/**
 * Page-motion utilities built on figmaMotion.ts (entrance on scroll-into-view, idle float, line-split text
 * stagger, footer logo reveal, 0.6s ease-in-out "back to top").
 */
import { EASE, playTracks, staggerIn, type Bezier, type StaggerProps, type TrackName, type Tracks } from "./figmaMotion";

export type Entrance = {
  /** entrance tracks at their ORIGINAL Figma timeline times (seconds) */
  tracks: Tracks;
  /** idle bob after the entrance: translateY 0 -> -amp -> 0, ease-in-out, `period` seconds, loops forever */
  float?: { amp: number; period: number; /** seconds to wait after the entrance ends */ delay?: number };
};

export const IN: Bezier = [0.5, 0, 0.5, 1]; // CUSTOM_CUBIC_BEZIER used on first keyframes
export const OUT: Bezier = [0.22, 1, 0.36, 1]; // used when arriving at the rest state
export const QUAD: Bezier = [0.25, 0.46, 0.45, 0.94];

/** opacity 0->1 + translateY(ty)->0 (+ optional scale s->1) between t0 and t1 */
export function rise(t0: number, t1: number, ty: number, out: Bezier = OUT, scale?: number): Tracks {
  const tr: Tracks = {
    OPACITY: [
      { t: t0, v: 0, e: IN },
      { t: t1, v: 1, e: out },
    ],
  };
  if (ty) tr.TRANSLATION_Y = [{ t: t0, v: ty, e: IN }, { t: t1, v: 0, e: out }];
  if (scale) tr.SCALE_XY = [{ t: t0, v: { x: scale, y: scale }, e: IN }, { t: t1, v: { x: 1, y: 1 }, e: out }];
  return tr;
}

const reduced = () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function bounds(tracks: Tracks) {
  let t0 = Infinity;
  let t1 = 0;
  for (const k of Object.values(tracks)) for (const f of k ?? []) { t0 = Math.min(t0, f.t); t1 = Math.max(t1, f.t); }
  return { t0, t1 };
}

export const entranceStart = (spec: Entrance) => bounds(spec.tracks).t0;

/** Plays the entrance (then the idle float). `delay` = seconds to wait before it starts. */
export function playEntrance(el: HTMLElement, spec: Entrance, delay: number) {
  if (reduced()) { el.style.opacity = "1"; return; }
  const { t0, t1 } = bounds(spec.tracks);
  const shifted: Tracks = {};
  for (const [k, v] of Object.entries(spec.tracks)) shifted[k as TrackName] = v!.map((f) => ({ ...f, t: f.t - t0 }));
  const a = playTracks(el, shifted, { timeline: Math.max(0.001, t1 - t0), delay });
  if (!a) { el.style.opacity = "1"; return; }
  const f = spec.float;
  if (f) {
    a.finished
      .then(() => {
        playTracks(
          el,
          { TRANSLATION_Y: [{ t: 0, v: 0 }, { t: f.period / 2, v: -f.amp, e: EASE.inOut }, { t: f.period, v: 0, e: EASE.inOut }] },
          { timeline: f.period, loop: true, delay: f.delay ?? 0 },
        );
      })
      .catch(() => {});
  }
}

/** Calls cb once when `el` scrolls into view. `initial` = it was already visible on load. */
export function onEnter(el: Element, cb: (initial: boolean) => void, rootMargin = "0px 0px -6% 0px") {
  const born = performance.now();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          io.disconnect();
          cb(performance.now() - born < 500);
          return;
        }
      }
    },
    { threshold: 0.12, rootMargin },
  );
  io.observe(el);
  return () => io.disconnect();
}

/** Splits an element's text into one block per visual line (for TextStagger grouping LINE). */
export function splitLines(el: HTMLElement): HTMLElement[] {
  if (el.dataset.split) return Array.from(el.children) as HTMLElement[];
  const words = (el.textContent ?? "").split(/\s+/).filter(Boolean);
  el.textContent = "";
  const spans = words.map((w, i) => {
    const s = document.createElement("span");
    s.textContent = w + (i < words.length - 1 ? " " : "");
    el.appendChild(s);
    return s;
  });
  const lines: string[][] = [];
  let top = -1;
  spans.forEach((s, i) => {
    if (s.offsetTop !== top) { lines.push([]); top = s.offsetTop; }
    lines[lines.length - 1].push(words[i]);
  });
  el.textContent = "";
  el.dataset.split = "1";
  return lines.map((ws) => {
    const d = document.createElement("div");
    d.style.whiteSpace = "nowrap";
    d.textContent = ws.join(" ");
    el.appendChild(d);
    return d;
  });
}

export function staggerLines(el: HTMLElement, p: StaggerProps) {
  const lines = splitLines(el);
  return staggerIn(lines, p);
}

/* ---- smooth scroll (0.6s ease-in-out) ---- */

function cubic(x1: number, y1: number, x2: number, y2: number) {
  const f = (t: number, a: number, b: number) => 3 * a * (1 - t) * (1 - t) * t + 3 * b * (1 - t) * t * t + t * t * t;
  return (x: number) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const dx = f(t, x1, x2) - x;
      const d = (f(t + 1e-4, x1, x2) - f(t, x1, x2)) / 1e-4;
      if (Math.abs(dx) < 1e-5 || !d) break;
      t -= dx / d;
    }
    return f(Math.min(1, Math.max(0, t)), y1, y2);
  };
}

export function smoothScrollTo(y: number, ms = 600) {
  if (reduced()) { window.scrollTo(0, y); return; }
  const from = window.scrollY;
  const ease = cubic(0.42, 0, 0.58, 1);
  const start = performance.now();
  const step = (now: number) => {
    const k = Math.min(1, (now - start) / ms);
    window.scrollTo(0, from + (y - from) * ease(k));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/** Footer "Back to top" = SCROLL_TO, 0.6s ease-in-out (the logo reveal lives in the shared FooterLogo). */
export function bindBackToTop(root: ParentNode): () => void {
  const footer = root.querySelector<HTMLElement>(".footer");
  if (!footer) return () => {};
  const top = (e: Event) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href="#top"]');
    if (!a) return;
    e.preventDefault();
    smoothScrollTo(0);
  };
  footer.addEventListener("click", top);
  return () => footer.removeEventListener("click", top);
}
