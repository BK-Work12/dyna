"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { smoothScrollToSelector } from "@/lib/smoothScroll";
import { fitWidth, MOBILE_MAX } from "@/lib/fitWidth";

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
  const [open, setOpen] = useState(false);

  // Mobile menu: close on route change / Escape / when growing past the mobile breakpoint; lock page scroll while open.
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => html.clientWidth > MOBILE_MAX && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

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
    <header className={`navbar${open ? " is-open" : ""}`} ref={bar}>
      <Link href="/" className="navbar__logo" aria-label="DYNA Digital Group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/contact/logo.svg" alt="" />
      </Link>
      <button
        type="button"
        className="navbar__toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="navbar-menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden />
        <span aria-hidden />
      </button>
      <nav className="navbar__links" id="navbar-menu">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={path === l.href ? "page" : undefined}
            onClick={(e) => {
              setOpen(false);
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
          setOpen(false);
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
