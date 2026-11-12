import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeading, Eyebrow } from "@/components/section";
import { buttonClasses } from "@/components/button";
import { menuContent } from "@/lib/content";
import { locations } from "@/lib/site";

export const metadata: Metadata = {
  title: menuContent.seo.title,
  description: menuContent.seo.description,
  alternates: { canonical: "/menu" },
};

export default function MenuPage() {
  const { hero, notice, sections, cta } = menuContent;

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        intro={hero.intro}
        image={hero.image.src}
        imageAlt={hero.image.alt}
      />

      {/* Jump nav */}
      <div className="sticky top-20 z-30 border-b border-ink/10 bg-rice/95 backdrop-blur">
        <Container>
          <nav
            aria-label="Menu sections"
            className="flex gap-6 overflow-x-auto py-4 text-sm"
          >
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="whitespace-nowrap text-clay transition-colors hover:text-vermilion"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </Container>
      </div>

      <Section tone="rice" className="py-16 sm:py-20">
        <div className="mb-12 rounded-2xl border border-vermilion/20 bg-vermilion/5 p-6 text-sm leading-relaxed text-clay">
          <p>
            <span className="font-medium text-ink">{notice.label}</span>{" "}
            {notice.text}
          </p>
        </div>

        <div className="space-y-20">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-heading`}
              className="scroll-mt-40"
            >
              <div className="flex flex-col gap-4 border-b border-ink/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <Eyebrow>{section.japanese}</Eyebrow>
                  <h2
                    id={`${section.id}-heading`}
                    className="mt-3 text-3xl sm:text-4xl"
                  >
                    {section.title}
                  </h2>
                </div>
                <p className="max-w-md text-sm leading-relaxed text-clay">
                  {section.blurb}
                </p>
              </div>

              <ul className="mt-8 grid gap-x-12 gap-y-7 md:grid-cols-2">
                {section.dishes.map((dish) => (
                  <li key={dish.name} className="flex flex-col gap-1.5">
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-lg font-medium">{dish.name}</h3>
                      {dish.japanese ? (
                        <span className="font-display text-sm text-vermilion/60">
                          {dish.japanese}
                        </span>
                      ) : null}
                      {dish.signature ? (
                        <span className="rounded-full border border-gold/50 px-2 py-0.5 text-[0.62rem] uppercase tracking-[0.18em] text-gold">
                          Signature
                        </span>
                      ) : null}
                      <span
                        aria-hidden
                        className="mx-1 hidden h-px flex-1 self-center bg-ink/10 sm:block"
                      />
                    </div>
                    <p className="text-sm leading-relaxed text-clay">
                      {dish.description}
                    </p>
                    {dish.tags?.length ? (
                      <p className="text-[0.7rem] uppercase tracking-[0.16em] text-shiso">
                        {dish.tags.join(" · ")}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Section>

      <Section tone="ink">
        <SectionHeading
          eyebrow={cta.eyebrow}
          title={cta.title}
          intro={cta.intro}
        />
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={locations[0].phoneHref}
            className={buttonClasses("primary", "lg")}
          >
            {cta.callLabels[0]} · {locations[0].phone}
          </a>
          <a
            href={locations[1].phoneHref}
            className={buttonClasses("outlineLight", "lg")}
          >
            {cta.callLabels[1]} · {locations[1].phone}
          </a>
          <Link href={cta.request.href} className={buttonClasses("light", "lg")}>
            {cta.request.label}
          </Link>
        </div>
      </Section>
    </>
  );
}
