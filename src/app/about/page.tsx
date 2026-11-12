import type { Metadata } from "next";
import Link from "next/link";
import { Photo } from "@/components/photo";
import { Section, SectionHeading, Eyebrow } from "@/components/section";
import { Seigaiha } from "@/components/seigaiha";
import { LocationCard } from "@/components/location-card";
import { buttonClasses } from "@/components/button";
import { aboutContent } from "@/lib/content";
import { locations } from "@/lib/site";

export const metadata: Metadata = {
  title: aboutContent.seo.title,
  description: aboutContent.seo.description,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const { hero, story, values } = aboutContent;
  const [storyMain, storySmallA, storySmallB] = story.images;

  return (
    <>
      <div className="relative isolate overflow-hidden bg-ink">
        <Photo
          src={hero.image.src}
          alt={hero.image.alt}
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 h-full w-full"
          imageClassName="opacity-40"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/70 via-ink/85 to-ink"
        />
        <Seigaiha
          id="about-hero-waves"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-56 text-rice/[0.07]"
        />
        <div className="mx-auto w-full max-w-6xl px-6 pt-32 pb-16 text-rice sm:px-8 sm:pt-40 sm:pb-24">
          <Eyebrow className="text-gold">{hero.eyebrow}</Eyebrow>
          <h1 className="mt-5 max-w-3xl text-balance text-4xl leading-[1.1] sm:text-5xl md:text-6xl">
            {hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-rice/70">
            {hero.intro}
          </p>
        </div>
      </div>

      {/* Story */}
      <Section tone="rice">
        <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div>
            <Eyebrow>{story.eyebrow}</Eyebrow>
            <h2 className="mt-5 text-balance text-3xl leading-tight sm:text-4xl">
              {story.title}
            </h2>
            <div className="mt-6 space-y-4 text-pretty leading-relaxed text-clay">
              {story.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <dl className="mt-10 grid gap-6 sm:grid-cols-3">
              {story.stats.map((stat) => (
                <div key={stat.label} className="border-l-2 border-vermilion pl-4">
                  <dt className="font-display text-3xl text-ink">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-xs uppercase tracking-[0.18em] text-clay">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {storyMain ? (
              <Photo
                src={storyMain.src}
                alt={storyMain.alt}
                className="col-span-2 aspect-[4/3] rounded-2xl shadow-soft"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            ) : null}
            {storySmallA ? (
              <Photo
                src={storySmallA.src}
                alt={storySmallA.alt}
                className="aspect-square rounded-2xl shadow-soft"
                sizes="(min-width: 1024px) 20vw, 50vw"
              />
            ) : null}
            {storySmallB ? (
              <Photo
                src={storySmallB.src}
                alt={storySmallB.alt}
                className="aspect-square rounded-2xl shadow-soft"
                sizes="(min-width: 1024px) 20vw, 50vw"
              />
            ) : null}
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section tone="ink">
        <SectionHeading eyebrow={values.eyebrow} title={values.title} />
        <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {values.items.map((value, index) => (
            <div key={value.title} className="flex gap-5">
              <span className="font-display text-2xl text-gold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="space-y-2">
                <h3 className="text-xl text-rice">{value.title}</h3>
                <p className="text-sm leading-relaxed text-rice/65">
                  {value.copy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Locations */}
      <Section tone="rice">
        <SectionHeading
          eyebrow={aboutContent.locations.eyebrow}
          title={aboutContent.locations.title}
          intro={aboutContent.locations.intro}
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
        <div className="mt-10">
          <Link
            href={aboutContent.locations.cta.href}
            className={buttonClasses("outlineDark", "md")}
          >
            {aboutContent.locations.cta.label}
          </Link>
        </div>
      </Section>
    </>
  );
}
