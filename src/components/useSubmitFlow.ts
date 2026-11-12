"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Figma "Contact / Discuss Form — Submit Flow" component set:
 *   Form --(click, 0.25s)--> Sending --(after 1.0s, 0.8s ease-in-out)--> Closing
 *        --(after 0.2s, 0.5s cubic(.22,1,.36,1))--> ThankYou
 * Visuals per phase live in globals.css under `.flow[data-phase=...]`.
 */
export type FlowPhase = "form" | "sending" | "closing" | "thanks";

export function useSubmitFlow() {
  const [phase, setPhase] = useState<FlowPhase>("form");
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  useEffect(() => clear, []);

  const submit = useCallback(() => {
    if (phase !== "form") return;
    clear();
    setPhase("sending");
    timers.current.push(
      window.setTimeout(() => {
        setPhase("closing");
        timers.current.push(window.setTimeout(() => setPhase("thanks"), 200));
      }, 1000),
    );
  }, [phase]);

  const reset = useCallback(() => {
    clear();
    setPhase("form");
  }, []);

  return { phase, submit, reset };
}
