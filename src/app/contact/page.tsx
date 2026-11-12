import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeading, Eyebrow } from "@/components/section";
import { HoursList } from "@/components/hours";
import { buttonClasses } from "@/components/button";
import { contactContent } from "@/lib/content";
import {
  fullAddress,
  locations,
  mapsEmbedHref,
  mapsHref,
  siteConfig,
} from "@/lib/site";

export const metadata: Metadata = {
  title: contactContent.seo.title,
  description: contactContent.seo.description,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const { hero, labels, social } = contactContent;

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
        <div className="space-y-16">
          {locations.map((location, index) => (
            <article
              key={location.id}
              className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14"
            >
              <div className={index % 2 === 1 ? "lg:order-2" : undefined}>
                <Eyebrow>{location.neighborhood}</Eyebrow>
                <h2 className="mt-4 text-3xl sm:text-4xl">{location.name}</h2>

                <dl className="mt-7 space-y-5 text-sm">
                  <div>
                    <dt className="text-xs uppercase tracking-[0.2em] text-clay">
                      {labels.address}
                    </dt>
                    <dd className="mt-1.5 text-base text-ink/85">
                      {fullAddress(location)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.2em] text-clay">
                      {labels.phone}
                    </dt>
                    <dd className="mt-1.5">
                      <a
                        href={location.phoneHref}
                        className="text-base font-medium text-vermilion hover:text-vermilion-dark"
                      >
                        {location.phone}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.2em] text-clay">
                      {labels.hours}
                    </dt>
                    <dd className="mt-2">
                      <HoursList location={location} />
                    </dd>
                  </div>
                </dl>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href={mapsHref(location)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClasses("primary", "md")}
                  >
                    {labels.directions}
                  </a>
                  <a
                    href={location.phoneHref}
                    className={buttonClasses("outlineDark", "md")}
                  >
                    {labels.reserve}
                  </a>
                </div>
              </div>

              <div className={index % 2 === 1 ? "lg:order-1" : undefined}>
                <iframe
                  title={`Map of Izakaya WA ${location.name}`}
                  src={mapsEmbedHref(location)}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-80 w-full rounded-2xl border border-ink/10 shadow-soft"
                />
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="paper">
        <SectionHeading
          eyebrow={social.eyebrow}
          title={social.title}
          intro={social.intro}
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-ink/10 bg-paper p-6 shadow-soft transition-shadow hover:shadow-lift"
          >
            <h3 className="text-lg">{social.instagramTitle}</h3>
            <p className="mt-1 text-sm text-clay">{social.instagramBody}</p>
          </a>
          <a
            href={siteConfig.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-ink/10 bg-paper p-6 shadow-soft transition-shadow hover:shadow-lift"
          >
            <h3 className="text-lg">{social.facebookTitle}</h3>
            <p className="mt-1 text-sm text-clay">{social.facebookBody}</p>
          </a>
          <a
            href={locations[0].phoneHref}
            className="rounded-2xl border border-ink/10 bg-paper p-6 shadow-soft transition-shadow hover:shadow-lift"
          >
            <h3 className="text-lg">{social.callTitle}</h3>
            <p className="mt-1 text-sm text-clay">
              {locations[0].phone} · {locations[1].phone}
            </p>
          </a>
        </div>
      </Section>
    </>
  );
}
