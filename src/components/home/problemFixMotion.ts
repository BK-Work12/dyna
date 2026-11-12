import type { Bezier, Kf, Tracks } from "@/lib/figmaMotion";

/**
 * Keyframe tracks read from Figma (Home frame, 12s timeline) for the three proof cards in
 * "01 The Problem -> The Fix". Figma repeats one 6s cycle twice inside the 12s timeline (second copy = +6s),
 * so each track is written once and mirrored with cyc().
 * Easing curves are the exact Figma cubic-beziers; each keyframe's easing is the curve used to arrive at it.
 */
const B1: Bezier = [0.5, 0, 0.5, 1];
const B2: Bezier = [0.16, 1, 0.3, 1]; // ease-out used for entrances
const B3: Bezier = [0.42, 0, 0.58, 1]; // ease-in-out used for exits
const B4: Bezier = [0.45, 1.45, 0.8, 1]; // back-out used for pop-ins
const B5: Bezier = [0, 0, 0.58, 1];

type V = number | [number, number];
type K = [number, V, Bezier?];

const kf = (a: K[]): Kf[] => a.map(([t, v, e]) => ({ t, v: Array.isArray(v) ? { x: v[0], y: v[1] } : v, e }));
/** one cycle + the same cycle shifted by +6s */
const cyc = (a: K[]): Kf[] => kf([...a, ...a.map(([t, v, e]) => [Math.round((t + 6) * 1000) / 1000, v, e] as K)]);

const fadeIn = (a: number): K[] => [[a, 0, B1], [a + 0.5, 1, B2], [5.3, 1], [5.8, 0, B3]];

export const MOTION: Record<string, Tracks> = {};

/* ---------- Card 1 — Process map ---------- */
MOTION.count = { OPACITY: cyc([[0.4, 0, B1], [0.9, 1, B2], [5.3, 1], [5.8, 0, B3]]) };

const packetStart = [0.05, 1.1, 2.15, 3.2];
const packetDy = [33, 13, -7, 117];
packetStart.forEach((s, i) => {
  MOTION[`pk${i}`] = {
    OPACITY: cyc([[s - 0.01, 0, B1], [s, 1], [s + 0.45, 1], [s + 0.55, 0]]),
    TRANSLATION_X: cyc([[s, 0, B1], [s + 0.45, 120, B3]]),
    TRANSLATION_Y: cyc([[s, 0, B1], [s + 0.45, packetDy[i], B3]]),
  };
});

const rowStart = [0.5, 1.55, 2.6, 3.65];
rowStart.forEach((a, i) => {
  MOTION[`row${i}`] = {
    OPACITY: cyc(fadeIn(a)),
    TRANSLATION_Y: cyc([[a, -10, B1], [a + 0.5, 0, B2]]),
  };
});

const flagStart = [0.85, 1.9, 2.95, 4];
flagStart.forEach((a, i) => {
  MOTION[`fl${i}`] = {
    OPACITY: cyc([[a, 0, B1], [a + 0.35, 1, B2]]),
    SCALE_XY: cyc([[a, [0.6, 0.6], B1], [a + 0.35, [1, 1], B4]]),
  };
});

/* ---------- Card 2 — 12 months -> 6 weeks ---------- */
MOTION.strike = { WIDTH: cyc([[0.4, 1, B1], [1, 141, B2], [5.3, 141], [5.8, 1, B3]]) };
MOTION.newtime = {
  OPACITY: cyc(fadeIn(1)),
  TRANSLATION_Y: cyc([[1, 18, B1], [1.5, 0, B2]]),
};
MOTION.pfill = { WIDTH: cyc([[1.6, 2, B1], [3, 346, B2], [5.3, 346], [5.8, 2, B3]]) };
MOTION.sent = {
  OPACITY: cyc([[3, 0, B1], [3.3, 1, B2], [5.3, 1], [5.8, 0, B3]]),
  SCALE_XY: cyc([[3, [0.6, 0.6], B1], [3.4, [1, 1], B4]]),
};
MOTION.plabel = { OPACITY: cyc(fadeIn(1.7)) };

/* ---------- Card 3 — partner timeline ---------- */
MOTION.log = { OPACITY: cyc(fadeIn(4)) };
{
  // "Live" dot pulses 1 <-> 0.2 every 0.75s over the whole 12s timeline
  const live: K[] = [[0, 1, B1]];
  for (let i = 1; i * 0.75 <= 12 + 1e-9; i++) live.push([Math.round(i * 0.75 * 100) / 100, i % 2 ? 0.2 : 1, B3]);
  MOTION.live = { OPACITY: kf(live) };
}
MOTION.rail = {
  WIDTH: cyc([[0.5, 2, B1], [1.3, 80.5, B2], [2.1, 161, B2], [2.9, 241.5, B2], [3.7, 322, B2], [5.3, 322], [5.8, 2, B3]]),
};

const stepStart = [0.5, 1.3, 2.1, 2.9, 3.7];
stepStart.forEach((s, i) => {
  // dot pops (scale 1 -> 1.5 -> 1) as it becomes active
  MOTION[`step${i}`] = { SCALE_XY: cyc([[s, [1, 1], B1], [s + 0.15, [1.5, 1.5], B5], [s + 0.45, [1, 1], B3]]) };
  // fill #333333 -> #fe6b1e is reproduced as an orange overlay fading in (identical blend)
  MOTION[`dot${i}`] = {
    OPACITY: cyc([[s - 0.01, 0, B1], [s + 0.2, 1, B2], [5.3, 1], [5.8, 0, B3]]),
  };
});
const metaStart = [0.6, 1.4, 2.2, 3, 3.8];
metaStart.forEach((m, i) => {
  MOTION[`meta${i}`] = {
    OPACITY: cyc(fadeIn(m)),
    TRANSLATION_Y: cyc([[m, 6, B1], [m + 0.5, 0, B2]]),
  };
});
