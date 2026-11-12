import Link from "next/link";
import { Container } from "@/components/container";
import { Seigaiha } from "@/components/seigaiha";
import { buttonClasses } from "@/components/button";
import { nav, notFoundContent } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[85svh] items-center overflow-hidden bg-ink text-rice">
      <Seigaiha
        id="notfound-waves"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-56 text-rice/[0.06]"
      />
      <Container className="relative py-24">
        <p className="font-display text-sm uppercase tracking-[0.35em] text-gold">
          {notFoundContent.eyebrow}
        </p>
        <h1 className="mt-6 text-6xl leading-none sm:text-8xl">
          <span className="font-display text-vermilion">
            {notFoundContent.kanji}
          </span>{" "}
          {notFoundContent.code}
        </h1>
        <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-rice/70">
          {notFoundContent.message}
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            href={notFoundContent.primary.href}
            className={buttonClasses("primary", "lg")}
          >
            {notFoundContent.primary.label}
          </Link>
          <Link
            href={notFoundContent.secondary.href}
            className={buttonClasses("outlineLight", "lg")}
          >
            {notFoundContent.secondary.label}
          </Link>
        </div>
        <nav className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-rice/15 pt-6 text-sm text-rice/60">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-rice"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </section>
  );
}
