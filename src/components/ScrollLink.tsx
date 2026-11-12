"use client";
import type { ReactNode } from "react";
import { smoothScrollToSelector } from "@/lib/smoothScroll";

/** Anchor that performs Figma's SCROLL_TO (0.7s ease-in-out) to a selector on the same page. */
export default function ScrollLink({ to, className, children }: { to: string; className?: string; children: ReactNode }) {
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        if (smoothScrollToSelector(to)) e.preventDefault();
      }}
    >
      {children}
    </a>
  );
}
