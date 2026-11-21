"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/container";
import { NaturalPhoto } from "@/components/natural-photo";
import { Eyebrow, Section } from "@/components/section";
import type { Dish, ImageRef, MenuTab } from "@/lib/content";

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

/* A magazine-style row: each photo keeps its own shape, about three across on
   wider screens, so the whole dish stays in frame. */
function PhotoRow({ photos }: { photos: ImageRef[] }) {
  if (!photos.length) return null;

  return (
    <div className="columns-2 gap-3 sm:columns-3 sm:gap-4">
      {photos.map((photo, index) => (
        <div
          key={`${photo.src}-${index}`}
          className="mb-3 break-inside-avoid sm:mb-4"
        >
          <NaturalPhoto
            src={photo.src}
            alt={photo.alt}
            className="rounded-2xl shadow-soft ring-1 ring-ink/5"
            sizes="(min-width: 640px) 30vw, 45vw"
          />
        </div>
      ))}
    </div>
  );
}

/* A magazine-style photo grid shown below a section's dish list. Each photo
   keeps its own aspect ratio. Sections with many photos use more columns so
   the row stays wide instead of growing into a tall vertical strip. */
function SectionPhotos({ photos }: { photos: ImageRef[] }) {
  if (!photos.length) return null;

  const columns =
    photos.length > 3
      ? "columns-2 sm:columns-3 lg:columns-4"
      : "columns-2 sm:columns-3";

  return (
    <div className={cn(columns, "gap-3 sm:gap-4")}>
      {photos.map((photo, index) => (
        <div
          key={`${photo.src}-${index}`}
          className="mb-3 break-inside-avoid sm:mb-4"
        >
          <NaturalPhoto
            src={photo.src}
            alt={photo.alt}
            className="rounded-xl shadow-soft ring-1 ring-ink/5"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 30vw, 45vw"
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
          {active.sections.map((section) => {
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

                <DishList dishes={section.dishes} className="mt-10" />
                {sectionPhotos.length > 0 ? (
                  <div className="mt-10">
                    <SectionPhotos photos={sectionPhotos} />
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      </Section>
    </>
  );
}
