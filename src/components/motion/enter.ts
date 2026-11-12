import type { Bezier, Tracks } from "@/lib/figmaMotion";

/** Figma easings used by the Services / Approach entrances. */
export const IN: Bezier = [0.5, 0, 0.5, 1];
export const OUT: Bezier = [0.22, 1, 0.36, 1];
export const EASE_OUT: Bezier = [0, 0, 0.58, 1];

const r = (n: number) => Math.round(n * 1000) / 1000;

/** Opacity 0→1 plus a translate from `from` px to 0 over [t0, t1] (the section-reveal pattern). */
export function enter(t0: number, t1: number, axis: "x" | "y", from: number, easeOut: Bezier = OUT): Tracks {
  const T = axis === "x" ? "TRANSLATION_X" : "TRANSLATION_Y";
  return {
    OPACITY: [
      { t: r(t0), v: 0, e: IN },
      { t: r(t1), v: 1, e: easeOut },
    ],
    [T]: [
      { t: r(t0), v: from, e: IN },
      { t: r(t1), v: 0, e: easeOut },
    ],
  };
}
