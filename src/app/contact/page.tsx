import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Motion from "@/components/Motion";
import { CONTACT_COPY_TRACKS, CTA_TRACKS, H1_TRACKS, HERO_TIMELINE } from "@/components/heroMotion";

export const metadata = { title: "Contact — DYNA Digital Group" };

export default function ContactPage() {
  return (
    <main id="top">
      <section className="contact-hero frame">
        <div className="contact-hero__inner">
          <Motion as="h1" tracks={H1_TRACKS} timeline={HERO_TIMELINE}>
            What <em>Comes</em> Next
          </Motion>
          <Motion as="p" tracks={CONTACT_COPY_TRACKS} timeline={HERO_TIMELINE}>
            Whether you need workforce support or want to learn more about opportunities with Vital Workforce, contact
            our team using the details or form below.
          </Motion>
          <Motion tracks={CTA_TRACKS} timeline={HERO_TIMELINE}>
            <Link href="/discuss-a-project" className="btn">
              <span>Discuss a project</span>
              <span>→</span>
            </Link>
          </Motion>
        </div>
      </section>
      <ContactForm />
      <Footer />
    </main>
  );
}
