import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { Photo } from "@/components/photo";
import { HeroVisual } from "@/components/hero-visual";
import { Section, SectionHeading, Eyebrow } from "@/components/section";
import { Seigaiha } from "@/components/seigaiha";
import { SeasonalDecor, SeasonalRow } from "@/components/seasonal";
import { LocationCard } from "@/components/location-card";
import { buttonClasses } from "@/components/button";
import { featuredDishes, homeContent } from "@/lib/content";
import { highlights, locations } from "@/lib/site";

export const metadata: Metadata = {
  description: homeContent.seo.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const { hero, philosophy, signature, experience, cta } = homeContent;
  const [philosophyMain, philosophySmallA, philosophySmallB] =
    philosophy.images;

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[92svh] items-end overflow-hidden bg-ink text-rice lg:items-center">
        <HeroVisual
          src={hero.image.src}
          alt={hero.image.alt}
          video={hero.video}
        />
        {/* On phones the copy sits over the foot of the film, so darken upward. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/25 lg:hidden"
        />
        {/* On wide screens the copy sits left, so darken left-to-right and
            leave the portrait panel on the right vivid. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-ink/90 via-ink/45 to-transparent lg:block"
        />
        <SeasonalDecor className="-z-10" />
        <Seigaiha
          id="home-hero-waves"
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-56 text-rice/[0.07]"
        />

        <Container className="relative pt-32 pb-16 sm:pb-24 lg:py-24">
          <div className="lg:max-w-[34rem] xl:max-w-[40rem]">
            <Eyebrow className="text-gold">{hero.eyebrow}</Eyebrow>
            <h1 className="mt-6 max-w-4xl text-balance text-5xl leading-[1.05] sm:text-6xl xl:text-7xl">
              {hero.title}
            </h1>
            <p className="mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-rice/75 sm:text-xl">
              {hero.intro}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href={hero.primaryCta.href}
                className={buttonClasses("primary", "lg")}
              >
                {hero.primaryCta.label}
              </Link>
              <Link
                href={hero.secondaryCta.href}
                className={buttonClasses("outlineLight", "lg")}
              >
                {hero.secondaryCta.label}
              </Link>
            </div>

            <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-rice/15 pt-6 text-sm text-rice/60">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span aria-hidden className="h-1 w-1 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>

            <SeasonalRow className="mt-7" />
          </div>
        </Container>
      </section>

      {/* Philosophy */}
      <Section tone="rice">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <Eyebrow>{philosophy.eyebrow}</Eyebrow>
            <h2 className="mt-5 text-balance text-3xl leading-tight sm:text-4xl md:text-[2.75rem]">
              <span className="font-display text-vermilion">
                {philosophy.kanji}
              </span>{" "}
              {philosophy.title}
            </h2>
            <div className="mt-6 space-y-4 text-pretty leading-relaxed text-clay">
              {philosophy.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href={philosophy.cta.href}
                className={buttonClasses("outlineDark", "md")}
              >
                {philosophy.cta.label}
              </Link>
            </div>
          </div>

          <div className="order-1 grid grid-cols-2 gap-4 lg:order-2">
            {philosophyMain ? (
              <Photo
                src={philosophyMain.src}
                alt={philosophyMain.alt}
                className="col-span-2 aspect-[16/10] rounded-2xl shadow-soft"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            ) : null}
            {philosophySmallA ? (
              <Photo
                src={philosophySmallA.src}
                alt={philosophySmallA.alt}
                className="aspect-square rounded-2xl shadow-soft"
                sizes="(min-width: 1024px) 20vw, 50vw"
              />
            ) : null}
            {philosophySmallB ? (
              <Photo
                src={philosophySmallB.src}
                alt={philosophySmallB.alt}
                className="aspect-square rounded-2xl shadow-soft"
                sizes="(min-width: 1024px) 20vw, 50vw"
              />
            ) : null}
          </div>
        </div>
      </Section>

      {/* Signature dishes */}
      <Section tone="paper">
        <SectionHeading
          eyebrow={signature.eyebrow}
          title={signature.title}
          intro={signature.intro}
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredDishes.map((dish) => {
            const image = dish.image;
            if (!image) return null;
            return (
              <article
                key={dish.name}
                className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-paper shadow-soft transition-shadow duration-300 hover:shadow-lift"
              >
                <Photo
                  src={image.src}
                  alt={image.alt}
                  className="aspect-[4/3] w-full"
                  imageClassName="transition-transform duration-500 group-hover:scale-[1.04]"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
                <div className="flex flex-1 flex-col gap-2 p-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-xl">{dish.name}</h3>
                    {dish.japanese ? (
                      <span className="font-display text-sm text-vermilion/70">
                        {dish.japanese}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm leading-relaxed text-clay">
                    {dish.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
        <div className="mt-12">
          <Link
            href={signature.cta.href}
            className={buttonClasses("primary", "lg")}
          >
            {signature.cta.label}
          </Link>
        </div>
      </Section>

      {/* Experience */}
      <Section tone="ink">
        <SectionHeading
          eyebrow={experience.eyebrow}
          title={experience.title}
          intro={experience.intro}
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {experience.items.map((item) => (
            <article
              key={item.title}
              className="overflow-hidden rounded-2xl border border-rice/10 bg-charcoal"
            >
              <Photo
                src={item.image.src}
                alt={item.image.alt}
                className="aspect-[5/4] w-full"
                sizes="(min-width: 768px) 33vw, 100vw"
              />
              <div className="space-y-3 p-6">
                <span className="font-display text-sm text-gold">
                  {item.japanese}
                </span>
                <h3 className="text-xl text-rice">{item.title}</h3>
                <p className="text-sm leading-relaxed text-rice/65">
                  {item.copy}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Locations */}
      <Section tone="rice">
        <SectionHeading
          eyebrow={homeContent.locations.eyebrow}
          title={homeContent.locations.title}
          intro={homeContent.locations.intro}
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section tone="charcoal" className="relative overflow-hidden">
        <Seigaiha
          id="cta-waves"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 text-rice/[0.05]"
        />
        <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <Eyebrow className="text-gold">{cta.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-balance text-3xl leading-tight text-rice sm:text-4xl">
              {cta.title}
            </h2>
            <p className="mt-4 text-pretty text-rice/70">{cta.body}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={cta.primary.href} className={buttonClasses("primary", "lg")}>
              {cta.primary.label}
            </Link>
            <a
              href={locations[0].phoneHref}
              className={buttonClasses("outlineLight", "lg")}
            >
              {cta.secondary.label} {locations[0].phone}
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
