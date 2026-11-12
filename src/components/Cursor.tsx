"use client";
import { useEffect, useRef } from "react";

/**
 * Custom cursor: orange dot (instant) + trailing ring (eased).
 *  - links / buttons / [data-cursor]: ring grows and tints
 *  - links to a case study (or [data-cursor="view"]): ring becomes a filled "View" badge
 *  - text fields: custom cursor hides, native I-beam shows
 *  - buttons (.btn, .btn-primary) get a slight magnetic pull
 * Only active for a fine pointer (mouse/trackpad); touch devices keep their normal behaviour.
 */
const INTERACTIVE = "a, button, [role='button'], summary, label, [data-cursor]";
const FIELD = "input, textarea, select, [contenteditable='true']";
const MAGNET = ".btn, .btn-primary";

export default function Cursor() {
  const wrap = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    let x = -100, y = -100; // pointer
    let rx = x, ry = y; // ring (eased)
    let raf = 0;
    let magnet: HTMLElement | null = null;

    const loop = () => {
      const k = reduce ? 1 : 0.2;
      rx += (x - rx) * k;
      ry += (y - ry) * k;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.1 ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const setState = (s: string, text = "") => {
      wrap.current?.setAttribute("data-state", s);
      if (label.current) label.current.textContent = text;
    };

    const resetMagnet = () => {
      if (magnet) magnet.style.translate = "";
      magnet = null;
    };

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      wrap.current?.setAttribute("data-visible", "1");
      kick();
      const t = e.target as Element | null;
      if (!t || !t.closest) return;

      if (t.closest(FIELD)) {
        setState("field");
      } else {
        const el = t.closest<HTMLElement>(INTERACTIVE);
        if (el) {
          const href = el instanceof HTMLAnchorElement ? el.getAttribute("href") ?? "" : "";
          const view = el.dataset.cursor === "view" || href.startsWith("/case-study");
          setState(view ? "view" : "link", view ? "View" : "");
        } else {
          setState("idle");
        }
      }

      // magnetic pull
      const m = t.closest<HTMLElement>(MAGNET);
      if (m !== magnet) {
        resetMagnet();
        magnet = m;
      }
      if (m && !reduce) {
        const r = m.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        m.style.translate = `${(dx * 6).toFixed(2)}px ${(dy * 4).toFixed(2)}px`;
      }
    };
    const onDown = () => wrap.current?.setAttribute("data-down", "1");
    const onUp = () => wrap.current?.removeAttribute("data-down");
    const onLeave = () => {
      wrap.current?.removeAttribute("data-visible");
      resetMagnet();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
      resetMagnet();
      root.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div ref={wrap} className="cursor" data-state="idle" aria-hidden>
      <div ref={ring} className="cursor__ring">
        <span ref={label} className="cursor__label" />
      </div>
      <div ref={dot} className="cursor__dot" />
    </div>
  );
}
