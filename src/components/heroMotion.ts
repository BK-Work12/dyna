import type { Tracks, Bezier } from "@/lib/figmaMotion";

// Figma easings used on the Contact / Discuss hero keyframes
const IN: Bezier = [0.5, 0, 0.5, 1];
const OUT: Bezier = [0, 0, 0.58, 1];

/** H1 — identical on Contact (691:48660) and Discuss (691:48713). */
export const H1_TRACKS: Tracks = {
  OPACITY: [{ t: 0.1, v: 0, e: IN }, { t: 0.7, v: 1, e: OUT }],
  TRANSLATION_Y: [{ t: 0.12, v: 18, e: IN }, { t: 0.67, v: 0, e: OUT }],
  SCALE_X: [{ t: 0.1, v: 0.97, e: IN }, { t: 0.7, v: 1, e: OUT }],
  SCALE_Y: [{ t: 0.1, v: 0.97, e: IN }, { t: 0.7, v: 1, e: OUT }],
};

/** Supporting copy — Contact 691:48662. */
export const CONTACT_COPY_TRACKS: Tracks = {
  OPACITY: [{ t: 0.4, v: 0, e: IN }, { t: 1.1, v: 1, e: OUT }],
  TRANSLATION_Y: [{ t: 0.26, v: 16, e: IN }, { t: 0.76, v: 0, e: OUT }],
};

/** Supporting copy — Discuss 691:48715. */
export const DISCUSS_COPY_TRACKS: Tracks = {
  OPACITY: [{ t: 0.18, v: 0, e: IN }, { t: 0.58, v: 1, e: OUT }],
  TRANSLATION_Y: [{ t: 0.18, v: 12, e: IN }, { t: 0.58, v: 0, e: OUT }],
};

/** CTAs — identical on both (691:48663 / 691:48716). */
export const CTA_TRACKS: Tracks = {
  OPACITY: [{ t: 0.45, v: 0, e: IN }, { t: 0.95, v: 1, e: OUT }],
};

export const HERO_TIMELINE = 1.2;
