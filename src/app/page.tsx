import Hero from "@/components/home/Hero";
import ProblemFix from "@/components/home/ProblemFix";
import TrustedBy from "@/components/home/TrustedBy";
import Manifesto from "@/components/home/Manifesto";
import Process from "@/components/home/Process";
import ServicesSection from "@/components/home/ServicesSection";
import Frame155 from "@/components/home/Frame155";
import Reviews from "@/components/home/Reviews";
import Faq from "@/components/home/Faq";
import Footer from "@/components/Footer";
import { homeFontVars } from "@/components/home/fonts";

export default function Home() {
  return (
    <main className={homeFontVars}>
      <Hero />
      <ProblemFix />
      <TrustedBy />
      <Manifesto />
      <Process />
      <ServicesSection />
      <Frame155 />
      <Reviews />
      <Faq />
      <Footer />
    </main>
  );
}
