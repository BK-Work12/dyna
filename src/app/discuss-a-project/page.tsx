import Footer from "@/components/Footer";
import Motion from "@/components/Motion";
import ScrollLink from "@/components/ScrollLink";
import { CTA_TRACKS, DISCUSS_COPY_TRACKS, H1_TRACKS, HERO_TIMELINE } from "@/components/heroMotion";
import DiscussForm from "./DiscussForm";

export const metadata = { title: "Discuss a project — DYNA Digital Group" };

export default function DiscussAProjectPage() {
  return (
    <main id="top">
      <section className="contact-hero frame">
        <div className="contact-hero__inner">
          <Motion as="h1" tracks={H1_TRACKS} timeline={HERO_TIMELINE}>
            Discuss a <em>Project</em>
          </Motion>
          <Motion as="p" tracks={DISCUSS_COPY_TRACKS} timeline={HERO_TIMELINE}>
            Tell us what needs to work better. You don’t need a finished brief to start.
          </Motion>
          <Motion tracks={CTA_TRACKS} timeline={HERO_TIMELINE}>
            <ScrollLink to="#form" className="btn">
              <span>Discuss a project</span>
              <span>→</span>
            </ScrollLink>
          </Motion>
        </div>
      </section>
      <DiscussForm />
      <Footer />
    </main>
  );
}
