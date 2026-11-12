"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import s from "./Process.module.css";
import { PX_PER_SECOND, TIMELINE, processTracks, restPose, styleAt } from "./processMotion";

const A = "/assets/home/process-";

type TProps = { c?: string; st: CSSProperties; children?: ReactNode };
const T = ({ c = "", st, children }: TProps) => (
  <p className={`${s.a} ${c}`} style={st}>
    {children}
  </p>
);
const R = ({ top }: { top: number }) => <div className={`${s.a} ${s.rowRule}`} style={{ top }} />;
// eslint-disable-next-line @next/next/no-img-element
const Img = ({ src, st }: { src: string; st: CSSProperties }) => <img className={s.img} src={`${A}${src}.svg`} alt="" style={st} />;

const steps = [
  { n: "[01]", t: "Understand the business", b: "The people, constraints and decisions behind the problem, before anything is designed." },
  { n: "[02]", t: "Test before committing", b: "Prototypes and technical validation test the key assumptions early, before you commit to the full build." },
  { n: "[03]", t: "Build with visibility", b: "Focused increments. Working software you can review, not status reports." },
  { n: "[04]", t: "Hand over and improve", b: "Clear handover and what we learn after release guide what comes next." },
];

// Static poses from Figma relativeTransform (rotation about centre; deg = CSS clockwise)
const POSE = {
  p1: restPose(0, 0, 0),
  p2: restPose(12, 8, -3.5),
  p3: restPose(-10, 14, 5),
  p4: restPose(-10, 14, 5),
  sheet1: restPose(18.21, -13.83, 8),
  sheet2: restPose(-9.724, 56.988, -6.5),
  sheet3: restPose(4.803, 20.889, 2.5),
};
const at0 = (id: string): CSSProperties => styleAt(id, 0) as CSSProperties;
const fig = (id: string, extra: CSSProperties = {}): { "data-fig": string; style: CSSProperties } => ({ "data-fig": id, style: { ...extra, ...at0(id) } });

function Head({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <>
      <T c={`${s.mono} ${s.eyebrow}`} st={{}}>{`[${n}]  How it works`}</T>
      <T c={s.pTitle} st={{}}>{title}</T>
      <div className={`${s.a} ${s.rule}`} />
      <T c={s.pBody} st={{}}>{body}</T>
    </>
  );
}

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);

  // Scrub the Figma timeline with scroll: 1s === 225px (the four 225px Scroll Bands), 0..4s over the sticky runway.
  useEffect(() => {
    const run = ref.current;
    if (!run) return;
    const nodes = Object.keys(processTracks).map((id) => [id, run.querySelector<HTMLElement>(`[data-fig="${id}"]`)] as const);
    let raf = 0;
    const fit = () => {
      // fit the window height by scaling; spend spare width by spreading the layout to the section edges
      const cw = run.clientWidth;
      const k = Math.min(1, cw / 1440, window.innerHeight / 900);
      const w = Math.max(1440, cw / k);
      run.style.setProperty("--k", String(k));
      run.style.setProperty("--w", `${w}px`);
      run.style.setProperty("--dx", `${w - 1440}px`);
    };
    const apply = () => {
      raf = 0;
      fit();
      const y = -run.getBoundingClientRect().top;
      const t = Math.min(TIMELINE, Math.max(0, y / PX_PER_SECOND));
      for (const [id, el] of nodes) {
        if (!el) continue;
        const st = styleAt(id, t);
        if (st.opacity !== undefined) el.style.opacity = String(st.opacity);
        if (st.translate) el.style.translate = st.translate;
        if (st.rotate) el.style.rotate = st.rotate;
        if (st.scale) el.style.scale = st.scale;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const shadeId = ["s1", "s2", "s3", "s4"];
  const shade = (i: number) => <div className={s.shade} {...fig(shadeId[i])} />;

  return (
    <section className="frame" aria-label="Process">
      <div ref={ref} className={s.runway}>
        <div className={s.sticky}>
          <div className={s.canvas}>
            <div className={`${s.a} ${s.h2}`}>
              <p>Clarity before code.</p>
              <p>Continuity beyond launch.</p>
            </div>
            <p className={`${s.a} ${s.lead}`}>One team around your challenge, from first conversation to running software.</p>

            {steps.map((st, i) => (
              <div key={st.n} className={s.step} style={{ top: 300 + i * 140 }}>
                <p className={`${s.a} ${s.mono} ${s.stepNum}`}>{st.n}</p>
                <p className={`${s.a} ${s.stepTitle}`}>{st.t}</p>
                <p className={`${s.a} ${s.stepBody}`}>{st.b}</p>
                <div className={`${s.a} ${s.bar}`} style={i === 0 ? { background: "#f5f5f2" } : undefined} />
              </div>
            ))}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={s.glow} src={`${A}glow.svg`} alt="" />

            <div className={s.stack}>
              {/* returned sheets (fade/slide in as pages are handed over) */}
              <div className={s.back} {...fig("sheet3", POSE.sheet3)} />
              <div className={s.back} {...fig("sheet2", POSE.sheet2)} />
              <div className={s.back} {...fig("sheet1", POSE.sheet1)} />
              {/* static back sheets */}
              <div className={s.back} style={POSE.p3} />
              <div className={s.back} style={POSE.p2} />

              {/* Page 4 */}
              <div className={s.page} {...fig("p4", POSE.p4)}>
                <Head n="04" title="Hand over and improve" body="Launched with your team, then improved from real usage." />
                <T c={`${s.mono} ${s.label}`} st={{ top: 180 }}>Handover</T>
                {["Documentation", "Team training", "Live monitoring"].map((x, k) => (
                  <div key={x}>
                    <Img src="check-circle" st={{ left: 48, top: 208 + k * 34, width: 20, height: 20 }} />
                    <Img src="check" st={{ left: 53, top: 214 + k * 34, width: 10, height: 8 }} />
                    <T c={s.t15} st={{ left: 80, top: 207 + k * 34 }}>{x}</T>
                  </div>
                ))}
                <div className={s.a} style={{ left: 276, top: 176, width: 196, height: 132, borderRadius: 12, background: "#f9f8f5", border: "1px solid #d6d6d1" }}>
                  <T c={`${s.mono}`} st={{ left: 15, top: 15, fontSize: 11, color: "#9a9a95", lineHeight: "normal" }}>Usage after launch</T>
                  <Img src="sparkline" st={{ left: 15, top: 47, width: 164, height: 64 }} />
                  <div className={s.a} style={{ left: 15, top: 115, width: 164, height: 1, background: "#d6d6d1" }} />
                </div>
                <T c={`${s.mono} ${s.label}`} st={{ top: 332 }}>Next improvements</T>
                <R top={354} />
                <T c={s.t15} st={{ left: 48, top: 362 }}>Reporting dashboard</T>
                <div className={s.pill} style={{ left: 423, top: 361, width: 49, border: "1px solid #fe6b1e" }}>
                  <span className={s.pillText} style={{ left: 10, top: 2.5, color: "#fe6b1e" }}>Next</span>
                </div>
                <R top={390} />
                <T c={s.t15} st={{ left: 48, top: 398 }}>Mobile approvals</T>
                <div className={s.pill} style={{ left: 420, top: 397, width: 52, background: "#f2f1ec" }}>
                  <span className={s.pillText} style={{ left: 11, top: 3.5, color: "#6e6e6a" }}>Later</span>
                </div>
                <R top={426} />
                {shade(3)}
              </div>

              {/* Page 3 */}
              <div className={s.page} {...fig("p3", POSE.p3)}>
                <Head n="03" title="Build with visibility" body="Working software every two weeks, never status reports." />
                <T c={`${s.mono} ${s.label}`} st={{ top: 180 }}>Increments</T>
                <R top={204} />
                {[
                  { n: "Order intake", w: 190, p: "100%", dark: true },
                  { n: "Approvals", w: 190, p: "100%", dark: true },
                  { n: "Reporting", w: 122, p: "64%", dark: false },
                  { n: "Integrations", w: 0, p: "Queued", dark: false },
                ].map((r, k) => (
                  <div key={r.n}>
                    <T c={s.t15} st={{ left: 48, top: 217 + k * 46 }}>{r.n}</T>
                    <div className={`${s.a} ${s.track}`} style={{ top: 224 + k * 46, width: 190 }} />
                    {r.w > 0 && <div className={`${s.a} ${s.fill}`} style={{ top: 224 + k * 46, width: r.w, background: r.dark ? "#0a0a0a" : "#fe6b1e" }} />}
                    <T
                      c={`${s.mono} ${s.pct}`}
                      st={{ left: r.p === "Queued" ? 428 : r.p === "64%" ? 450 : 443, top: 219 + k * 46, color: r.dark ? "#0a0a0a" : r.p === "Queued" ? "#9a9a95" : "#fe6b1e" }}
                    >
                      {r.p}
                    </T>
                    <R top={250 + k * 46} />
                  </div>
                ))}
                <div className={s.a} style={{ left: 48, top: 402, width: 424, height: 38, borderRadius: 10, background: "#f2f1ec" }}>
                  <Img src="dot" st={{ left: 16, top: 16, width: 6, height: 6 }} />
                  <T c="" st={{ left: 32, top: 10, fontWeight: 500, fontSize: 14, color: "#0a0a0a", lineHeight: "normal" }}>Live demo every second Friday</T>
                  <T c={s.mono} st={{ left: 342, top: 12, fontSize: 11, color: "#9a9a95", lineHeight: "normal" }}>Next · Fri</T>
                </div>
                {shade(2)}
              </div>

              {/* Page 2 */}
              <div className={s.page} {...fig("p2", POSE.p2)}>
                <Head n="02" title="Test before committing" body="Prototypes and technical checks before the full build." />
                <div className={s.a} style={{ left: 48, top: 176, width: 424, height: 116, borderRadius: 12, background: "#f9f8f5", border: "1px solid #d6d6d1", overflow: "hidden" }}>
                  <div className={s.a} style={{ left: -1, top: -1, width: 424, height: 28, background: "#f2f1ec" }} />
                  {[11, 23, 35].map((l) => (
                    <Img key={l} src="window-dot" st={{ left: l, top: 10, width: 6, height: 6 }} />
                  ))}
                  <div className={s.a} style={{ left: 59, top: 6, width: 150, height: 14, borderRadius: 7, background: "#fff" }} />
                  <T c="" st={{ left: 15, top: 41, fontWeight: 500, fontSize: 13, color: "#0a0a0a", lineHeight: "normal" }}>New order</T>
                  <div className={s.a} style={{ left: 15, top: 67, width: 210, height: 8, borderRadius: 4, background: "#d6d6d1" }} />
                  <div className={s.a} style={{ left: 15, top: 85, width: 150, height: 8, borderRadius: 4, background: "#d6d6d1" }} />
                  <div className={s.a} style={{ left: 295, top: 59, width: 112, height: 32, borderRadius: 6, background: "#fe6b1e" }}>
                    <T c="" st={{ left: 15.5, top: 8.5, fontWeight: 500, fontSize: 12, color: "#fff", lineHeight: "normal" }}>Approve order</T>
                  </div>
                  <Img src="cursor" st={{ left: 397, top: 81, width: 16, height: 20 }} />
                </div>
                <T c={`${s.mono} ${s.label}`} st={{ top: 312 }}>Assumptions tested</T>
                <R top={334} />
                {[
                  { t: "Orders sync without manual entry", v: true },
                  { t: "Team completes the task unaided", v: true },
                  { t: "Legacy system handles the load", v: false },
                ].map((r, k) => (
                  <div key={r.t}>
                    <T c={s.t15} st={{ left: 48, top: 341 + k * 32 }}>{r.t}</T>
                    {r.v ? (
                      <div className={s.pill} style={{ left: 397, top: 339 + k * 32, width: 75, background: "#0a0a0a" }}>
                        <span className={s.pillText} style={{ left: 11, top: 3.5, color: "#fff" }}>Validated</span>
                      </div>
                    ) : (
                      <div className={s.pill} style={{ left: 408, top: 339 + k * 32, width: 64, border: "1px solid #fe6b1e" }}>
                        <span className={s.pillText} style={{ left: 10, top: 2.5, color: "#fe6b1e" }}>Testing</span>
                      </div>
                    )}
                    <R top={366 + k * 32} />
                  </div>
                ))}
                {shade(1)}
              </div>

              {/* Page 1 */}
              <div className={s.page} {...fig("p1", POSE.p1)}>
                <Head n="01" title="Understand the business" body="We map how your team works and where it slows down." />
                {[
                  { n: "Orders", l: 48, x: 20.5 },
                  { n: "Sheets", l: 161, x: 20.5 },
                  { n: "Email", l: 274, x: 24.5 },
                  { n: "Reports", l: 387, x: 17.5 },
                ].map((n) => (
                  <div key={n.n} className={`${s.a} ${s.node}`} style={{ left: n.l }}>
                    <span style={{ left: n.x }}>{n.n}</span>
                  </div>
                ))}
                <Img src="arrow-a" st={{ left: 137.5, top: 197, width: 20, height: 10 }} />
                <Img src="arrow-b" st={{ left: 250.5, top: 197, width: 20, height: 10 }} />
                <Img src="arrow-a" st={{ left: 363.5, top: 197, width: 20, height: 10 }} />
                <Img src="dot" st={{ left: 196, top: 238, width: 6, height: 6 }} />
                <T c={s.mono} st={{ left: 208, top: 233, fontSize: 11, letterSpacing: 0.66, color: "#fe6b1e", lineHeight: "normal" }}>Re-keyed by hand</T>
                <R top={276} />
                {["Goals and success measures", "Bottlenecks and manual handoffs", "Existing tools and constraints"].map((x, k) => (
                  <div key={x}>
                    <T c={s.mono} st={{ left: 48, top: 289 + k * 38, fontSize: 11, color: "#fe6b1e", lineHeight: "normal" }}>{`0${k + 1}`}</T>
                    <T c={s.t15} st={{ left: 84, top: 284 + k * 38 }}>{x}</T>
                    <R top={314 + k * 38} />
                  </div>
                ))}
                <div className={s.chip} style={{ left: 48, top: 406, width: 196, height: 30 }}>
                  <Img src="dot" st={{ left: 12, top: 12, width: 6, height: 6 }} />
                  <T c="" st={{ left: 26, top: 6, fontWeight: 500, fontSize: 13, color: "#0a0a0a", lineHeight: "normal" }}>Output · Process map</T>
                </div>
                {shade(0)}
              </div>
            </div>

            <div className={s.progress} {...fig("line")} />
          </div>
        </div>
      </div>
    </section>
  );
}
