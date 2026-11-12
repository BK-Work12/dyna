"use client";
import { useEffect, useRef } from "react";

/**
 * Figma "Intro Splash — Home": on every full load / reload the page opens on a full-screen dark overlay with the
 * DYNA logo in the centre. It then SMART_ANIMATEs (0.8s, cubic-bezier(0.22, 1, 0.36, 1)) into the real page:
 * the overlay shrinks to the header bar while the logo travels to its spot in the header, then the bar fades away
 * to reveal the real navbar. The hero entrance waits for the "intro:lift" event so it plays once you can see it.
 */
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const HOLD = 500; // time the centred logo is shown before it moves (the Figma trigger itself has 0 delay)
const MOVE = 800; // Figma transition duration
const FADE = 300; // hand-over from the overlay bar to the real navbar

export default function IntroSplash() {
  const root = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const lg = logo.current;
    const html = document.documentElement;
    if (!el || !lg) return;

    const finish = () => {
      el.style.display = "none";
      html.style.overflow = "";
      html.removeAttribute("data-intro");
      window.dispatchEvent(new Event("intro:lift")); // no-op if already fired
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    // start from the top so the header (the logo's destination) is on screen after a reload
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    html.style.overflow = "hidden";

    const anims: Animation[] = [];
    let t2 = 0;
    const t1 = window.setTimeout(() => {
      const target = document.querySelector<HTMLElement>(".navbar__logo")?.getBoundingClientRect();
      const barH = document.querySelector<HTMLElement>(".navbar")?.getBoundingClientRect().height ?? 72;
      const from = lg.getBoundingClientRect();
      window.dispatchEvent(new Event("intro:lift"));
      if (!target) {
        finish();
        return;
      }
      const dx = target.left - from.left;
      const dy = target.top - from.top;
      const s = target.width / from.width;
      anims.push(
        lg.animate([{ transform: "none" }, { transform: `translate(${dx}px, ${dy}px) scale(${s})` }], {
          duration: MOVE,
          easing: EASE,
          fill: "forwards",
        }),
        el.animate([{ height: "100vh" }, { height: `${barH}px` }], { duration: MOVE, easing: EASE, fill: "forwards" }),
      );
      t2 = window.setTimeout(() => {
        const out = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: FADE, easing: "linear", fill: "forwards" });
        anims.push(out);
        out.onfinish = finish;
      }, MOVE);
    }, HOLD);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      anims.forEach((a) => a.cancel());
      html.style.overflow = "";
    };
  }, []);

  return (
    <div ref={root} className="intro" aria-hidden>
      <div ref={logo} className="intro__logo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/contact/logo.svg" alt="" />
      </div>
    </div>
  );
}
