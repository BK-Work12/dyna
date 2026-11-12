"use client";
import { useState } from "react";
import { useSubmitFlow } from "./useSubmitFlow";

const interests = ["Custom Software", "Digital Products", "AI & Automation", "Not sure yet"];

export default function ContactForm() {
  const [interest, setInterest] = useState(interests[0]);
  const { phase, submit, reset } = useSubmitFlow();
  const sent = phase === "thanks";

  return (
    <section className="contact-form-section frame flow" data-phase={phase}>
      <form
        className="contact-card"
        inert={phase !== "form"}
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="contact-card__head">
          <p className="contact-card__eyebrow">SEND US A MESSAGE</p>
          <h2 className="contact-card__title">Tell us what comes next.</h2>
          <p className="contact-card__lead">Share a few details and we will reply within two working days.</p>
        </div>
        <div className="contact-row">
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input id="name" name="name" placeholder="Jane Cooper" required />
          </div>
          <div className="field">
            <label htmlFor="company">Company</label>
            <input id="company" name="company" placeholder="Acme Ltd" />
          </div>
        </div>
        <div className="contact-row">
          <div className="field">
            <label htmlFor="email">Work email</label>
            <input id="email" name="email" type="email" placeholder="jane@company.com" required />
          </div>
          <div className="field">
            <label htmlFor="phone">Phone (optional)</label>
            <input id="phone" name="phone" type="tel" placeholder="+44 20 0000 0000" />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span className="contact-card__label">I am interested in</span>
          <div className="chips">
            {interests.map((i) => (
              <button key={i} type="button" className="chip" aria-pressed={interest === i} onClick={() => setInterest(i)}>
                {i}
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <label htmlFor="message">How can we help?</label>
          <textarea id="message" name="message" placeholder="Tell us what happens today and what you would like to change." />
        </div>
        <p className="contact-card__note">DYNA will only use these details to reply to your enquiry.</p>
        <button type="submit" className="submit">
          <span>Send message</span>
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
