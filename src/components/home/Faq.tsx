"use client";
import { useState } from "react";
import ButtonPrimary from "@/components/ButtonPrimary";
import s from "./Faq.module.css";

const items = [
  {
    q: "How do you price a project?",
    a: "Discovery is a fixed fee, usually two to three weeks. After that we quote each phase against a defined scope, so you always know the next commitment before you make it.",
  },
  {
    q: "How long does a typical build take?",
    a: "Most first releases ship in 12 to 20 weeks. We plan in two-week cycles and put working software in front of your team early.",
  },
  {
    q: "Can you work with our existing systems?",
    a: "Yes. Most of our work connects to tools you already run: ERPs, accounting, CRMs and spreadsheets. We map those during discovery.",
  },
  {
    q: "Who owns the code and IP?",
    a: "You do. Code, designs and documentation transfer to you on payment, and we work in your repositories from day one.",
  },
  {
    q: "Do you support the product after launch?",
    a: "We offer support and improvement plans with an uptime SLA, monitoring and a monthly roadmap review.",
  },
  {
    q: "Do you build AI into products?",
    a: "Where it earns its place. We use AI for document reading, triage and drafting, and keep people in control of decisions that matter.",
  },
];

export default function Faq() {
  // Figma: each FAQ Item toggles itself Open⇄Closed on click (SMART_ANIMATE 0.45s, bezier .65/0/.35/1);
  // items are independent, and FAQ 1 starts Open.
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <section className={`${s.section} frame`} aria-labelledby="faq-title">
      <h2 id="faq-title" className={s.title}>
        Before we begin
      </h2>
      <p className={s.lead}>Short answers to what most teams ask in the first call.</p>
      <p className={s.still}>Still have a question?</p>
      <div className={s.cta}>
        <ButtonPrimary />
      </div>

      <div className={s.list}>
        {items.map((item, i) => {
          const isOpen = open.has(i);
          return (
            <div key={item.q} className={`${s.item} ${isOpen ? s.itemOpen : ""}`}>
              <span className={s.hairline} aria-hidden />
              <button
                type="button"
                className={s.head}
                aria-expanded={isOpen}
                aria-controls={`faq-a-${i}`}
                onClick={() => toggle(i)}
              >
                <span className={s.index}>{String(i + 1).padStart(2, "0")}</span>
                <span className={s.question}>{item.q}</span>
                <span className={s.icon} aria-hidden>
                  <span className={s.h} />
                  <span className={s.v} />
                </span>
              </button>
              <p id={`faq-a-${i}`} className={s.answer} role="region" aria-hidden={!isOpen}>
                {item.a}
              </p>
            </div>
          );
        })}
        <span className={s.bottomRule} aria-hidden />
      </div>
    </section>
  );
}
