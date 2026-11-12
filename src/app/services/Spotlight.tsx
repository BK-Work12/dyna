"use client";
import { useEffect } from "react";

/** Writes the pointer position into --mx / --my on every [data-spot] card so the CSS spotlight follows the mouse. */
export default function Spotlight() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-spot]"));
    const cleanups = cards.map((el) => {
      const move = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      };
      el.addEventListener("pointermove", move);
      return () => el.removeEventListener("pointermove", move);
    });
    return () => cleanups.forEach((c) => c());
  }, []);
  return null;
}
