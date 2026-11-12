"use client";
import { useEffect } from "react";

/**
 * Holographic tilt (adapted from the "holo card" CodePen): while the pointer is over an image card, write its
 * position as --ratio-x / --ratio-y (-1..1, relative to the card centre). The CSS turns that into a 3D tilt
 * shifts nothing else. Mouse/trackpad only; reset on leave.
 */
export default function HoloTilt() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-holo]"));
    const cleanups = cards.map((el) => {
      const move = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const r = el.getBoundingClientRect();
        const hw = r.width / 2;
        const hh = r.height / 2;
        el.style.setProperty("--ratio-x", String(Math.max(-1.2, Math.min(1.2, (e.clientX - (r.x + hw)) / hw))));
        el.style.setProperty("--ratio-y", String(Math.max(-1.2, Math.min(1.2, (e.clientY - (r.y + hh)) / hh))));
      };
      const leave = () => {
        el.style.setProperty("--ratio-x", "0");
        el.style.setProperty("--ratio-y", "0");
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    });
    return () => cleanups.forEach((c) => c());
  }, []);
  return null;
}
