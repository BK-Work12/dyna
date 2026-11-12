import Link from "next/link";
import Footer from "@/components/Footer";
import s from "./case-study.module.css";
import CaseStudyMotion from "./CaseStudyMotion";

export const metadata = { title: "Ledgerline Invoice AI — DYNA Digital Group" };

const summary =
  "MindFull is a platform that helps entrepreneurs and creatives build personalized AI agents representing their expertise and style by using public data and manual inputs. These AI agents can be embedded on websites, create and teach courses, answer FAQs, and automate audience engagement. The platform features a chat-based AI mentor, a dashboard for training and uploading content, and tools for auto-generating courses and videos. MindFull is designed to support creatives, solopreneurs, and influencers in expanding their reach, brand, and impact through scalable AI-powered interactions.";

const icons = [
  { name: "AI chip", left: 64, top: 160, src: "glyph-ai-chip.svg" },
  { name: "Workflow nodes", left: 130, top: 285, src: "glyph-workflow.svg" },
  { name: "Database", left: 1300, top: 160, src: "glyph-database.svg" },
  { name: "Browser interface", left: 1234, top: 285, src: "glyph-browser.svg" },
];

export default function CaseStudyLedgerline() {
  return (
    <main id="top">
      <div className={`${s.stage} frame`}>
        <div className={s.glow} />

        <div data-m="bc" className={s.breadcrumb}>
          <Link href="/portfolio" className={s.back}>
            <span>←</span>
            <span>Back to all work</span>
          </Link>
          <p className={s.count}>Case study 01 of 06</p>
        </div>

        <div data-m="title" className={s.title}>
          <h1>Ledgerline Invoice AI</h1>
          <p>Purchasing, stock and finance sit in separate tools, so nobody sees the operation as one system.</p>
        </div>

        <div data-m="hero" className={s.hero}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/case-study/hero.png" alt="Ledgerline Invoice AI shown on laptop, tablet and phone" />
        </div>

        <section data-m="band0" data-band className={`${s.band} ${s.bandLight}`}>
          <div data-m="row0" className={s.bandRow}>
            <h2 data-statement className={s.heading}>Project Summary</h2>
            <p data-supporting className={s.body}>{summary}</p>
          </div>
        </section>

        <section data-m="band1" data-band className={`${s.band} ${s.bandDark}`}>
          <div data-m="row1" className={s.bandRow}>
            <p data-supporting className={s.body}>{summary}</p>
            <h2 data-statement className={s.heading}>Project Features</h2>
          </div>
        </section>

        {icons.map((i, n) => (
          <div key={i.name} data-m={`i${n}`} className={s.icon} style={{ left: i.left, top: i.top }} aria-hidden>
            <div className={s.iconBase} />
            <div className={s.iconTile} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={s.glyph} src={`/assets/case-study/${i.src}`} alt="" />
          </div>
        ))}
      </div>
      <div className={s.footerWrap}>
        <Footer />
      </div>
      <CaseStudyMotion />
    </main>
  );
}
