"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/container";
import { Photo } from "@/components/photo";
import { Eyebrow, Section } from "@/components/section";
import type { Dish, ImageRef, MenuTab } from "@/lib/content";

/* Varied shapes for the closing gallery, so it reads as a magazine spread
   rather than a uniform grid. */
const GALLERY_ASPECTS = [
  "aspect-[4/5]",
  "aspect-square",
  "aspect-[3/4]",
  "aspect-[4/3]",
];

function DishList({
  dishes,
  className,
}: {
  dishes: Dish[];
  className?: string;
}) {
  return (
    <ul className={cn("grid gap-x-12 gap-y-7 md:grid-cols-2", className)}>
      {dishes.map((dish) => (
        <li key={dish.name} className="flex flex-col gap-1.5">
          <div className="flex items-baseline gap-3">
            <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-lg font-medium">{dish.name}</span>
              {dish.japanese ? (
                <span className="font-display text-sm text-vermilion/60">
                  {dish.japanese}
                </span>
              ) : null}
            </span>
            <span
              aria-hidden
              className="mx-1 hidden h-px flex-1 self-center bg-ink/10 sm:block"
            />
            {dish.price ? (
              <span className="ml-auto shrink-0 text-base font-medium tabular-nums text-ink">
                {dish.price}
              </span>
            ) : null}
          </div>
          {dish.description ? (
            <p className="text-sm leading-relaxed text-clay">
              {dish.description}
            </p>
          ) : null}
          {dish.tags?.length ? (
            <p className="text-[0.7rem] uppercase tracking-[0.16em] text-shiso">
              {dish.tags.join(" · ")}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

/* A row of photos, about three across on wider screens. */
function PhotoRow({ photos }: { photos: ImageRef[] }) {
  if (!photos.length) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
      {photos.map((photo, index) => (
        <Photo
          key={`${photo.src}-${index}`}
          src={photo.src}
          alt={photo.alt}
          className="aspect-[4/3] rounded-2xl shadow-soft ring-1 ring-ink/5"
          sizes="(min-width: 640px) 30vw, 45vw"
        />
      ))}
    </div>
  );
}

/* The small photo grid that sits beside a section's dish list. Three across on
   phones; two across in the side column on desktop, with an odd last photo
   spanning the width. */
function SectionPhotos({ photos }: { photos: ImageRef[] }) {
  if (!photos.length) return null;

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:sticky lg:top-44 lg:grid-cols-2 lg:self-start">
      {photos.map((photo, index) => {
        const lastSpans =
          photos.length % 2 === 1 && index === photos.length - 1;
        return (
          <Photo
            key={`${photo.src}-${index}`}
            src={photo.src}
            alt={photo.alt}
            className={cn(
              "aspect-square rounded-xl shadow-soft ring-1 ring-ink/5",
              lastSpans && "lg:col-span-2 lg:aspect-[2/1]",
            )}
            sizes="(min-width: 1024px) 11rem, 33vw"
          />
        );
      })}
    </div>
  );
}

/* A closing gallery with mixed shapes, about three across. */
function PhotoGallery({ photos }: { photos: ImageRef[] }) {
  if (!photos.length) return null;

  return (
    <div className="columns-2 gap-3 sm:columns-3 sm:gap-4">
      {photos.map((photo, index) => (
        <div key={`${photo.src}-${index}`} className="mb-3 break-inside-avoid sm:mb-4">
          <Photo
            src={photo.src}
            alt={photo.alt}
            className={cn(
              "w-full rounded-2xl shadow-soft ring-1 ring-ink/5",
              GALLERY_ASPECTS[index % GALLERY_ASPECTS.length],
            )}
            sizes="(min-width: 640px) 30vw, 45vw"
          />
        </div>
      ))}
    </div>
  );
}

export function MenuTabs({
  menus,
  notice,
  locationNote,
}: {
  menus: MenuTab[];
  notice: { label: string; text: string };
  locationNote: string;
}) {
  const [activeId, setActiveId] = useState(menus[0]?.id ?? "");
  const active = menus.find((menu) => menu.id === activeId) ?? menus[0];

  if (!active) return null;

  const opening = active.openingPhotos ?? [];
  const gallery = active.galleryPhotos ?? [];

  return (
    <>
      {/* Meal tabs */}
      <div className="sticky top-20 z-30 border-b border-ink/10 bg-rice/95 backdrop-blur">
        <Container>
          <div
            role="tablist"
            aria-label="Choose a menu"
            className="flex gap-2 overflow-x-auto py-3"
          >
            {menus.map((menu) => {
              const isActive = menu.id === active.id;
              return (
                <button
                  key={menu.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveId(menu.id)}
                  className={cn(
                    "flex items-baseline gap-2 whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-vermilion text-rice shadow-soft"
                      : "text-clay hover:bg-ink/5 hover:text-vermilion",
                  )}
                >
                  {menu.label}
                  <span className="font-display text-xs opacity-70">
                    {menu.japanese}
                  </span>
                </button>
              );
            })}
          </div>
        </Container>
      </div>

      <Section tone="rice" className="py-12 sm:py-16">
        <div className="flex flex-col gap-4 rounded-2xl border border-vermilion/20 bg-vermilion/5 p-6 text-sm leading-relaxed text-clay sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-3xl">
            <span className="font-medium text-ink">{notice.label}</span>{" "}
            {notice.text}
          </p>
          <p className="shrink-0 text-xs font-medium uppercase tracking-[0.16em] text-vermilion">
            {locationNote}
          </p>
        </div>

        {/* Active menu heading */}
        <div className="mt-12 flex flex-col gap-3 border-b border-ink/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>{active.japanese}</Eyebrow>
            <h2 className="mt-3 text-3xl sm:text-4xl">{active.label}</h2>
          </div>
          <div className="sm:text-right">
            {active.hours ? (
              <p className="text-sm font-medium text-ink">{active.hours}</p>
            ) : null}
            {active.blurb ? (
              <p className="mt-1 max-w-md text-sm leading-relaxed text-clay">
                {active.blurb}
              </p>
            ) : null}
          </div>
        </div>

        {/* Opening photo grid */}
        {opening.length ? (
          <div className="mt-10">
            <PhotoRow photos={opening} />
          </div>
        ) : null}

        {/* Jump nav for the active menu */}
        <nav
          aria-label={`${active.label} sections`}
          className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink/10 pt-6 text-sm"
        >
          {active.sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="whitespace-nowrap text-clay transition-colors hover:text-vermilion"
            >
              {section.title}
            </a>
          ))}
        </nav>

        <div className="mt-16 space-y-20">
          {active.sections.map((section, index) => {
            const isOdd = index % 2 === 1;
            const sectionPhotos = section.photos ?? [];

            return (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-heading`}
                className="scroll-mt-44"
              >
                <div className="flex flex-col gap-4 border-b border-ink/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <Eyebrow>{section.japanese}</Eyebrow>
                    <h3
                      id={`${section.id}-heading`}
                      className="mt-3 text-2xl sm:text-3xl"
                    >
                      {section.title}
                    </h3>
                  </div>
                  {section.blurb ? (
                    <p className="max-w-md text-sm leading-relaxed text-clay">
                      {section.blurb}
                    </p>
                  ) : null}
                </div>

                <div
                  className={cn(
                    "mt-10 grid gap-10 lg:gap-12",
                    sectionPhotos.length > 0 &&
                      (isOdd
                        ? "lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]"
                        : "lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]"),
                  )}
                >
                  <DishList dishes={section.dishes} />
                  {sectionPhotos.length > 0 ? (
                    <div className={cn(isOdd && "lg:order-first")}>
                      <SectionPhotos photos={sectionPhotos} />
                    </div>
                  ) : null}
                </div>
              </section>
            );
          })}
        </div>

        {/* Closing gallery */}
        {gallery.length ? (
          <div className="mt-20 border-t border-ink/10 pt-14">
            <PhotoGallery photos={gallery} />
          </div>
        ) : null}
      </Section>
    </>
  );
}
