import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeading, Eyebrow } from "@/components/section";
import { HoursList } from "@/components/hours";
import { buttonClasses } from "@/components/button";
import { reservationsContent } from "@/lib/content";
import { fullAddress, locations } from "@/lib/site";
import { ReservationForm } from "./reservation-form";

export const metadata: Metadata = {
  title: reservationsContent.seo.title,
  description: reservationsContent.seo.description,
  alternates: { canonical: "/reservations" },
};

export default function ReservationsPage() {
  const { hero, intro, form, faqs, closing } = reservationsContent;

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        intro={hero.intro}
        image={hero.image.src}
        imageAlt={hero.image.alt}
      />

      <Section tone="rice">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Eyebrow>{intro.eyebrow}</Eyebrow>
            <h2 className="mt-5 text-3xl leading-tight sm:text-4xl">
              {intro.title}
            </h2>
            <p className="mt-5 text-pretty leading-relaxed text-clay">
              {intro.paragraph}
            </p>

            <div className="mt-8 space-y-6">
              {locations.map((location) => (
                <div
                  key={location.id}
                  className="rounded-2xl border border-ink/10 bg-paper p-6 shadow-soft"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl">{location.name}</h3>
                      <p className="mt-1 text-sm text-clay">
                        {fullAddress(location)}
                      </p>
                    </div>
                    <span
                      aria-hidden
                      className="font-display text-2xl text-vermilion/25"
                    >
                      和
                    </span>
                  </div>
                  <a
                    href={location.phoneHref}
                    className="mt-4 inline-block font-display text-2xl text-vermilion hover:text-vermilion-dark"
                  >
                    {location.phone}
                  </a>
                  <HoursList location={location} className="mt-4" />
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={locations[0].phoneHref}
                className={buttonClasses("primary", "md")}
              >
                Call {locations[0].name}
              </a>
              <a
                href={locations[1].phoneHref}
                className={buttonClasses("outlineDark", "md")}
              >
                Call {locations[1].name}
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-paper p-7 shadow-soft sm:p-9">
            <h2 className="text-2xl">{form.title}</h2>
            <p className="mt-2 mb-7 text-sm leading-relaxed text-clay">
              {form.intro}
            </p>
            <ReservationForm
              copy={form.copy}
              lunchTimes={form.lunchTimes}
              dinnerTimes={form.dinnerTimes}
            />
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <SectionHeading eyebrow="Good to know" title="Questions we hear often" />
        <div className="mt-12 grid gap-x-14 gap-y-8 md:grid-cols-2">
          {faqs.map((faq) => (
            <div key={faq.question} className="space-y-2">
              <h3 className="text-lg font-medium">{faq.question}</h3>
              <p className="text-sm leading-relaxed text-clay">{faq.answer}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="ink" className="py-16 sm:py-20">
        <Container className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl text-pretty text-rice/75">{closing.text}</p>
          <a
            href={locations[0].phoneHref}
            className={buttonClasses("primary", "lg")}
          >
            {closing.callPrefix} {locations[0].phone}
          </a>
        </Container>
      </Section>
    </>
  );
}
