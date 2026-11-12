"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Figma "Footer Logo (slide-in)": MOUSE_ENTER on the footer -> State=Revealed (logo x 380 -> 80),
 * Smart Animate 0.4s EASE_OUT. No leave reaction, so it stays revealed.
 * Touch / no-hover devices reveal when the footer scrolls into view.
 */
export default function FooterLogo() {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const footer = ref.current?.closest("footer");
    if (!footer) return;
    const reveal = () => setRevealed(true);
    footer.addEventListener("mouseenter", reveal, { once: true });
    let io: IntersectionObserver | undefined;
    if (!window.matchMedia("(hover: hover)").matches) {
      io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          reveal();
          io?.disconnect();
        }
      }, { threshold: 0.4 });
      io.observe(footer);
    }
    return () => {
      footer.removeEventListener("mouseenter", reveal);
      io?.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={`footer__logo${revealed ? " is-revealed" : ""}`} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/contact/logo-large.svg" alt="" />
    </div>
  );
}
