import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/section";
import { PageHero } from "@/components/page-hero";
import { NaturalPhoto } from "@/components/natural-photo";
import { galleryContent, menuPhotoCredits } from "@/lib/content";

export const metadata: Metadata = {
  title: galleryContent.seo.title,
  description: galleryContent.seo.description,
  alternates: { canonical: "/gallery" },
};

/* Credits for any borrowed gallery photos plus the remaining placeholder menu
   photography, de-duplicated by source link. Restaurant photos have no credit
   fields, so they are skipped. */
const galleryCredits = galleryContent.photos.flatMap((photo) =>
  photo.credit && photo.href
    ? [
        {
          credit: photo.credit,
          license: photo.license ?? "",
          href: photo.href,
        },
      ]
    : [],
);

const allCredits = Array.from(
  new Map(
    [...galleryCredits, ...menuPhotoCredits].map((credit) => [
      credit.href,
      credit,
    ]),
  ).values(),
);

export default function GalleryPage() {
  const { hero, photos, credits } = galleryContent;

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
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {photos.map((photo) => (
            <figure
              key={photo.src}
              className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl shadow-soft"
            >
              <NaturalPhoto
                src={photo.src}
                alt={photo.alt}
                className="transition-transform duration-500 group-hover:scale-[1.05]"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
              {photo.credit ? (
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink/85 to-transparent p-4 text-xs text-rice/90 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {photo.credit}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      </Section>

      {allCredits.length ? (
        <Section id="credits" tone="paper" className="scroll-mt-24">
          <SectionHeading
            eyebrow={credits.eyebrow}
            title={credits.title}
            intro={credits.intro}
          />
          <ul className="mt-10 grid gap-x-12 gap-y-3 text-sm md:grid-cols-2">
            {allCredits.map((credit) => (
              <li
                key={credit.href}
                className="flex flex-col gap-0.5 border-b border-ink/10 py-2.5"
              >
                <a
                  href={credit.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink transition-colors hover:text-vermilion"
                >
                  {credit.credit}
                </a>
                <span className="text-xs uppercase tracking-[0.14em] text-clay">
                  {credit.license} · Wikimedia Commons
                </span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  );
}
