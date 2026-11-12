import Link from "next/link";
import Footer from "@/components/Footer";
import MotionRoot from "@/components/motion/MotionRoot";
import { heroMotion, stepBase, stepMotion } from "./motion";
import styles from "./approach.module.css";

export const metadata = { title: "Approach — DYNA Digital Group" };

const steps = [
  { n: "01", left: 1022, title: "Understand before defining.", body: "We start with your goals, people, workflows and existing systems to establish what needs to change." },
  { n: "02", left: 993, title: "Test before committing.", body: "We examine the decisions that carry the most risk. Prototypes and technical checks help clarify the approach before the full build." },
  { n: "03", left: 988, title: "Build with visibility", body: "Work progresses in focused increments. You review working software, give feedback and understand what comes next." },
  { n: "04", left: 983, title: "Build quality in.", body: "Usability, security, performance and maintainability inform decisions throughout design and development." },
  { n: "05", left: 983, title: "Keep ownership clear.", body: "We agree priorities, explain trade-offs and define who makes each decision before release." },
  { n: "06", left: 983, title: "Release and move forward.", body: "We agree what happens after launch, whether that means handover, stabilization or further improvements." },
];

export default function ApproachPage() {
  return (
    <main id="top">
      <MotionRoot as="section" map={heroMotion} auto className="contact-hero frame">
        <div className="contact-hero__inner">
          <h1 data-m="h1">
            Discuss a <em>Project</em>
          </h1>
          <p data-m="lead">Tell us what needs to work better. You don’t need a finished brief to start.</p>
          <Link href="/discuss-a-project" className="btn" data-m="ctas">
            <span>Discuss a project</span>
            <span>→</span>
          </Link>
        </div>
      </MotionRoot>

      <section className={`${styles.section} frame`}>
        <div className={styles.intro}>
          <h2>Clarity before code. Continuity beyond launch.</h2>
          <p>One team around your challenge, from first conversation to running software.</p>
        </div>
        <div className={styles.grid}>
          <ol className={styles.steps}>
            {steps.map((s, i) => (
              <MotionRoot key={s.n} as="li" map={stepMotion[i]} base={stepBase[i]} threshold={0.3} className={styles.step}>
                <span className={styles.big} style={{ left: s.left }} aria-hidden data-m="big">
                  {s.n}
                </span>
                <p className={styles.index} data-m="index">
                  [{s.n}]
                </p>
                <h3 className={styles.title} data-m="title">
                  {s.title}
                </h3>
                <p className={styles.body} data-m="body">
                  {s.body}
                </p>
              </MotionRoot>
            ))}
          </ol>
        </div>
      </section>

      <Footer />
    </main>
  );
}
