/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Footer from "@/components/Footer";
import styles from "./portfolio.module.css";
import PortfolioMotion from "./PortfolioMotion";
import HoloTilt from "./HoloTilt";

export const metadata = { title: "Portfolio — DYNA Digital Group" };

const DESC =
  "MindFull is a platform that helps entrepreneurs and creatives build personalized AI agents representing ";
const TITLE = "Interactive Design for AI product";
const HREF = "/case-study-ledgerline";

function Media({ src, k, large = false }: { src: string; k: string; large?: boolean }) {
  return (
    <div data-m={k} data-holo className={`${styles.media} ${large ? styles.mediaLg : ""}`}>
      <div className={styles.shot}>
        <img alt="" src={src} />
      </div>
      <div className={styles.sheen} />
      <div className={styles.chip}>
        <span>View project</span>
        <img alt="" src="/assets/portfolio/icon-arrow-up-right.svg" />
      </div>
    </div>
  );
}

function More() {
  return (
    <span className={styles.more}>
      <span>View projects</span>
      <img alt="" src="/assets/portfolio/arrow-orange.svg" />
    </span>
  );
}

export default function PortfolioPage() {
  return (
    <main id="top" className={styles.main}>
      <section className={`${styles.hero} frame`}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>
            <span data-m="h1a" className={styles.l1}>Work built around how</span>
            <span data-m="h1b" className={styles.l2}>businesses run.</span>
          </h1>
          <p data-m="lead" className={styles.heroLead}>
            Explore six illustrative case studies across operations, logistics, commerce and booking. Each starts with a
            business problem and shows how software or a digital product could address it.
          </p>
        </div>
      </section>

      <div className={styles.list}>
        <Link href={HREF} className={styles.card}>
          <Media k="m0" src="/assets/portfolio/shot-1.png" large />
          <div className={styles.textRow}>
            <div data-m="t0" className={styles.text}>
              <p className={styles.title}>{TITLE}</p>
              <p className={styles.desc}>{DESC}</p>
            </div>
            <More />
          </div>
        </Link>

        <div className={styles.grid}>
          {[2, 3, 4, 5].map((n) => (
            <Link key={n} href={HREF} className={`${styles.card} ${styles.cardSm}`}>
              <Media k={`m${n - 1}`} src={`/assets/portfolio/shot-${n}.png`} />
              <div data-m={`t${n - 1}`} className={styles.stack}>
                <div className={styles.text}>
                  <p className={styles.title}>{TITLE}</p>
                  <p className={styles.desc}>{DESC}</p>
                </div>
                <More />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
      <PortfolioMotion />
      <HoloTilt />
    </main>
  );
}
