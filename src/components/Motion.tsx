"use client";
import { createElement, useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { playTracks, type Tracks } from "@/lib/figmaMotion";

type Props = {
  as?: ElementType;
  tracks: Tracks;
  /** Figma timeline length in seconds the keyframe times are measured against */
  timeline: number;
  delay?: number;
  loop?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

/** Plays Figma manual keyframe tracks on mount. Starts at the first opacity value to avoid a flash before hydration. */
export default function Motion({ as = "div", tracks, timeline, delay, loop, className, style, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const startOpacity = tracks.OPACITY?.[0]?.v as number | undefined;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const a = playTracks(el, tracks, { timeline, delay, loop });
    if (!a) el.style.opacity = "";
    return () => a?.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createElement(
    as,
    { ref, className, style: { ...style, ...(startOpacity !== undefined ? { opacity: startOpacity } : null) } },
    children,
  );
}
