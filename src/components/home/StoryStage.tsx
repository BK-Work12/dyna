"use client";
import s from "./StoryStage.module.css";

/**
 * Figma "Story Switch" nested component: State=Business (Today) <-> State=Build (With DYNA).
 * Click = SMART_ANIMATE, EASE_IN_AND_OUT, 0.6s. Layers with the same name tween (x/y/size/rotation/fill/opacity):
 *   Node 1..5   sticky notes <-> orange column headers (geometry, rotation, fill all tween)
 *   Sketch Grid / Sketch Arrows(+annotations)   visible -> fades out
 *   UI Chrome / Job Cards                       hidden  -> fades in
 * Component is 840x440, instanced at 1092x572 (x1.3). All numbers below are in the 1092x572 space.
 */

const gridX = Array.from({ length: 20 }, (_, i) => 52 * (i + 1));
const gridY = Array.from({ length: 10 }, (_, i) => 52 * (i + 1));

/** Figma x/y are the top-left of the *unrotated* node, rotated about that corner; return the centre. */
function centre(x: number, y: number, w: number, h: number, cssDeg: number) {
  const a = (cssDeg * Math.PI) / 180;
  const px = w / 2, py = h / 2;
  return { cx: x + px * Math.cos(a) - py * Math.sin(a), cy: y + px * Math.sin(a) + py * Math.cos(a) };
}

type NodeSpec = {
  biz: { x: number; y: number; deg: number; bg: string; title: string; meta: string };
  head: { x: number; title: string; meta: string; active?: boolean };
};
const NODES: NodeSpec[] = [
  { biz: { x: 39, y: 78, deg: 4, bg: "#f5f5f2", title: "Customer rings the office", meta: "~40 calls / day" }, head: { x: 26, title: "Intake", meta: "12 jobs" } },
  { biz: { x: 325, y: 52, deg: -3, bg: "#f5f5f2", title: "Quote typed up in Excel", meta: "3 days, avg." }, head: { x: 239.2, title: "Quoted", meta: "8 jobs", active: true } },
  { biz: { x: 611, y: 117, deg: 2.5, bg: "#f5f5f2", title: "Boss approves on WhatsApp", meta: "if he sees it" }, head: { x: 452.4, title: "Approved", meta: "5 jobs" } },
  { biz: { x: 390, y: 325, deg: -4, bg: "#f5f5f2", title: "Jobs written on the whiteboard", meta: "who has the van?" }, head: { x: 665.6, title: "Scheduled", meta: "9 jobs" } },
  { biz: { x: 728, y: 351, deg: 3, bg: "#d6d6d1", title: "Invoice… eventually", meta: "2–6 weeks" }, head: { x: 878.8, title: "Invoiced", meta: "31 jobs" } },
];
const BIZ_W = 221, BIZ_H = 156;
const HEAD_W = 197.6, HEAD_H = 72.8, HEAD_Y = 88.4;

const colX = [26, 239.2, 452.4, 665.6, 878.8];
const rowY = [176.8, 286, 395.2];
type Job = [number, number, string, string, string, boolean?];
const jobs: Job[] = [
  [0, 0, "JB-2201", "Hughes Dental", "Boiler service"],
  [0, 1, "JB-2198", "Marsh & Co.", "Rewire, unit 4"],
  [0, 2, "JB-2193", "St. Anne’s", "PAT testing"],
  [1, 0, "JB-2198", "Marsh & Co.", "Auto-quoted · 4 min", true],
  [1, 1, "JB-2193", "St. Anne’s", "PAT testing"],
  [2, 0, "JB-2193", "St. Anne’s", "PAT testing"],
  [2, 1, "JB-2190", "Kaur Foods", "Cold room fault"],
  [2, 2, "JB-2187", "Lane Estates", "Void clearance"],
  [3, 0, "JB-2190", "Kaur Foods", "Cold room fault"],
  [3, 1, "JB-2187", "Lane Estates", "Void clearance"],
  [4, 0, "JB-2187", "Lane Estates", "Void clearance"],
  [4, 1, "JB-2201", "Hughes Dental", "Boiler service"],
];

export default function StoryStage({ dyna }: { dyna: boolean }) {
  return (
    <>
      <div className={s.story} style={{ background: dyna ? "#f5f5ef" : "#edece5" }}>
        {/* Sketch Grid */}
        <div className={s.layer} style={{ opacity: dyna ? 0 : 1 }}>
          {gridX.map((x) => (
            <i key={`x${x}`} className={s.g} style={{ left: x, top: 0, width: 1.3, height: 572 }} />
          ))}
          {gridY.map((y) => (
            <i key={`y${y}`} className={s.g} style={{ left: 0, top: y, width: 1092, height: 1.3 }} />
          ))}
        </div>

        {/* UI Chrome */}
        <div className={s.layer} style={{ opacity: dyna ? 1 : 0 }}>
          <div className={s.appbar} />
          <i className={s.line} style={{ top: 62.4 }} />
          <span className={s.mono14} style={{ left: 26, top: 22.1 }}>◢ FIELDWORK</span>
          <span className={s.jobs}>{"Jobs  ·  Week 46"}</span>
          <span className={s.newjob}>+ New job</span>
          <i className={s.line} style={{ top: 514.8 }} />
          <span className={s.kpiL} style={{ left: 26 }}>QUOTE TIME</span>
          <span className={s.kpiV} style={{ left: 143 }}>3 days → 4 min</span>
          <span className={s.kpiL} style={{ left: 429 }}>INVOICE LAG</span>
          <span className={s.kpiV} style={{ left: 559 }}>6 wks → same day</span>
          <span className={s.kpiL} style={{ left: 988, color: "#fe6b1e" }}>● LIVE</span>
        </div>

        {/* Job Cards */}
        <div className={s.layer} style={{ opacity: dyna ? 1 : 0 }}>
          {jobs.map(([c, r, id, name, sub, hot], i) => (
            <div key={i} className={`${s.job} ${hot ? s.hot : ""}`} style={{ left: colX[c], top: rowY[r] }}>
              <span className={s.jid}>{id}</span>
              <span className={s.jname}>{name}</span>
              <span className={s.jsub}>{sub}</span>
            </div>
          ))}
        </div>

        {/* Sketch Arrows + annotations */}
        <div className={s.layer} style={{ opacity: dyna ? 0 : 1 }}>
          {["arrow1", "arrow2", "arrow3", "arrow4", "arrow5", "scribble"].map((a) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={a} className={s.full} src={`/assets/home/${a}.svg`} alt="" />
          ))}
          <span className={s.ital} style={{ left: 845, top: 267.8, fontSize: 18, color: "#9a9a95" }}>no audit trail</span>
          <span className={s.ital} style={{ left: 52, top: 429, fontSize: 18, color: "#9a9a95" }}>what if Dan is off sick?</span>
          <span className={s.ital} style={{ left: 260, top: 273, fontSize: 17, color: "#6e6e6a" }}>× 2 spreadsheets</span>
        </div>

        {/* Node 1..5 — same layers in both states; geometry, rotation and fill tween */}
        {NODES.map((n, i) => {
          const b = centre(n.biz.x, n.biz.y, BIZ_W, BIZ_H, n.biz.deg);
          const w = dyna ? HEAD_W : BIZ_W;
          const h = dyna ? HEAD_H : BIZ_H;
          const cx = dyna ? n.head.x + HEAD_W / 2 : b.cx;
          const cy = dyna ? HEAD_Y + HEAD_H / 2 : b.cy;
          return (
            <div
              key={i}
              className={s.node}
              style={{
                left: cx - w / 2,
                top: cy - h / 2,
                width: w,
                height: h,
                transform: `rotate(${dyna ? 0 : n.biz.deg}deg)`,
                background: dyna ? "#fe6b1e" : n.biz.bg,
              }}
            >
              <p className={s.bizT} style={{ opacity: dyna ? 0 : 1 }}>{n.biz.title}</p>
              <span className={s.bizM} style={{ opacity: dyna ? 0 : 1 }}>{n.biz.meta}</span>
              <p className={s.headT} style={{ opacity: dyna ? 1 : 0 }}>{n.head.title}</p>
              <span className={s.headM} style={{ opacity: dyna ? 1 : 0 }}>{n.head.meta}</span>
              {n.head.active && <i className={s.active} style={{ opacity: dyna ? 1 : 0 }} />}
            </div>
          );
        })}
      </div>

      {/* Story Progress — identical in both variants (Track 220, Fill 92) */}
      <div className={s.progress}>
        <i style={{ width: 220, background: "#3a3a38" }} />
        <i style={{ width: 92, background: "#fe6b1e" }} />
      </div>
    </>
  );
}
