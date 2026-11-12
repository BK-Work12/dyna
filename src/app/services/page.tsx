import type { CSSProperties } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import MotionRoot from "@/components/motion/MotionRoot";
import Icon from "./Icon";
import Spotlight from "./Spotlight";
import { digitalMotion, fourMotion, heroMotion } from "./motion";
import s from "./services.module.css";

export const metadata = { title: "Services — DYNA Digital Group" };

type CardData = { n: string; title: string; text: string; icon: string; span: number; featured?: boolean };
type Tech = { icon: string; bg: string; label: string };

function Card({ c, m }: { c: CardData; m: string }) {
  return (
    <article
      className={`${s.card} ${c.featured ? s.featured : ""}`}
      style={{ "--span": c.span } as CSSProperties}
      data-m={m}
      data-spot
    >
      <div className={s.cardTop}>
        <span className={s.iconTile}>
          <Icon name={c.icon} size={22} />
        </span>
        <span className={s.num}>{c.n}</span>
      </div>
      <div className={s.cardBody}>
        <h3 className={s.cardTitle}>{c.title}</h3>
        <p className={s.cardText}>{c.text}</p>
      </div>
    </article>
  );
}

function CtaButton() {
  return (
    <Link href="/discuss-a-project" className="btn-primary" data-m="btn">
      <span className="btn-primary__sweep" aria-hidden />
      <span className="btn-primary__label">Discuss a Project</span>
      <span className="btn-primary__slot" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="btn-primary__arrow" src="/assets/contact/arrow.svg" alt="" />
      </span>
    </Link>
  );
}

function Stack({ items }: { items: Tech[] }) {
  return (
    <div className={s.stackWrap}>
      <p className={s.stackLabel}>Typical stack</p>
      <ul className={s.stack}>
        {items.map((t) => (
          <li key={t.label} className={s.pill}>
            <span className={s.pillIcon} style={{ background: t.bg }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/assets/home/chip-${t.icon}.svg`} alt="" />
            </span>
            {t.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Aside({
  label,
  title,
  sub,
  intro,
  tech,
}: {
  label: string;
  title: string;
  sub: string;
  intro: string;
  tech: Tech[];
}) {
  return (
    <div className={s.aside}>
      <div className={s.label} data-m="label">
        <span className={s.marker} />
        <p className={s.labelText}>{label}</p>
      </div>
      <div data-m="title">
        <h2 className={s.title}>{title}</h2>
        <p className={s.sub}>{sub}</p>
      </div>
      <p className={s.intro} data-m="intro">
        {intro}
      </p>
      <Stack items={tech} />
    </div>
  );
}

function Closing({ text }: { text: string }) {
  return (
    <div className={s.closing}>
      <p className={s.closingText} data-m="closing">
        {text}
      </p>
      <CtaButton />
    </div>
  );
}

const digital: CardData[] = [
  { n: "01", title: "Product strategy & UX/UI", text: "Clear purpose, key journeys, usable interfaces.", icon: "layout-template", span: 3, featured: true },
  { n: "02", title: "Web products & customer portals", text: "Connected experiences for customers.", icon: "globe", span: 3 },
  { n: "03", title: "E-commerce & booking experiences", text: "From selection to checkout and what follows.", icon: "shopping-cart", span: 2 },
  { n: "04", title: "Prototyping", text: "Test assumptions before the full build.", icon: "flask-conical", span: 2 },
  { n: "05", title: "Design systems", text: "Consistent patterns as the product grows.", icon: "component", span: 2 },
];
const custom: CardData[] = [
  { n: "01", title: "Internal systems & operational platforms", text: "One connected workspace for a business process.", icon: "blocks", span: 6, featured: true },
  { n: "02", title: "Portals & business-critical web applications", text: "Defined access to information and tasks.", icon: "app-window", span: 2 },
  { n: "03", title: "Integrations & APIs", text: "Information moves between systems without re-entry.", icon: "plug", span: 2 },
  { n: "04", title: "Software architecture & scalability", text: "A foundation that grows with requirements.", icon: "network", span: 2 },
];
const ai: CardData[] = [
  { n: "01", title: "Workflow automation", text: "Routine work with fewer manual handoffs.", icon: "workflow", span: 3, featured: true },
  { n: "02", title: "AI-enabled business processes", text: "AI applied to defined information tasks.", icon: "sparkles", span: 3 },
  { n: "03", title: "Process orchestration", text: "Steps coordinated across systems.", icon: "git-merge", span: 3 },
  { n: "04", title: "Internal AI tools", text: "Focused tools for a specific task.", icon: "bot", span: 3 },
];

const techDigital: Tech[] = [
  { icon: "react", bg: "#149eca", label: "React" },
  { icon: "nextjs", bg: "#262626", label: "Next.js" },
  { icon: "tailwind", bg: "#06b6d4", label: "Tailwind" },
  { icon: "typescript", bg: "#3178c6", label: "TypeScript" },
];
const techCustom: Tech[] = [
  { icon: "laravel", bg: "#ff2d20", label: "Laravel" },
  { icon: "node", bg: "#3c873a", label: "Node.js" },
  { icon: "postgres", bg: "#336791", label: "PostgreSQL" },
  { icon: "docker", bg: "#2496ed", label: "Docker" },
];
const techAi: Tech[] = [
  { icon: "python", bg: "#3776ab", label: "Python" },
  { icon: "bot", bg: "#7c3aed", label: "AI agents" },
  { icon: "sparkles", bg: "#8b5cf6", label: "LLMs" },
  { icon: "docker", bg: "#2496ed", label: "Docker" },
];

const overview = [
  { n: "01", icon: "layout-template", title: "Digital Products", text: "Where your customers meet your company.", href: "#digital-products" },
  { n: "02", icon: "blocks", title: "Custom Software", text: "For the parts of your business no product was built for.", href: "#custom-software" },
  { n: "03", icon: "workflow", title: "AI & Business Automation", text: "Less manual work. Better-connected processes.", href: "#ai-automation" },
];
const metrics = [
  { v: "60+", l: "Products shipped" },
  { v: "12", l: "Industries served" },
  { v: "94%", l: "Clients who come back" },
];

export default function ServicesPage() {
  return (
    <main id="top">
      <Spotlight />
      <MotionRoot as="section" map={heroMotion} auto className={`${s.hero} frame`}>
        <div className={s.heroInner}>
          <h1 className={s.heroTitle}>
            <span className={s.heroLine1} data-m="h1a">
              What needs to change decides
            </span>
            <span className={s.heroLine2} data-m="h1b">
              what gets built.
            </span>
          </h1>
          <p className={s.heroLead} data-m="lead">
            Custom software, digital products and AI-enabled workflows, built around how businesses operate and the
            people they serve. Start with the challenge. We’ll help identify the right combination.
          </p>
          <div className={s.heroCtas} data-m="ctas">
            <Link href="/discuss-a-project" className="btn">
              <span>Discuss a project</span>
              <span>→</span>
            </Link>
            <a href="#digital-products" className={s.btnGhost}>
              Explore the capabilities ↓
            </a>
          </div>
          <dl className={s.metrics}>
            {metrics.map((m) => (
              <div key={m.l} className={s.metric}>
                <dt>{m.v}</dt>
                <dd>{m.l}</dd>
              </div>
            ))}
          </dl>
        </div>
        <nav className={s.overview} aria-label="Services">
          {overview.map((o) => (
            <a key={o.n} href={o.href} className={s.tile} data-spot>
              <span className={s.iconTile}>
                <Icon name={o.icon} size={22} />
              </span>
              <span className={s.tileText}>
                <span className={s.tileTop}>
                  <span className={s.num}>{o.n}</span>
                  <Icon name="arrow-up-right" size={18} className={s.tileArrow} />
                </span>
                <span className={s.tileTitle}>{o.title}</span>
                <span className={s.tileSub}>{o.text}</span>
              </span>
            </a>
          ))}
        </nav>
      </MotionRoot>

      <MotionRoot as="section" map={digitalMotion} id="digital-products" className={`${s.section} ${s.dark} frame`}>
        <div className={s.inner}>
          <Aside
            label="01 · DIGITAL PRODUCTS"
            title="Digital Products"
            sub="Where your customers meet your company."
            intro="A digital product has to make sense to the person using it and support the business behind it. DYNA brings design and engineering into the same decisions."
            tech={techDigital}
          />
          <div className={s.main}>
            <div className={s.bento}>
              {digital.map((c, i) => (
                <Card key={c.title} c={c} m={`c${i}`} />
              ))}
            </div>
            <Closing text="A system that supports the operation, and a clearer way to work." />
          </div>
        </div>
      </MotionRoot>

      <MotionRoot as="section" map={fourMotion} id="custom-software" className={`${s.section} ${s.light} frame`}>
        <div className={s.inner}>
          <Aside
            label="02 · CUSTOM SOFTWARE"
            title="Custom Software"
            sub="For the parts of your business no product was built for."
            intro="Standard tools cover a lot. Custom software closes the gaps, giving a specific process, team or operation a system built around its requirements."
            tech={techCustom}
          />
          <div className={s.main}>
            <div className={s.bento}>
              {custom.map((c, i) => (
                <Card key={c.title} c={c} m={`c${i}`} />
              ))}
            </div>
            <Closing text="A system that supports the operation, and a clearer way to work." />
          </div>
        </div>
      </MotionRoot>

      <MotionRoot as="section" map={fourMotion} id="ai-automation" className={`${s.section} ${s.dark} frame`}>
        <div className={s.inner}>
          <Aside
            label="03 · AI & BUSINESS AUTOMATION"
            title="AI & Business Automation"
            sub="Less manual work. Better-connected processes."
            intro="Some tasks follow clear rules. Others involve reading or interpreting information. DYNA finds where automation can carry a process and where AI can help people."
            tech={techAi}
          />
          <div className={s.main}>
            <div className={s.bento}>
              {ai.map((c, i) => (
                <Card key={c.title} c={c} m={`c${i}`} />
              ))}
            </div>
            <Closing text="The value comes from improving the work itself." />
          </div>
        </div>
      </MotionRoot>

      <div className={s.footerWrap}>
        <Footer />
      </div>
    </main>
  );
}
