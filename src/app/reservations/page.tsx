import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeading, Eyebrow } from "@/components/section";
import { HoursList } from "@/components/hours";
import { buttonClasses } from "@/components/button";
import { cn } from "@/lib/cn";
import { reservationsContent } from "@/lib/content";
import { fullAddress, locations } from "@/lib/site";
import { ReservationForm } from "./reservation-form";

export const metadata: Metadata = {
  title: reservationsContent.seo.title,
  description: reservationsContent.seo.description,
  alternates: { canonical: "/reservations" },
};

function PhoneMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

export default function ReservationsPage() {
  const { hero, phoneOnly, intro, form, faqs, closing } =
    reservationsContent;

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
        {/* Reservations are phone-only, so say it loudly and make calling easy. */}
        <div className="rounded-3xl border border-vermilion/25 bg-vermilion/[0.06] p-7 sm:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="inline-flex items-center gap-2 rounded-full bg-vermilion px-3.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-paper">
                <PhoneMark className="h-3.5 w-3.5" />
                {phoneOnly.badge}
              </p>
              <h2 className="mt-5 text-balance text-2xl leading-tight sm:text-3xl">
                {phoneOnly.title}
              </h2>
              <p className="mt-3 text-pretty leading-relaxed text-clay">
                {phoneOnly.text}
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 lg:min-w-[19rem]">
              {locations.map((location, index) => (
                <a
                  key={location.id}
                  href={location.phoneHref}
                  className={cn(
                    buttonClasses(index === 0 ? "primary" : "outlineDark", "lg"),
                    "w-full justify-center sm:justify-start",
                  )}
                >
                  <PhoneMark className="h-4 w-4 shrink-0" />
                  <span className="font-normal opacity-80">{location.name}</span>
                  <span className="font-display text-lg tracking-normal">
                    {location.phone}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
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
