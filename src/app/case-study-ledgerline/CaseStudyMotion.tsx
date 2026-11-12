"use client";
import { useEffect } from "react";
import { EASE, type Bezier, type StaggerProps } from "@/lib/figmaMotion";
import {
  bindBackToTop, entranceStart, IN, onEnter, playEntrance, QUAD, rise, staggerLines, type Entrance,
} from "@/lib/revealMotion";

/**
 * Case Study — Ledgerline motion, read from Figma node tracks (frame 691:48363, timeline 14.4s).
 * Times are the Figma timeline seconds; entrances start at that time on load (above the fold) or when scrolled in.
 */
const EOUT = EASE.out;

const scaleIn = (t0: number, t1: number, s: number, out: Bezier) => ({
  SCALE_XY: [{ t: t0, v: { x: s, y: s }, e: IN }, { t: t1, v: { x: 1, y: 1 }, e: out }],
});

const SPECS: Record<string, Entrance> = {
  bc: { tracks: { OPACITY: [{ t: 0, v: 0, e: IN }, { t: 0.4, v: 1, e: EOUT }] } }, // Breadcrumb 691:48399
  title: { tracks: rise(0.1, 0.7, 20, EOUT) }, // Frame 157 691:48404
  hero: { tracks: { ...rise(0.4, 1.2, 0, EOUT), ...scaleIn(0.4, 1.2, 1.03, EOUT) } }, // Rectangle 18 691:48407
  // § Manifesto bands (691:48408, 691:48412): opacity, TRANSLATION_Y 100, scale .96
  band0: { tracks: rise(2.6, 3.5, 100, QUAD, 0.96) },
  band1: { tracks: rise(5.4, 6.3, 100, QUAD, 0.96) },
  // Frame 160 inside each band: TRANSLATION_Y 60 -> 0 (691:48409, 691:48413)
  row0: { tracks: { TRANSLATION_Y: [{ t: 2.6, v: 60, e: IN }, { t: 3.9, v: 0, e: QUAD }] } },
  row1: { tracks: { TRANSLATION_Y: [{ t: 5.4, v: 60, e: IN }, { t: 6.7, v: 0, e: QUAD }] } },
  // icon glyphs: fade in, then idle float (translateY 0 -> -amp -> 0)
  i0: { tracks: { OPACITY: [{ t: 0.5, v: 0, e: IN }, { t: 1.1, v: 1, e: EOUT }] }, float: { amp: 6, period: 6.2, delay: 2.0 - 1.1 } },
  i1: { tracks: { OPACITY: [{ t: 0.58, v: 0, e: IN }, { t: 1.18, v: 1, e: EOUT }] }, float: { amp: 5, period: 4.8, delay: 2.63 - 1.18 } },
  i2: { tracks: { OPACITY: [{ t: 0.66, v: 0, e: IN }, { t: 1.26, v: 1, e: EOUT }] }, float: { amp: 7, period: 5.8, delay: 2.27 - 1.26 } },
  i3: { tracks: { OPACITY: [{ t: 0.74, v: 0, e: IN }, { t: 1.34, v: 1, e: EOUT }] }, float: { amp: 5, period: 6.6, delay: 2.99 - 1.34 } },
};

// TextStagger presets (LINE grouping, LEFT_RIGHT, bottom, blur 4, easing .25,.46,.45,.94)
const STATEMENT: StaggerProps = { duration: 1.1, distance: 14, blur: 4, overlap: 100, ease: QUAD, direction: "bottom" };
const SUPPORT: StaggerProps = { duration: 1.35, distance: 10, blur: 4, overlap: 81, ease: QUAD, direction: "bottom" };
// text offsets on the timeline relative to their band's own start (3.0 / 3.6 vs 2.6; 5.8 / 6.4 vs 5.4)
const STATEMENT_AFTER = 0.4;
const SUPPORT_AFTER = 1.0;

export default function CaseStudyMotion() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const main = document.querySelector("main");
    if (!main) return;

    for (const el of Array.from(main.querySelectorAll<HTMLElement>("[data-m]"))) {
      const key = el.dataset.m!;
      if (key.startsWith("band") || key.startsWith("row")) continue; // driven together below
      const spec = SPECS[key];
      if (!spec) continue;
      cleanups.push(onEnter(el, (initial) => playEntrance(el, spec, initial ? entranceStart(spec) : 0)));
    }

    // text staggers: start relative to the band entrance
    for (const band of Array.from(main.querySelectorAll<HTMLElement>("[data-band]"))) {
      const heading = band.querySelector<HTMLElement>("[data-statement]");
      const body = band.querySelector<HTMLElement>("[data-supporting]");
      // split now so line boxes exist; the band itself is still hidden, so nothing flashes
      cleanups.push(
        onEnter(band, () => {
          // band + its inner row (Frame 160) start together
          playEntrance(band, SPECS[band.dataset.m!], 0);
          const row = band.querySelector<HTMLElement>('[data-m^="row"]');
          if (row) playEntrance(row, SPECS[row.dataset.m!], 0);
          if (heading) staggerLines(heading, { ...STATEMENT, delay: STATEMENT_AFTER });
          if (body) staggerLines(body, { ...SUPPORT, delay: SUPPORT_AFTER });
        }),
      );
    }

    cleanups.push(bindBackToTop(main));
    return () => cleanups.forEach((c) => c());
  }, []);
  return null;
}
