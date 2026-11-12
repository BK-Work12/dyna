"use client";
import { useEffect, useRef } from "react";
import s from "./TrustedBy.module.css";
import { playTracks } from "@/lib/figmaMotion";

type Cell = { mark: number; label: string; left: number; top: number; cls: string; style?: React.CSSProperties };

const row1: Cell[] = [
  { mark: 1, label: "MERIDIAN", left: 24, top: 49, cls: "michroma", style: { fontSize: 15, letterSpacing: 1.8 } },
  { mark: 2, label: "Kestrel Freight", left: 13, top: 45, cls: "sans", style: { fontSize: 20, fontWeight: 700 } },
  { mark: 3, label: "atlas clinics", left: 28, top: 45, cls: "alex", style: { fontSize: 20, fontWeight: 300 } },
  { mark: 4, label: "HARBOR", left: 51, top: 47, cls: "mono", style: { fontSize: 18, fontWeight: 500 } },
  { mark: 5, label: "Northline", left: 33, top: 44, cls: "alex", style: { fontSize: 21, fontWeight: 600 } },
  { mark: 6, label: "LEDGERLINE", left: 24, top: 47, cls: "sans", style: { fontSize: 18, fontWeight: 600, letterSpacing: 0.72 } },
];
const row2: Cell[] = [
  { mark: 7, label: "fieldwork", left: 32, top: 46, cls: "mono", style: { fontSize: 19, fontWeight: 400 } },
  { mark: 8, label: "Lane Estates", left: 24, top: 45, cls: "sans", style: { fontSize: 20, fontWeight: 500 } },
  { mark: 9, label: "MARSH & CO.", left: 9, top: 49, cls: "michroma", style: { fontSize: 14, letterSpacing: 1.4 } },
  { mark: 10, label: "Hughes Dental", left: 14, top: 46, cls: "alex", style: { fontSize: 19, fontWeight: 300 } },
  { mark: 11, label: "KAUR FOODS", left: 20, top: 47, cls: "alex", style: { fontSize: 18, fontWeight: 600, letterSpacing: 0.54 } },
  { mark: 12, label: "St. Anne’s Trust", left: 13, top: 45, cls: "sans", style: { fontSize: 20, fontWeight: 400 } },
];

function Row({ cells, className, top, rowRef }: { cells: Cell[]; className: string; top: number; rowRef: React.Ref<HTMLDivElement> }) {
  // 18 cells (3 cycles of 6) as in the design; the Figma track shifts by one cycle (1200px) per 12s for a seamless loop
  const all = [...cells, ...cells, ...cells];
  return (
    <div ref={rowRef} className={`${s.row} ${className}`} style={{ top }}>
      {all.map((c, i) => (
        <div key={i} className={s.cell} style={{ left: i * 200 }}>
          <span className={s.rule} />
          <div className={s.lockup} style={{ left: c.left, top: c.top }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={s.mark} src={`/assets/home/mark${c.mark}.svg`} alt="" />
            <span className={`${s.label} ${s[c.cls]}`} style={c.style}>{c.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TrustedBy() {
  const sec = useRef<HTMLElement>(null);
  const r1 = useRef<HTMLDivElement>(null);
  const r2 = useRef<HTMLDivElement>(null);

  // Figma (Home, 12s looping timeline): Row 1 translateX 0 -> -1200, Row 2 (left -1300) translateX 0 -> +1200, linear.
  useEffect(() => {
    const anims = [
      r1.current && playTracks(r1.current, { TRANSLATION_X: [{ t: 0, v: 0 }, { t: 12, v: -1200 }] }, { timeline: 12, loop: true }),
      r2.current && playTracks(r2.current, { TRANSLATION_X: [{ t: 0, v: 0 }, { t: 12, v: 1200 }] }, { timeline: 12, loop: true }),
    ].filter(Boolean) as Animation[];
    if (!sec.current) return;
    const io = new IntersectionObserver(([e]) => anims.forEach((a) => (e.isIntersecting ? a.play() : a.pause())));
    io.observe(sec.current);
    return () => {
      io.disconnect();
      anims.forEach((a) => a.cancel());
    };
  }, []);

  return (
    <section ref={sec} className={`${s.section} frame`}>
      <p className={s.eyebrow}>TRUSTED BY</p>
      <h2 className={s.title}>Teams that run on software we built.</h2>

      <div className={s.metrics}>
        <div className={s.metric} style={{ paddingRight: 36 }}>
          <p className={s.num}>60<span>+</span></p>
          <p className={s.cap}>Products shipped</p>
        </div>
        <div className={s.divider} />
        <div className={s.metric} style={{ padding: "0 36px" }}>
          <p className={s.num}>12</p>
          <p className={s.cap}>Industries served</p>
        </div>
        <div className={s.divider} />
        <div className={s.metric} style={{ paddingLeft: 36 }}>
          <p className={s.num}>94<span>%</span></p>
          <p className={s.cap}>Clients who come back</p>
        </div>
      </div>

      <div className={s.marquee} aria-label="Client logos">
        <Row rowRef={r1} cells={row1} className={s.row1} top={0} />
        <Row rowRef={r2} cells={row2} className={s.row2} top={120} />
        <span className={s.hair} style={{ top: 0 }} />
        <span className={s.hair} style={{ top: 120 }} />
        <span className={s.hair} style={{ top: 239 }} />
        <span className={`${s.fade} ${s.fadeL}`} />
        <span className={`${s.fade} ${s.fadeR}`} />
      </div>
    </section>
  );
}
