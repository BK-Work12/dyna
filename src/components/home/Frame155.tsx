"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { playTracks, type Bezier, type Tracks } from "@/lib/figmaMotion";
import s from "./Frame155.module.css";

const A = "/assets/home/frame155-";

/* Figma manualKeyframeTracks for a domain row (Frame 155 → rows). Times are seconds on the Home timeline; each row
   is triggered when it scrolls into view, so its own start (0.4s, the first row's start in Figma) is used as t0. */
const E1: Bezier = [0.5, 0, 0.5, 1];
const E2: Bezier = [0.22, 1, 0.36, 1];
const V0 = 0.4;
const ROW_TIMELINE = 2.2;

function visualTracks(fromRight: boolean): Tracks {
  const sx = fromRight ? 560 : -560;
  const rot = fromRight ? -10 : 10;
  return {
    OPACITY: [{ t: V0, v: 0, e: E1 }, { t: V0 + 0.5, v: 1, e: E2 }],
    TRANSLATION_X: [{ t: V0, v: sx, e: E1 }, { t: V0 + 1.3, v: 0, e: E2 }],
    TRANSLATION_Y: [{ t: V0, v: 60, e: E1 }, { t: V0 + 1.3, v: 0, e: E2 }],
    ROTATION: [{ t: V0, v: rot, e: E1 }, { t: V0 + 1.4, v: 0, e: E2 }],
    SCALE_XY: [{ t: V0, v: { x: 0.88, y: 0.88 }, e: E1 }, { t: V0 + 1.3, v: { x: 1, y: 1 }, e: E2 }],
  };
}

function textTracks(index: number, dx: number): Tracks {
  // dot, title, subtitle, description, stack, link — each 0.08s after the previous, first at t0 + 0.25
  const b = V0 + 0.25 + index * 0.08;
  return {
    OPACITY: [{ t: b, v: 0, e: E1 }, { t: b + 0.6, v: 1, e: E2 }],
    TRANSLATION_X: [{ t: b, v: dx, e: E1 }, { t: b + 1, v: 0, e: E2 }],
  };
}

const TEXT_KEYS = ["dot", "title", "subtitle", "desc", "stack", "link"];

type Domain = {
  name: string;
  kind: string;
  desc: string;
  tech: string[];
  dot: string;
  image: string;
  visualRight: boolean;
  bg?: boolean; // shared background image under the picture
  ring?: boolean; // extra outline layer
  bordered?: boolean; // 1px visual border, layers offset by -1px
};

const domains: Domain[] = [
  {
    name: "MERN Stack",
    kind: "Development",
    desc: "Fast, modern web platforms and internal tools in one JavaScript stack — from API to interface.",
    tech: ["MongoDB", "Express", "React", "Node.js"],
    dot: "dot-1.svg",
    image: "mern.png",
    visualRight: false,
  },
  {
    name: "LAMP Stack",
    kind: "Framework",
    desc: "Proven, cost-efficient foundations for portals, e-commerce and business systems that need to last.",
    tech: ["Linux", "Apache", "MySQL", "PHP / Laravel"],
    dot: "dot-2.svg",
    image: "lamp.png",
    visualRight: true,
  },
  {
    name: "AI & Automation",
    kind: "Engineering",
    desc: "Assistants and workflows that read, decide and act — so your team stops doing the repetitive work.",
    tech: ["OpenAI", "LangChain", "n8n", "Python"],
    dot: "dot-3.svg",
    image: "ai.png",
    visualRight: false,
    bg: true,
  },
  {
    name: "Mobile & Cloud",
    kind: "Platforms",
    desc: "Native-feel apps for iOS and Android, shipped on cloud infrastructure that scales with you.",
    tech: ["React Native", "Flutter", "AWS", "Docker"],
    dot: "dot-5.svg",
    image: "mobile.png",
    visualRight: true,
    bordered: true,
  },
  {
    name: "Graphic & Design",
    kind: "Engineering",
    desc: "Assistants and workflows that read, decide and act — so your team stops doing the repetitive work.",
    tech: ["OpenAI", "LangChain", "n8n", "Python"],
    dot: "dot-6.svg",
    image: "design.png",
    visualRight: false,
    bg: true,
    ring: true,
  },
];

function ArrowLink({ children, href, m }: { children: string; href: string; m?: string }) {
  return (
    <Link href={href} className={s.link} data-m={m}>
      <span>{children}</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${A}arrow.svg`} alt="" />
      <i aria-hidden />
    </Link>
  );
}

function DomainRow({ d }: { d: Domain }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = ref.current;
    if (!row) return;
    const reveal = () => {
      const dx = d.visualRight ? -220 : 220; // text enters from the side opposite the visual
      const played = [
        playTracks(row.querySelector('[data-m="visual"]')!, visualTracks(d.visualRight), { timeline: ROW_TIMELINE }),
        ...TEXT_KEYS.map((k, i) => {
          const el = row.querySelector(`[data-m="${k}"]`);
          return el ? playTracks(el, textTracks(i, dx), { timeline: ROW_TIMELINE }) : null;
        }),
      ];
      row.removeAttribute("data-pre");
      return played;
    };
    if (typeof IntersectionObserver === "undefined") {
      reveal();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          reveal();
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(row);
    return () => io.disconnect();
  }, [d.visualRight]);

  return (
    <div className={s.row} ref={ref} data-pre>
      <div
        data-m="visual"
        className={`${s.visual} ${d.visualRight ? s.visualR : s.visualL} ${d.bordered ? s.visualBordered : ""}`}
      >
        {d.bg && (
          <div className={`${s.layer} ${s.layerBg}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${A}domain-bg.png`} alt="" />
          </div>
        )}
        {d.ring && <div className={`${s.layer} ${s.layerRing}`} />}
        <div className={s.layer}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${A}${d.image}`} alt="" />
        </div>
      </div>
      <div className={`${s.text} ${d.visualRight ? s.textL : s.textR}`}>
        <div className={s.dot} data-m="dot">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${A}${d.dot}`} alt="" />
        </div>
        <h3 className={s.name} data-m="title">
          {d.name}
        </h3>
        <p className={s.kind} data-m="subtitle">
          {d.kind}
        </p>
        <p className={s.desc} data-m="desc">
          {d.desc}
        </p>
        <div className={s.stack} data-m="stack">
          {d.tech.map((t) => (
            <span className={s.tech} key={t}>
              {t}
            </span>
          ))}
        </div>
        <ArrowLink href="/portfolio" m="link">
          View projects
        </ArrowLink>
      </div>
    </div>
  );
}

export default function Frame155() {
  return (
    <section className={`${s.section} frame`}>
      <div className={s.inner}>
        <div className={s.head}>
          <h2 className={s.title}>Domains of expertise</h2>
          <div className={s.headText}>
            <p className={s.lead}>
              The stacks and disciplines we use to design, build and run software end to end — chosen for your business,
              not our habits.
            </p>
            <ArrowLink href="/portfolio">View all work</ArrowLink>
          </div>
        </div>

        <div className={s.rows}>
          {domains.map((d) => (
            <DomainRow d={d} key={d.name} />
          ))}
        </div>
      </div>
    </section>
  );
}
