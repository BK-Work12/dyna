"use client";
import { useState } from "react";
import s from "./Reviews.module.css";

/* Figma "Reviews / Card Fan": State=Stacked ⇄ State=Spread. The invisible "Hover Area" rectangle has ON_HOVER →
   CHANGE_TO Spread, SMART_ANIMATE 0.8s, easing GENTLE (hover end reverts). In Spread every card is unrotated; these are
   the centre deltas (px) from each card's Stacked bounding-box centre to its Spread centre, read from the two variants. */
const SPREAD_SHIFT: Record<string, [number, number]> = {
  "A product customers compliment": [0, -24.5], // Review 2
  "They learned our business first": [-78.14, -165.49], // Review 1
  "Paid for itself in eleven weeks": [77.86, -190.49], // Review 3
  "Quotes in minutes, not days": [397.95, 191.5], // Review 6
  "Clinics that finally run on time": [-218.27, 73.54], // Review 4
  "Design and code finally match": [-200.31, 123.55], // Review 5
};

type Review = {
  title: string;
  body: string;
  brand: string;
  brandClass: string;
  name: string;
  role: string;
  avatar: string;
  /** wrapper box + rotation, taken from Figma (null = unrotated, absolutely positioned card) */
  box: { left: number; top: number; width: number; height: number; rotate: number } | null;
};

// DOM order = Figma layer order (bottom → top)
const reviews: Review[] = [
  {
    title: "A product customers compliment",
    body: "They turned a process held together by spreadsheets and WhatsApp into an app our customers actually compliment us on.",
    brand: "Harbor",
    brandClass: s.brandHarbor,
    name: "Priya Shah",
    role: "Founder, Harbor Pay",
    avatar: "/assets/home/reviews-avatar-1.png",
    box: null,
  },
  {
    title: "They learned our business first",
    body: "DYNA spent a month inside our operations before writing a line of code. The platform they built is now how we run the network.",
    brand: "MERIDIAN",
    brandClass: s.brandMeridian,
    name: "Jo Mensah",
    role: "Operations Director, Meridian Logistics",
    avatar: "/assets/home/reviews-avatar-2.png",
    box: { left: 171.69, top: 432.75, width: 436.906, height: 456.482, rotate: -8 },
  },
  {
    title: "Paid for itself in eleven weeks",
    body: "The automation paid for itself in eleven weeks, and our finance team kept control of every single exception.",
    brand: "LEDGERLINE",
    brandClass: s.brandSemi,
    name: "Tom Reid",
    role: "CFO, Ledgerline",
    avatar: "/assets/home/reviews-avatar-3.png",
    box: { left: 833.77, top: 457.6, width: 432.731, height: 426.774, rotate: 8 },
  },
  {
    title: "Quotes in minutes, not days",
    body: "Our engineers quote on site and jobs schedule themselves. We stopped losing work to slower competitors.",
    brand: "fieldwork",
    brandClass: s.brandMono,
    name: "Omar Haddad",
    role: "Operations Manager, Fieldwork",
    avatar: "/assets/home/reviews-avatar-4.png",
    box: { left: 528.4, top: 541.71, width: 403.309, height: 398.578, rotate: -3 },
  },
  {
    title: "Clinics that finally run on time",
    body: "Patients check in on their phones and our rooms are booked properly. Admin time across our clinics is down by a third.",
    brand: "atlas clinics",
    brandClass: s.brandLight,
    name: "Dr. Daniel Okafor",
    role: "Clinical Director, Atlas Clinics",
    avatar: "/assets/home/reviews-avatar-5.png",
    box: { left: 290.17, top: 624.34, width: 480.206, height: 493.233, rotate: -16 },
  },
  {
    title: "Design and code finally match",
    body: "Their design system gave our four product teams one shared language. We now ship features in days, not sprints.",
    brand: "Northwind",
    brandClass: s.brandSemi,
    name: "Lena Fischer",
    role: "Head of Product, Northwind",
    avatar: "/assets/home/reviews-avatar-6.png",
    box: { left: 675.44, top: 609.98, width: 489.74, height: 501.938, rotate: 18 },
  },
];

function Card({ r }: { r: Review }) {
  return (
    <article className={s.card}>
      <p className={s.quote} aria-hidden>
        “
      </p>
      <h3 className={s.title}>{r.title}</h3>
      <p className={s.body}>{r.body}</p>
      <div className={s.rule} />
      <p className={`${s.brand} ${r.brandClass}`}>{r.brand}</p>
      <div className={s.person}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={s.avatar} src={r.avatar} alt="" width={36} height={36} />
        <div className={s.who}>
          <p className={s.name}>{r.name}</p>
          <p className={s.role}>{r.role}</p>
        </div>
      </div>
    </article>
  );
}

export default function Reviews() {
  const [spread, setSpread] = useState(false);
  return (
    <section className={`${s.section} frame ${spread ? s.spread : ""}`}>
      <h2 className={s.heading}>Trusted by the teams we build for</h2>
      <p className={s.rating}>
        <span className={s.stars}>★★★★★</span>
        {"   4.9 / 5 from 38 client reviews"}
      </p>
      <div className={s.fan}>
      {reviews.map((r) =>
        r.box ? (
          <div
            key={r.title}
            className={s.fanBox}
            style={
              {
                left: r.box.left,
                top: r.box.top,
                width: r.box.width,
                height: r.box.height,
                "--dx": `${SPREAD_SHIFT[r.title][0]}px`,
                "--dy": `${SPREAD_SHIFT[r.title][1]}px`,
                "--r": `${r.box.rotate}deg`,
              } as React.CSSProperties
            }
          >
            <div className={s.tilt}>
              <Card r={r} />
            </div>
          </div>
        ) : (
          <div
            key={r.title}
            className={s.front}
            style={{ "--dx": `${SPREAD_SHIFT[r.title][0]}px`, "--dy": `${SPREAD_SHIFT[r.title][1]}px` } as React.CSSProperties}
          >
            <Card r={r} />
          </div>
        ),
      )}
      </div>
      <div className={s.hoverArea} onMouseEnter={() => setSpread(true)} onMouseLeave={() => setSpread(false)} />
    </section>
  );
}
