import Link from "next/link";

export default function ButtonPrimary({ href = "/discuss-a-project", className = "" }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={`btn-primary ${className}`}>
      <span className="btn-primary__sweep" aria-hidden />
      <span className="btn-primary__label">Discuss a project</span>
      <span className="btn-primary__slot" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="btn-primary__arrow" src="/assets/contact/arrow.svg" alt="" />
      </span>
    </Link>
  );
}
