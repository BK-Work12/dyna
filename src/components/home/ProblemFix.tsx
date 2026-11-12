"use client";
import { useEffect, useRef, useState } from "react";
import s from "./ProblemFix.module.css";
import { playTracks, type Tracks, type TrackName } from "@/lib/figmaMotion";
import { MOTION } from "./problemFixMotion";
import StoryStage from "./StoryStage";
import { MOBILE_MAX } from "@/lib/fitWidth";

/** One WAAPI animation per property group so each keyframe keeps its own Figma easing curve. */
const GROUPS: TrackName[][] = [["OPACITY"], ["TRANSLATION_X", "TRANSLATION_Y"], ["ROTATION"], ["SCALE_XY", "SCALE_X", "SCALE_Y"], ["WIDTH"], ["HEIGHT"]];

const sources = [
  { k: "phone", bg: "#e5484d", top: 16 },
  { k: "chat", bg: "#2fb565", top: 64 },
  { k: "mail", bg: "#3b82f6", top: 112 },
];
const rows = [
  { label: "Lead intake", c: "#e5484d", top: 58, flag: "Manual", fl: 143, pk: 29 },
  { label: "Quoting", c: "#2fb565", top: 86, flag: "3 days", fl: 148, pk: 77 },
  { label: "Scheduling", c: "#3b82f6", top: 114, flag: "Whiteboard", fl: 121, pk: 125 },
  { label: "Invoicing", c: "#2fb565", top: 142, flag: "Late", fl: 157, pk: 29 },
];
const steps = [
  { k: "discover", l: "Discover", w: "Week 1", x: 36, cx: 44 },
  { k: "design", l: "Design", w: "Week 2", x: 116.5, cx: 124.5 },
  { k: "build", l: "Build", w: "Wk 3–6", x: 197, cx: 205 },
  { k: "launch", l: "Launch", w: "Week 7", x: 277.5, cx: 285.5 },
  { k: "improve", l: "Improve", w: "Ongoing", x: 358, cx: 366 },
];

export default function ProblemFix() {
  const [dyna, setDyna] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  // Scroll drives the toggle: Today first, then (after ~35% of the pinned scroll) With DYNA. Clicking still works.
  useEffect(() => {
    const el = pinRef.current;
    if (!el) return;
    let raf = 0;
    let last: boolean | null = null;
    const update = () => {
      raf = 0;
      if (document.documentElement.clientWidth <= MOBILE_MAX) {
        // mobile: in-flow layout, no pinned scrub; the user flips Today / With DYNA with the toggle
        el.style.removeProperty("--k");
        el.style.removeProperty("--w");
        last = null;
        return;
      }
      const vh = window.innerHeight;
      // fit the window height by scaling, and spend spare width by widening the layout (no empty side bands)
      const cw = el.clientWidth;
      const k = Math.min(1, cw / 1440, vh / 900);
      el.style.setProperty("--k", String(k));
      el.style.setProperty("--w", `${Math.max(1440, cw / k)}px`);
      const total = el.offsetHeight - vh;
      const p = total > 0 ? Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total)) : 0;
      const on = p >= 0.35;
      if (on !== last) {
        last = on;
        setDyna(on);
      }
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
    };
  }, []);

  // Figma timeline (12s, looping): proof-card animations. Built paused at t=0, played while the section is on screen.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const anims: Animation[] = [];
    root.querySelectorAll<HTMLElement>("[data-m]").forEach((el) => {
      const tracks = MOTION[el.dataset.m ?? ""];
      if (!tracks) return;
      for (const names of GROUPS) {
        const part: Tracks = {};
        for (const n of names) if (tracks[n]) part[n] = tracks[n];
        if (!Object.keys(part).length) continue;
        const a = playTracks(el, part, { timeline: 12, loop: true });
        if (a) {
          a.pause();
          a.currentTime = 0;
          anims.push(a);
        }
      }
    });
    const io = new IntersectionObserver(
      ([e]) => anims.forEach((a) => (e.isIntersecting ? a.play() : a.pause())),
      { threshold: 0.15 },
    );
    io.observe(root);
    return () => {
      io.disconnect();
      anims.forEach((a) => a.cancel());
    };
  }, []);

  return (
    <section ref={rootRef} className={`${s.section} frame`}>
      {/* Pinned: heading + toggle + stage stay on screen while scrolling; the toggle flips Today -> With DYNA on the way. */}
      <div ref={pinRef} className={s.pin}>
        <div className={s.sticky}>
          <div className={s.canvas}>
            <div className={s.hairline} />
            <div className={s.stack}>
        <div className={s.head}>
          <div className={s.h1}>
            <p>First the business.</p>
            <p>
              Then the build<span style={{ color: "#fe6b1e" }}>.</span>
            </p>
          </div>
          <p className={s.lead}>
            Most businesses don’t need more software. They need the way they already work the calls, spreadsheets and
            handovers turned into one system. Here’s what that looks like.
          </p>
        </div>

        <div className={s.switch}>
          <div className={s.toggleRow}>
            <div className={s.toggle} role="tablist">
              <button role="tab" aria-selected={!dyna} className={!dyna ? s.on : undefined} onClick={() => setDyna(false)}>
                Today
              </button>
              <button role="tab" aria-selected={dyna} className={dyna ? s.on : undefined} onClick={() => setDyna(true)}>
                With DYNA
              </button>
            </div>
            <button className={s.compare} onClick={() => setDyna((v) => !v)}>
              CLICK TO COMPARE
            </button>
          </div>

          <div className={s.stage}>
            <StoryStage dyna={dyna} />
          </div>
        </div>

            </div>
          </div>
        </div>
      </div>

      <div className={s.proofWrap}>
        <div className={s.proof}>
          {/* Card 1 */}
          <article className={s.card}>
            <div className={s.visual}><div className={s.vin}>
              <div className={s.mapPanel} />
              <span className={s.t13} style={{ left: 188, top: 32 }}>Process map</span>
              <span data-m="count" className={s.t11} style={{ left: 303, top: 34 }}>4 bottlenecks</span>
              {sources.map((o) => (
                <div key={o.k} className={s.src} style={{ background: o.bg, top: o.top }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/assets/home/src-${o.k}.svg`} alt="" />
                </div>
              ))}
              {rows.map((r, i) => (
                <div key={r.label}>
                  <i data-m={`pk${i}`} className={s.packet} style={{ background: r.c, top: r.pk }} />
                  <div data-m={`row${i}`} className={s.row} style={{ top: r.top }}>
                    <b style={{ background: r.c }} />
                    <span>{r.label}</span>
                    <em data-m={`fl${i}`} style={{ left: r.fl }}>{r.flag}</em>
                  </div>
                </div>
              ))}
            </div></div>
            <Text a="Guessing what to build" b="→ We map how you work" c="We sit with your team, follow the calls, spreadsheets and handovers, and find where time really goes." />
          </article>

          {/* Card 2 */}
          <article className={s.card}>
            <div className={s.visual}><div className={s.vin}>
              <span className={s.old} style={{ left: 32, top: 40 }}>12 months</span>
              <i data-m="strike" style={{ position: "absolute", left: 32, top: 59, width: 141, height: 2, background: "#fe6b1e" }} />
              <span data-m="newtime" className={s.new} style={{ left: 32, top: 84 }}>6 weeks</span>
              <i style={{ position: "absolute", left: 32, top: 160, width: 346, height: 6, borderRadius: 3, background: "rgba(245,245,242,0.08)" }} />
              <i data-m="pfill" style={{ position: "absolute", left: 32, top: 160, width: 346, height: 6, borderRadius: 3, background: "#fe6b1e" }} />
              <span data-m="sent" className={s.sent}><span>✓</span><span>v1.0 shipped</span></span>
              <span data-m="plabel" className={s.t11} style={{ left: 32, top: 172 }}>Discovery → sprints → first release</span>
            </div></div>
            <Text a="Off-the-shelf tools you work around" b="→ Software built around you" c="Custom software, products and automation, designed for how your business runs." />
          </article>

          {/* Card 3 */}
          <article className={s.card}>
            <div className={s.visual}><div className={s.vin}>
              <i style={{ position: "absolute", left: 44, top: 91, width: 322, height: 2, background: "rgba(28,28,28,0.12)" }} />
              <i data-m="rail" style={{ position: "absolute", left: 44, top: 91, width: 2, height: 2, background: "#fe6b1e" }} />
              <i data-m="live" style={{ position: "absolute", left: 32, top: 35, width: 6, height: 6, borderRadius: 3, background: "#fe6b1e" }} />
              <span data-m="log" className={s.t11} style={{ left: 44, top: 30 }}>Your partner from first workshop to v2, v3…</span>
              {steps.map((st, i) => (
                <div key={st.k}>
                  <div data-m={`step${i}`} style={{ position: "absolute", left: st.x, top: 84, width: 16, height: 16 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/assets/home/step-${st.k}.svg`} alt="" style={{ position: "absolute", left: 0, top: 0, width: 16, height: 16 }} />
                    {/* Figma animates this dot's fill #333333 -> #fe6b1e; an orange overlay fading in blends identically */}
                    <i data-m={`dot${i}`} style={{ position: "absolute", left: 1, top: 1, width: 14, height: 14, borderRadius: 7, background: "#fe6b1e", opacity: 0 }} />
                  </div>
                  <span className={s.stepL} style={{ left: st.cx }}>{st.l}</span>
                  <span data-m={`meta${i}`} className={s.stepW} style={{ left: st.cx }}>{st.w}</span>
                </div>
              ))}
            </div></div>
            <Text a="Launch, hand over, disappear" b="→ We stay to make it better" c="After launch we measure, support and keep shipping improvements, as a long-term partner." />
          </article>
        </div>
      </div>
    </section>
  );
}

function Text({ a, b, c }: { a: string; b: string; c: string }) {
  return (
    <div className={s.text}>
      <p className={s.strike}>{a}</p>
      <p className={s.big}>{b}</p>
      <p className={s.body}>{c}</p>
    </div>
  );
}
