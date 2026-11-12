"use client";
import { useEffect, useRef } from "react";
import s from "./Manifesto.module.css";
import { MOBILE_MAX } from "@/lib/fitWidth";
import { staggerIn, type StaggerProps } from "@/lib/figmaMotion";

/**
 * Figma TextStagger presets (Home timeline), all: grouping LINE, order LEFT_RIGHT, direction bottom, blur on,
 * opacity 0 -> 1, easing cubic-bezier(0.25, 0.46, 0.45, 0.94).
 *  Eyebrow          duration 0.80  delay 0.00  distance 6   overlap 100
 *  Statement Line 1 duration 1.10  delay 0.25  distance 14  overlap 100
 *  Statement Line 2 duration 1.10  delay 0.50  distance 14  overlap 100
 *  Supporting Line  duration 1.35  delay 1.00  distance 10  overlap 81
 */
const EASE_TS: StaggerProps["ease"] = [0.25, 0.46, 0.45, 0.94];
const base = { blur: 4, direction: "bottom" as const, ease: EASE_TS };

/** Wrap each rendered line of a wrapped paragraph in its own block so lines can stagger as groups. */
function splitLines(p: HTMLElement): HTMLElement[] {
  const text = p.dataset.t ?? p.textContent ?? "";
  p.dataset.t = text;
  p.textContent = "";
  const words = text.split(/\s+/).filter(Boolean).map((w, i) => {
    const sp = document.createElement("span");
    sp.textContent = (i ? " " : "") + w;
    p.appendChild(sp);
    return sp;
  });
  const lines: string[][] = [];
  let lastTop: number | null = null;
  for (const w of words) {
    if (lastTop === null || Math.abs(w.offsetTop - lastTop) > 2) {
      lines.push([]);
      lastTop = w.offsetTop;
    }
    lines[lines.length - 1].push(w.textContent!.trim());
  }
  p.textContent = "";
  return lines.map((l) => {
    const sp = document.createElement("span");
    sp.style.display = "block";
    sp.textContent = l.join(" ");
    p.appendChild(sp);
    return sp;
  });
}

/** Total length of the stagger timeline (last line ends at delay 1.0 + 1.35). */
const TL = 2.4;
/** Fraction of the pinned scroll used to play the reveal; the remainder holds the finished text on screen. */
const PLAY = 0.8;

export default function Manifesto() {
  const sec = useRef<HTMLElement>(null);
  const eyebrow = useRef<HTMLParagraphElement>(null);
  const l1 = useRef<HTMLParagraphElement>(null);
  const l2 = useRef<HTMLParagraphElement>(null);
  const sub = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = sec.current;
    if (!root || !eyebrow.current || !l1.current || !l2.current || !sub.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = [eyebrow.current, l1.current, l2.current, sub.current];
    const reveal = () => els.forEach((e) => e.classList.remove(s.pre));
    if (reduce) {
      reveal();
      return;
    }
    // Scroll-scrubbed: the section is pinned (sticky) and scroll position drives the stagger,
    // so the next section only arrives after every line has been shown.
    const anims = [
      ...staggerIn([eyebrow.current], { ...base, duration: 0.8, distance: 6, overlap: 100, delay: 0 }),
      ...staggerIn([l1.current], { ...base, duration: 1.1, distance: 14, overlap: 100, delay: 0.25 }),
      ...staggerIn([l2.current], { ...base, duration: 1.1, distance: 14, overlap: 100, delay: 0.5 }),
      ...staggerIn(splitLines(sub.current), { ...base, duration: 1.35, distance: 10, overlap: 81, delay: 1 }),
    ];
    anims.forEach((a) => {
      a.pause();
      a.currentTime = 0;
    });
    reveal(); // fill:both keeps opacity 0 until the scrub reaches each line

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = root.getBoundingClientRect();
      const vh = window.innerHeight;
      if (document.documentElement.clientWidth <= MOBILE_MAX) {
        // mobile: in-flow section — reveal while it travels from 90% down to ~40% of the viewport
        const pm = Math.min(1, Math.max(0, (vh * 0.9 - r.top) / (vh * 0.5)));
        const tm = pm * TL * 1000;
        anims.forEach((a) => (a.currentTime = tm));
        return;
      }
      // start as soon as the section rises into view (top edge at 85% of the viewport), finish before it unpins
      const lead = vh * 0.85;
      const span = lead + Math.max(0, root.offsetHeight - vh);
      const progress = Math.min(1, Math.max(0, (lead - r.top) / span));
      const t = Math.min(1, progress / PLAY) * TL * 1000;
      anims.forEach((a) => (a.currentTime = t));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      anims.forEach((a) => a.cancel());
      reveal();
    };
  }, []);

  return (
    <section ref={sec} className={`${s.section} frame`}>
      <div className={s.stage}>
        <div className={s.lines}>
          <p ref={eyebrow} className={`${s.eyebrow} ${s.pre}`}>WHAT WE BELIEVE</p>
          <p ref={l1} className={`${s.l1} ${s.pre}`}>
            Software should <span className={s.o}>fit the business</span>,
          </p>
          <p ref={l2} className={`${s.l2} ${s.pre}`}>not the other way round.</p>
          <p ref={sub} className={`${s.sub} ${s.pre}`}>
            We start where the work happens the calls, the spreadsheets, the handovers and build only what removes the
            friction.
          </p>
        </div>
      </div>
    </section>
  );
}
