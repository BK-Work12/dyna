import Link from "next/link";
import ButtonPrimary from "./ButtonPrimary";
import NewsletterField from "./NewsletterField";
import FooterLogo from "./FooterLogo";
import CookieSettingsButton from "./CookieSettingsButton";

export default function Footer() {
  return (
    <footer className="footer frame">
      <FooterLogo />
      <div className="footer__rule" style={{ top: 0 }} />
      <p className="footer__title">Have a process worth fixing?</p>
      <p className="footer__sub">Tell us how it works today. We’ll reply within two working days.</p>
      <ButtonPrimary className="footer__cta" />
      <div className="footer__rule" style={{ top: 260 }} />

      <div className="footer__col" style={{ left: 80 }}>
        <h4>Sitemap</h4>
        <Link href="/portfolio">Portfolio</Link>
        <Link href="/services">Services</Link>
        <Link href="/approach">Approach</Link>
      </div>
      <div className="footer__col" style={{ left: 310 }}>
        <h4>Services</h4>
        <Link href="/services">Custom software</Link>
        <Link href="/services">Digital products</Link>
        <Link href="/services">AI &amp; automation</Link>
      </div>
      <div className="footer__col" style={{ left: 538 }}>
        <h4>Contact</h4>
        <p>hello@dynadigitalgroup.com</p>
        <p>+44 20 00  0000*</p>
        <p>London *</p>
      </div>
      <div className="footer__col" style={{ left: 846 }}>
        <h4>Follow</h4>
        <p>LinkedIn</p>
        <p>Instagram</p>
        <p>Dribbble</p>
        <p>GitHub</p>
      </div>
      <div className="footer__col" style={{ left: 1000 }}>
        <h4>Newsletter</h4>
      </div>
      <NewsletterField />

      <div className="footer__legal">
        <div className="footer__rule" />
        <span style={{ left: 80 }}>© 2026 DYNA Digital Group</span>
        <span style={{ left: 560 }}>{"Privacy      "}<CookieSettingsButton />{"      Terms"}</span>
        <a href="#top" style={{ right: 80 }}>Back to top ↑</a>
      </div>
    </footer>
  );
}
