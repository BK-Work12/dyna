"use client";

export default function NewsletterField() {
  return (
    <form className="footer__email" onSubmit={(e) => e.preventDefault()}>
      <input type="email" placeholder="Email address" aria-label="Email address" />
      <button type="submit" aria-label="Subscribe">→</button>
    </form>
  );
}
