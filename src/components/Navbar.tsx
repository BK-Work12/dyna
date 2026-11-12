"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { smoothScrollToSelector } from "@/lib/smoothScroll";
import { fitWidth } from "@/lib/fitWidth";

const links = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/approach", label: "Approach" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const path = usePathname();
  const first = useRef(true);
  const bar = useRef<HTMLElement>(null);

  // Keep the 1440px design intact on narrower windows (scale instead of overlapping).
  useEffect(() => (bar.current ? fitWidth(bar.current) : undefined), []);

  // Figma page navigation = DISSOLVE 0.45s EASE_OUT: fade the new page in.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const main = document.querySelector("main");
    main?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 450, easing: "cubic-bezier(0,0,0.58,1)" });
  }, [path]);

  return (
    <header className="navbar" ref={bar}>
      <Link href="/" className="navbar__logo" aria-label="DYNA Digital Group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/contact/logo.svg" alt="" />
      </Link>
      <nav className="navbar__links">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={path === l.href ? "page" : undefined}
            onClick={(e) => {
              // Figma: Contact link on the Contact page = SCROLL_TO hero, 0.7s ease-in-out
              if (l.href === "/contact" && path === "/contact" && smoothScrollToSelector(".contact-hero")) e.preventDefault();
            }}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <Link
        href="/discuss-a-project"
        className="btn btn--sm"
        onClick={(e) => {
          // Figma: on the Discuss page the nav button = SCROLL_TO form, 0.7s ease-in-out
          if (path === "/discuss-a-project" && smoothScrollToSelector("#form")) e.preventDefault();
        }}
      >
        <span>Discuss a project</span>
        <span>→</span>
      </Link>
    </header>
  );
}
