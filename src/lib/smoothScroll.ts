/** Figma SCROLL_ANIMATE: 0.7s EASE_IN_AND_OUT = cubic-bezier(.42,0,.58,1). */
function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const e = sx(t) - x;
      if (Math.abs(e) < 1e-5) break;
      const d = dx(t);
      if (Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    return sy(t);
  };
}

const easeInOut = bezier(0.42, 0, 0.58, 1);

export function smoothScrollTo(y: number, ms = 700) {
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (reduce || ms <= 0) {
    window.scrollTo(0, y);
    return;
  }
  const from = window.scrollY;
  const start = performance.now();
  const tick = (now: number) => {
    const k = Math.min(1, (now - start) / ms);
    window.scrollTo(0, from + (y - from) * easeInOut(k));
    if (k < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function smoothScrollToSelector(selector: string, ms = 700) {
  const el = document.querySelector(selector) as HTMLElement | null;
  if (!el) return false;
  smoothScrollTo(el.getBoundingClientRect().top + window.scrollY, ms);
  return true;
}
