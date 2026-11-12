"use client";
import { useEffect, useRef, useState } from "react";
import s from "./ServicesSection.module.css";

const titles = ["Custom Software", "Digital Products", "AI & Business Automation"];

const captions = [
  "Systems shaped around how your business actually runs not the other way round.",
  "Apps and platforms your customers choose, use and come back to.",
  "The repetitive work, handled with people kept in the loop where it matters.",
];

const tags = [
  ["Internal platforms", "Ops & ERP extensions", "Integrations & APIs", "Legacy rebuilds"],
  ["Product strategy", "UX & UI design", "Web & mobile apps", "Design systems"],
  ["Workflow automation", "Document AI", "Agents & copilots", "Data pipelines"],
];

const stockRows = [
  { name: "Pallet wrap 23µ", qty: "1,240", chip: "OK", low: false },
  { name: "Corner boards", qty: "86", chip: "LOW", low: true },
  { name: "Strapping kit", qty: "402", chip: "OK", low: false },
];

const journey = [
  { label: "1  DISCOVER", dark: false },
  { label: "2  PROTOTYPE", dark: false },
  { label: "3  LAUNCH", dark: true },
];

const flow = ["Email in", "AI extracts", "Rules check", "Posted"];

export default function ServicesSection() {
  const [active, setActive] = useState(0);
  const hoverTimer = useRef<number | null>(null);

  const run = useRef<HTMLElement>(null);

  // The section is pinned (sticky) to the screen and scroll position steps through the three services
  // (Figma's 4s auto-advance is replaced by scroll, since the section stays on screen while you scroll).
  useEffect(() => {
    const el = run.current;
    if (!el) return;
    let raf = 0;
    let last = -1;
    const mq = window.matchMedia("(max-width: 900px)"); // mobile: no pinned runway; tabs are tap-to-switch
    const update = () => {
      raf = 0;
      if (mq.matches) {
        last = -1;
        return;
      }
      const vh = window.innerHeight;
      // Fit the window height by scaling; spend any spare width by widening the layout instead of leaving gaps.
      const cw = el.clientWidth;
      const k = Math.min(1, cw / 1440, vh / 900);
      el.style.setProperty("--k", String(k));
      el.style.setProperty("--w", `${Math.max(1440, cw / k)}px`);
      const total = el.offsetHeight - vh;
      const p = total > 0 ? Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total)) : 0;
      const idx = Math.min(2, Math.floor(p * 3));
      if (idx !== last) {
        last = idx;
        setActive(idx);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    mq.addEventListener("change", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      mq.removeEventListener("change", onScroll);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Titles: ON_CLICK switches immediately; MOUSE_ENTER switches after a 0.15s delay (cancelled if the pointer leaves).
  const enter = (i: number) => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setActive(i), 150);
  };
  const leave = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
  };

  const layer = (i: number) => `${s.layer} ${active === i ? s.on : ""}`;

  return (
    <section ref={run} className={`${s.section} frame`}>
      <div className={s.sticky}>
      <div className={s.canvas}>
      <div className={s.hairline} />
      <div className={s.stack}>
        <div className={s.head}>
          <h2 className={s.title}>
            <span>Three disciplines.</span>
            <span>One way of working.</span>
          </h2>
          <p className={s.intro}>Start with the business, then design and engineer what it actually needs.</p>
        </div>

        <div className={s.services}>
          <div className={s.left}>
            <div className={s.track} />
            <div className={s.progress} style={{ top: active * 190 }} />
            {titles.map((t, i) => (
              <button
                key={t}
                type="button"
                className={`${s.item} ${active === i ? s.itemOn : ""}`}
                style={{ top: i * 190 }}
                onMouseEnter={() => enter(i)}
                onMouseLeave={leave}
                onClick={() => {
                  leave();
                  setActive(i);
                }}
                aria-pressed={active === i}
              >
                <span className={s.num}>{String(i + 1).padStart(2, "0")}</span>
                <span className={s.name}>{t}</span>
              </button>
            ))}
          </div>

          <div className={s.stage}>
            {/* 1 — Stock control */}
            <div className={`${layer(0)} ${s.card1}`} aria-hidden={active !== 0}>
              <p className={s.c1Label}>{"STOCK CONTROL  /  ALL SITES"}</p>
              <div className={s.metric}>
                <span className={s.big}>£1.42m</span>
                <span className={s.up}>▲ 4.2% this month</span>
              </div>
              <div className={s.table}>
                {stockRows.map((r) => (
                  <div key={r.name} className={s.row}>
                    <span className={s.rowName}>{r.name}</span>
                    <span className={s.rowQty}>{r.qty}</span>
                    <span className={`${s.chip} ${r.low ? s.chipLow : s.chipOk}`}>{r.chip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2 — Product journey */}
            <div className={`${layer(1)} ${s.card2}`} aria-hidden={active !== 1}>
              <div className={s.screens}>
                {journey.map((j) => (
                  <div key={j.label} className={s.step}>
                    <div className={`${s.screen} ${j.dark ? s.screenDark : ""}`}>
                      <i className={s.bar} />
                      <i className={s.block} style={{ height: 55.114 }} />
                      <i className={s.block} style={{ height: 25.72 }} />
                      <i className={s.block} style={{ height: 25.72 }} />
                      <i className={s.btn} />
                    </div>
                    <span className={`${s.stepLabel} ${j.dark ? s.stepLabelOn : ""}`}>{j.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3 — Automated workflow */}
            <div className={`${layer(2)} ${s.card3}`} aria-hidden={active !== 2}>
              <p className={s.c3Label}>{"RUN #20418  ·  INVOICE RECEIVED"}</p>
              <div className={s.flow}>
                {flow.map((f, i) => (
                  <span key={f} className={s.flowGroup}>
                    <span className={`${s.node} ${i === flow.length - 1 ? s.nodeDark : ""}`}>{f}</span>
                    {i < flow.length - 1 && <span className={s.arrow}>→</span>}
                  </span>
                ))}
              </div>
              <div className={s.exception}>EXCEPTION → HUMAN REVIEW</div>
            </div>
          </div>

          <div className={s.rule} />
          {captions.map((c, i) => (
            <p key={c} className={`${s.caption} ${s.fade} ${active === i ? s.on : ""}`} aria-hidden={active !== i}>
              {c}
            </p>
          ))}
          {tags.map((group, i) => (
            <div key={i} className={`${s.tags} ${s.fade} ${active === i ? s.on : ""}`} aria-hidden={active !== i}>
              {group.map((t) => (
                <span key={t} className={s.tag}>
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      </div>
      </div>
    </section>
  );
}
