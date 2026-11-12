"use client";
import { createElement, useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { playTracks, type TrackName, type Tracks } from "@/lib/figmaMotion";

/** key -> Figma tracks (absolute timeline seconds). Elements opt in with data-m="<key>". */
export type MotionMap = Record<string, Tracks>;

type Props = {
  map: MotionMap;
  /** seconds subtracted from every keyframe time (so a section starts when it scrolls into view) */
  base?: number;
  /** play on mount instead of waiting to scroll into view */
  auto?: boolean;
  threshold?: number;
  as?: "div" | "section" | "li" | "main";
  className?: string;
  id?: string;
  style?: CSSProperties;
  children: ReactNode;
};

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function rebase(t: Tracks, base: number) {
  let max = 0;
  const out: Tracks = {};
  for (const [k, kfs] of Object.entries(t) as [TrackName, NonNullable<Tracks[TrackName]>][]) {
    out[k] = kfs.map((f) => {
      const nt = Math.max(0, f.t - base);
      if (nt > max) max = nt;
      return { ...f, t: nt };
    });
  }
  return { tracks: out, len: Math.max(max, 0.001) };
}

/**
 * Plays Figma entrance tracks on descendants marked data-m. Animations are created paused (so the
 * first keyframe — e.g. opacity 0 — shows immediately) and started when the root scrolls into view.
 */
export default function MotionRoot({
  map,
  base = 0,
  auto = false,
  threshold = 0.2,
  as = "div",
  className,
  id,
  style,
  children,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useIso(() => {
    const root = ref.current;
    if (!root) return;
    const anims: Animation[] = [];
    for (const [key, tr] of Object.entries(map)) {
      const { tracks, len } = rebase(tr, base);
      root.querySelectorAll(`[data-m="${key}"]`).forEach((el) => {
        const a = playTracks(el, tracks, { timeline: len });
        if (a) {
          a.pause();
          anims.push(a);
        }
      });
    }
    if (!anims.length) return;
    const go = () => anims.forEach((a) => a.play());
    if (auto) {
      const raf = requestAnimationFrame(go);
      return () => {
        cancelAnimationFrame(raf);
        anims.forEach((a) => a.cancel());
      };
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          go();
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(root);
    return () => {
      io.disconnect();
      anims.forEach((a) => a.cancel());
    };
  }, [map, base, auto, threshold]);

  return createElement(as, { ref, className, id, style }, children);
}
