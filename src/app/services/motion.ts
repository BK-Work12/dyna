import type { MotionMap } from "@/components/motion/MotionRoot";
import { EASE_OUT, IN, enter } from "@/components/motion/enter";

/*
 * Real Figma keyframes (frame 691:48447, 45.13s timeline). Each section's tracks are expressed relative to
 * the section's first keyframe (Digital Products 0.2s, Custom Software 2.2s, AI 4.2s in Figma) so they
 * play when the section scrolls into view. Every entrance runs 0.8s: ease 0.5,0,0.5,1 in / 0.22,1,0.36,1 out.
 */
const D = 0.8;

/** Digital Products: label, title, intro, 2 wide cards (c0,c1), 3 cards (c2,c3,c4), closing, button */
export const digitalMotion: MotionMap = {
  label: enter(0, D, "y", -32),
  title: enter(0.08, 0.08 + D, "y", -32),
  intro: enter(0.16, 0.16 + D, "y", -32),
  c0: enter(0.3, 0.3 + D, "x", -160),
  c1: enter(0.3, 0.3 + D, "x", 160),
  c2: enter(0.45, 0.45 + D, "x", -160),
  c3: enter(0.6, 0.6 + D, "y", 40),
  c4: enter(0.45, 0.45 + D, "x", 160),
  closing: enter(0.95, 0.95 + D, "y", 40),
  btn: enter(1.1, 1.1 + D, "y", 40),
};

/** Custom Software + AI: label, title, intro, full-width card (c0), c1,c2,c3, closing, button */
export const fourMotion: MotionMap = {
  label: enter(0, D, "y", -32),
  title: enter(0.08, 0.08 + D, "y", -32),
  intro: enter(0.16, 0.16 + D, "y", -32),
  c0: enter(0.45, 0.45 + D, "y", 40),
  c1: enter(0.45, 0.45 + D, "x", -160),
  c2: enter(0.6, 0.6 + D, "y", 40),
  c3: enter(0.45, 0.45 + D, "x", 160),
  closing: enter(0.95, 0.95 + D, "y", 40),
  btn: enter(1.1, 1.1 + D, "y", 40),
};

/** Hero (plays on load): H1 lines, supporting copy, CTAs. Ease-out 0,0,0.58,1. */
const h1 = {
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
} satisfies MotionMap[string];

export const heroMotion: MotionMap = {
  h1a: h1,
  h1b: h1,
  lead: {
    OPACITY: [
      { t: 0.3, v: 0, e: IN },
      { t: 0.8, v: 1, e: EASE_OUT },
    ],
    TRANSLATION_Y: [
      { t: 0.26, v: 16, e: IN },
      { t: 0.76, v: 0, e: EASE_OUT },
    ],
  },
  ctas: {
    OPACITY: [
      { t: 0.45, v: 0, e: IN },
      { t: 0.95, v: 1, e: EASE_OUT },
    ],
  },
};
