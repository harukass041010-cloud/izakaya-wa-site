import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeading } from "@/components/section";
import { buttonClasses } from "@/components/button";
import { menuContent } from "@/lib/content";
import { locations } from "@/lib/site";
import { MenuTabs } from "./menu-tabs";

export const metadata: Metadata = {
  title: menuContent.seo.title,
  description: menuContent.seo.description,
  alternates: { canonical: "/menu" },
};

export default function MenuPage() {
  const { hero, notice, locationNote, menus, cta } = menuContent;

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        intro={hero.intro}
        image={hero.image.src}
        imageAlt={hero.image.alt}
      />

      <MenuTabs menus={menus} notice={notice} locationNote={locationNote} />

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
