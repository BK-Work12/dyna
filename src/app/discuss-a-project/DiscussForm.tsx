"use client";
import { useState } from "react";
import { useSubmitFlow } from "@/components/useSubmitFlow";
import s from "./discuss.module.css";

const options = [
  { title: "Custom Software", desc: "Software built around how your operation actually runs." },
  { title: "Digital Products", desc: "Products designed for the people using them and the business behind them." },
  {
    title: "AI & Business Automation",
    desc: "AI and automation applied where they remove manual work, connect systems and speed up decisions.",
  },
  { title: "Not sure yet", desc: "Describe the problem and we’ll help identify the right approach." },
];
const sizes = ["Focused improvement", "Larger programme", "New product or system", "Prefer to discuss"];

export default function DiscussForm() {
  const [need, setNeed] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const { phase, submit, reset } = useSubmitFlow();
  const sent = phase === "thanks";

  return (
    <section id="form" className={`contact-form-section frame flow ${s.section}`} data-phase={phase}>
      <form
        className={s.card}
        inert={phase !== "form"}
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className={s.step}>
          <div className={s.header}>
            <p className={s.eyebrow}>01 · THE CHALLENGE</p>
            <h2 className={s.title}>What are you trying to solve?</h2>
            <p className={s.lead}>Describe what happens today and what you’d like to change.</p>
          </div>
          <div className="field">
            <label htmlFor="better">What needs to work better?</label>
            <input
              id="better"
              name="better"
              placeholder="e.g. Our team re-enters orders across three systems. We need a connected process that reduces manual work."
            />
          </div>
          <div className={`field ${s.tall}`}>
            <label htmlFor="problem">What problem are you trying to solve?</label>
            <textarea
              id="problem"
              name="problem"
              placeholder="e.g. Orders are re-keyed between three systems and the team spends hours each week reconciling them."
            />
          </div>
        </div>

        <div className={s.rule} />

        <div className={s.stepTight}>
          <div className={s.header}>
            <p className={s.eyebrow}>02 · THE CAPABILITY</p>
            <h2 className={s.title}>Where might we help?</h2>
            <p className={s.lead}>Choose the closest fit. We can work out the right mix together.</p>
          </div>
          <div role="radiogroup" style={{ display: "contents" }}>
            {options.map((o) => (
              <button
                key={o.title}
                type="button"
                role="radio"
                aria-checked={need === o.title}
                className={s.option}
                onClick={() => setNeed(o.title)}
              >
                <span className={s.radio}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/discuss/radio.svg" alt="" />
                </span>
                <span className={s.optionText}>
                  <span className={s.optionTitle}>{o.title}</span>
                  <span className={s.optionDesc}>{o.desc}</span>
                </span>
              </button>
            ))}
          </div>
          <div className={s.size}>
            <span className={s.sizeLabel}>EXPECTED PROJECT SIZE — OPTIONAL</span>
            <div className="chips">
              {sizes.map((z) => (
                <button
                  key={z}
                  type="button"
                  className="chip"
                  aria-pressed={size === z}
                  onClick={() => setSize(size === z ? null : z)}
                >
                  {z}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={s.rule} />

        <div className={s.step}>
          <div className={s.header}>
            <p className={s.eyebrow}>03 · YOUR DETAILS</p>
            <h2 className={s.title}>Who should we reply to?</h2>
            <p className={s.lead}>Leave your contact details and anything else that would help us understand the work.</p>
          </div>
          <div className={`field ${s.short}`}>
            <label htmlFor="more">Anything else we should know?</label>
            <textarea
              id="more"
              name="more"
              placeholder="Anything that helps: existing systems, who will use it, timing, or documents you can share."
            />
          </div>
          <div className={s.row}>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" placeholder="Your name" required />
            </div>
            <div className="field">
              <label htmlFor="email">Work email</label>
              <input id="email" name="email" type="email" placeholder="name@company.example" required />
            </div>
            <div className="field">
              <label htmlFor="company">Company</label>
              <input id="company" name="company" placeholder="Company name" />
            </div>
          </div>
        </div>

        <button type="submit" className="submit">
          <span>Start the conversation</span>
          <span>→</span>
        </button>
      </form>

      <div className="scrim" onClick={reset} />
      <div className="popup" role="dialog" aria-modal="true" aria-hidden={!sent}>
        <div className="popup__badge">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/contact/check.svg" alt="" />
        </div>
        <h2>Thank You!</h2>
        <p>Your message has been received. We’ll be in touch soon.</p>
        <button type="button" className="popup__close" onClick={reset}>
          Close
        </button>
      </div>
    </section>
  );
}
