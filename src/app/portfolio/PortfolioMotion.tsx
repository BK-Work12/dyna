"use client";
import { useEffect } from "react";
import { EASE } from "@/lib/figmaMotion";
import { bindBackToTop, onEnter, OUT, playEntrance, entranceStart, rise, type Entrance } from "@/lib/revealMotion";

/**
 * Portfolio motion, read from Figma node tracks (frame 691:48263, timeline 45.13s).
 * Entrances start at the node's own first-keyframe time when visible on load, otherwise when scrolled into view.
 */
const EOUT = EASE.out;

// float on the card media: TRANSLATION_Y 0 -> -12 -> 0, 1.6s each way (3.2s period), ease-in-out, loops
const FLOAT = { amp: 12, period: 3.2 };

const SPECS: Record<string, Entrance> = {
  h1a: { tracks: rise(0.12, 0.67, 18, EOUT) }, // 691:48270
  h1b: { tracks: rise(0.12, 0.67, 18, EOUT) }, // 691:48271
  lead: { tracks: rise(0.26, 0.76, 16, EOUT) }, // 691:48273
  // cards: media 691:48310 / 48322 / 48332 / 48342 / 48352, scale .965 -> 1
  m0: { tracks: rise(0.25, 1.15, 28, OUT, 0.965), float: FLOAT },
  m1: { tracks: rise(0.69, 1.59, 28, OUT, 0.965), float: FLOAT },
  m2: { tracks: rise(0.91, 1.81, 28, OUT, 0.965), float: FLOAT },
  m3: { tracks: rise(1.13, 2.03, 28, OUT, 0.965), float: FLOAT },
  m4: { tracks: rise(1.35, 2.25, 28, OUT, 0.965), float: FLOAT },
  // card text: 691:48312 / 48323 / 48333 / 48343 / 48353
  t0: { tracks: rise(0.43, 1.33, 28) },
  t1: { tracks: rise(1.09, 1.99, 28) },
  t2: { tracks: rise(0.87, 1.77, 28) },
  t3: { tracks: rise(1.31, 2.21, 28) },
  t4: { tracks: rise(1.53, 2.43, 28) },
  // footer: CTA Title 691:48277, CTA Sub 691:48278, Footer CTA 691:48279
  f0: { tracks: rise(2.45, 3.25, 30) },
  f1: { tracks: rise(2.55, 3.35, 30) },
  f2: { tracks: rise(2.65, 3.45, 30) },
};

export default function PortfolioMotion() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const main = document.querySelector("main");
    if (!main) return;

    for (const el of Array.from(main.querySelectorAll<HTMLElement>("[data-m]"))) {
      const spec = SPECS[el.dataset.m!];
      if (!spec) continue;
      cleanups.push(onEnter(el, (initial) => playEntrance(el, spec, initial ? entranceStart(spec) : 0)));
    }

    // footer text entrance (shared Footer markup, targeted by class)
    const footer = main.querySelector<HTMLElement>(".footer");
    if (footer) {
      const parts: Array<[string, string]> = [
        [".footer__title", "f0"],
        [".footer__sub", "f1"],
        [".footer__cta", "f2"],
      ];
      cleanups.push(
        onEnter(footer, () => {
          const base = entranceStart(SPECS.f0);
          for (const [sel, key] of parts) {
            const el = footer.querySelector<HTMLElement>(sel);
            if (el) playEntrance(el, SPECS[key], entranceStart(SPECS[key]) - base);
          }
        }),
      );
    }

    cleanups.push(bindBackToTop(main));
    return () => cleanups.forEach((c) => c());
  }, []);
  return null;
}
