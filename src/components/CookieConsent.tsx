"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import s from "./CookieConsent.module.css";
import { geistMono } from "./home/fonts";

/**
 * Cookie consent — Figma page "Cookie Consent & Preferences", "Cookie Consent — Compact (Desktop)".
 * State machine (same states/transitions as the Figma prototype):
 *   hidden --0.3s--> default --Customize--> prefs --Back--> default
 *   default|prefs --Accept all / Reject / Save--> accepted --2.4s--> dismissed
 *   accepted --"Cookie settings" chip--> default      footer "Cookie settings" (window event "cookie:open") --> prefs
 * The choice is stored in localStorage; the banner only shows when nothing is stored, and never before the intro splash is gone.
 */
type State = "hidden" | "default" | "prefs" | "accepted" | "dismissed";
type Choice = { analytics: boolean; functional: boolean; marketing: boolean };

const KEY = "dyna-cookie-consent";
const OFF: Choice = { analytics: false, functional: false, marketing: false };
const ON: Choice = { analytics: true, functional: true, marketing: true };

function read(): Choice | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    return { analytics: !!v.analytics, functional: !!v.functional, marketing: !!v.marketing };
  } catch {
    return null;
  }
}
function write(c: Choice) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ v: 1, necessary: true, ...c, ts: Date.now() }));
  } catch {
    /* storage blocked: the choice just won't persist */
  }
  window.dispatchEvent(new CustomEvent("cookie:consent", { detail: { necessary: true, ...c } }));
}

const OPTIONS: { key: keyof Choice | "necessary"; title: string; text: string }[] = [
  { key: "necessary", title: "Strictly necessary", text: "Security, load balancing and remembering this choice. Always on." },
  { key: "analytics", title: "Analytics", text: "Anonymous usage data that shows us what to improve. Never sold." },
  { key: "functional", title: "Functional", text: "Remembers settings such as language and form details." },
  { key: "marketing", title: "Marketing", text: "Measures how our campaigns perform on other platforms." },
];

function Toggle({ on, locked, label, onChange }: { on: boolean; locked?: boolean; label: string; onChange?: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={locked}
      className={`${s.toggle} ${on ? s.toggleOn : ""} ${locked ? s.toggleLocked : ""}`}
      onClick={onChange}
    >
      <span className={s.knob} />
    </button>
  );
}

export default function CookieConsent() {
  const [state, setState] = useState<State>("hidden");
  const [choice, setChoice] = useState<Choice>(OFF);
  const stored = useRef(false); // a choice exists in storage
  const fromFooter = useRef(false); // preferences were opened from the footer link
  const timers = useRef<number[]>([]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  /** Save + show "Preferences saved", then dismiss after Figma's 2.4s AFTER_TIMEOUT. */
  const save = useCallback((c: Choice) => {
    write(c);
    stored.current = true;
    fromFooter.current = false;
    setChoice(c);
    setState("accepted");
    later(() => setState((cur) => (cur === "accepted" ? "dismissed" : cur)), 2400);
  }, []);

  useEffect(() => {
    const saved = read();
    stored.current = !!saved;
    if (saved) setChoice(saved);

    // wait for the intro splash to be gone (+0.6s), then Figma's 0.3s Hidden -> Default timeout
    const html = document.documentElement;
    let mo: MutationObserver | null = null;
    const start = () => {
      mo?.disconnect();
      if (saved) {
        setState("dismissed");
      } else {
        later(() => setState((cur) => (cur === "hidden" ? "default" : cur)), 600 + 300);
      }
    };
    if (!html.hasAttribute("data-intro")) start();
    else {
      mo = new MutationObserver(() => {
        if (!html.hasAttribute("data-intro")) start();
      });
      mo.observe(html, { attributes: true, attributeFilter: ["data-intro"] });
    }

    const open = () => {
      const c = read();
      if (c) setChoice(c);
      fromFooter.current = true;
      setState("prefs");
    };
    window.addEventListener("cookie:open", open);
    return () => {
      mo?.disconnect();
      window.removeEventListener("cookie:open", open);
      timers.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  // Esc closes the preferences panel
  useEffect(() => {
    if (state !== "prefs") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const back = () => {
    if (fromFooter.current && stored.current) {
      fromFooter.current = false;
      setState("dismissed");
    } else setState("default");
  };

  const flip = (k: keyof Choice) => setChoice((c) => ({ ...c, [k]: !c[k] }));
  const showCard = state === "default" || state === "prefs";

  return (
    <div className={`${s.root} ${geistMono.variable}`} data-state={state}>
      <section
        className={s.card}
        role="dialog"
        aria-label="Cookie preferences"
        aria-hidden={!showCard}
        inert={!showCard}
      >
        {/* ---- banner (State=Default) ---- */}
        <div className={s.banner}>
          <div className={s.eyebrow}>
            <span>{"COOKIES  /  PRIVACY"}</span>
            <i className={s.mark} />
          </div>
          <p className={s.body}>
            We use essential cookies to run this site and optional analytics to improve it. Your choice, change it any time.
          </p>
          <div className={s.actions}>
            <button type="button" className={`${s.btn} ${s.primary}`} onClick={() => save(ON)}>
              Accept all
            </button>
            <button type="button" className={`${s.btn} ${s.secondary}`} onClick={() => save(OFF)}>
              Reject non-essential
            </button>
            <button type="button" className={`${s.btn} ${s.text}`} onClick={() => setState("prefs")}>
              <span>Customize</span>
              <span className={s.arrow}>→</span>
            </button>
          </div>
        </div>

        {/* ---- preferences (State=Preferences) ---- */}
        <div className={s.prefs}>
          <div className={s.head}>
            <div className={s.eyebrow}>
              <span>{"COOKIES  /  PREFERENCES"}</span>
              <i className={s.mark} />
            </div>
            <h2 className={s.title}>Choose what we can use.</h2>
            <p className={s.intro}>
              Necessary cookies keep the site working. Everything else is optional and off until you say so.
            </p>
          </div>
          <div className={s.options}>
            {OPTIONS.map((o) => (
              <div key={o.key} className={s.option}>
                <div className={s.optText}>
                  <div className={s.optHead}>
                    <b>{o.title}</b>
                    {o.key === "necessary" && <span className={s.always}>ALWAYS ON</span>}
                  </div>
                  <p>{o.text}</p>
                </div>
                {o.key === "necessary" ? (
                  <Toggle on locked label={o.title} />
                ) : (
                  <Toggle on={choice[o.key]} label={o.title} onChange={() => flip(o.key as keyof Choice)} />
                )}
              </div>
            ))}
          </div>
          <div className={s.foot}>
            <button type="button" className={`${s.btn} ${s.text} ${s.back}`} onClick={back}>
              <span>← Back</span>
            </button>
            <span className={s.spacer} />
            <button type="button" className={`${s.btn} ${s.secondary}`} onClick={() => save(ON)}>
              Accept all
            </button>
            <button type="button" className={`${s.btn} ${s.primary}`} onClick={() => save(choice)}>
              Save preferences
            </button>
          </div>
        </div>
      </section>

      {/* ---- confirmation (State=Accepted / Dismissed) ---- */}
      <div className={s.saved} aria-live="polite" inert={state !== "accepted"}>
        <div className={s.toast} role="status">
          <span className={s.check}>✓</span>
          <span>Preferences saved</span>
        </div>
        <button type="button" className={s.reopen} onClick={() => setState("default")}>
          <i className={s.dot} />
          <span>COOKIE SETTINGS</span>
        </button>
      </div>
    </div>
  );
}
