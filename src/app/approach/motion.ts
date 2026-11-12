import type { MotionMap } from "@/components/motion/MotionRoot";
import { EASE_OUT, IN, enter } from "@/components/motion/enter";

/*
 * Real Figma keyframes (frame 691:48719, 45.13s timeline).
 * Hero plays on load; each step plays when it scrolls into view.
 */
export const heroMotion: MotionMap = {
  h1: {
    OPACITY: [
      { t: 0.1, v: 0, e: IN },
      { t: 0.7, v: 1, e: EASE_OUT },
    ],
    TRANSLATION_Y: [
      { t: 0.12, v: 18, e: IN },
      { t: 0.67, v: 0, e: EASE_OUT },
    ],
    SCALE_X: [
      { t: 0.1, v: 0.97, e: IN },
      { t: 0.7, v: 1, e: EASE_OUT },
    ],
    SCALE_Y: [
      { t: 0.1, v: 0.97, e: IN },
      { t: 0.7, v: 1, e: EASE_OUT },
    ],
  },
  lead: {
    OPACITY: [
      { t: 0.18, v: 0, e: IN },
      { t: 0.58, v: 1, e: EASE_OUT },
    ],
    TRANSLATION_Y: [
      { t: 0.18, v: 12, e: IN },
      { t: 0.58, v: 0, e: EASE_OUT },
    ],
  },
  ctas: {
    OPACITY: [
      { t: 0.45, v: 0, e: IN },
      { t: 0.95, v: 1, e: EASE_OUT },
    ],
  },
};

/* Absolute Figma start times per step: [big number, [0n] label, title, body]; each runs 1.6s. */
const starts: [number, number, number, number][] = [
  [0.402, 0.4, 0.54, 0.68],
  [0.842, 0.84, 0.98, 1.12],
  [1.28, 1.28, 1.42, 1.56],
  [1.72, 1.72, 1.86, 2.0],
  [2.16, 2.16, 2.3, 2.44],
  [2.6, 2.6, 2.74, 2.88],
];
const DUR = 1.6;

export const stepMotion: MotionMap[] = starts.map(([big, idx, title, body], i) => ({
  big: enter(big, big + (i === 0 ? 1.596 : DUR), "x", 180),
  index: enter(idx, idx + DUR, "x", -140),
  title: enter(title, title + DUR, "x", -140),
  body: enter(body, body + DUR, "x", -140),
}));

/** Step 1 keeps Figma's absolute 0.4s start; later steps start as soon as they scroll into view. */
export const stepBase = starts.map(([, idx], i) => (i === 0 ? 0 : idx));
