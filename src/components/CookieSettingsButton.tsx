"use client";

/** Footer legal-bar "Cookie settings" link: opens the cookie preferences panel (see CookieConsent). */
export default function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("cookie:open"))}
      style={{ font: "inherit", color: "inherit", padding: 0, whiteSpace: "pre", cursor: "pointer" }}
    >
      Cookie settings
    </button>
  );
}
