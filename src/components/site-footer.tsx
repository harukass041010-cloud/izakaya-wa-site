import Link from "next/link";
import { Container } from "@/components/container";
import { Logo } from "@/components/logo";
import { Seigaiha } from "@/components/seigaiha";
import {
  footerContent,
  fullAddress,
  labels,
  locations,
  nav,
  siteConfig,
} from "@/lib/site";

export function SiteFooter() {
  // Static export renders this once at build time; the year is baked into the HTML.
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink text-rice">
      <Seigaiha
        id="footer-waves"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 text-rice/[0.06]"
      />

      <Container className="relative py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1.4fr]">
          <div className="space-y-5">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-rice/60">
              {footerContent.blurb}
            </p>
            <div className="flex gap-4 text-sm">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rice/70 transition-colors hover:text-rice"
              >
                Instagram
              </a>
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rice/70 transition-colors hover:text-rice"
              >
                Facebook
              </a>
            </div>
          </div>

          <nav aria-label="Footer" className="space-y-3">
            <h2 className="text-xs uppercase tracking-[0.3em] text-rice/50">
              {labels.explore}
            </h2>
            <ul className="space-y-2.5 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-rice/75 transition-colors hover:text-rice"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/gallery#credits"
                  className="text-rice/75 transition-colors hover:text-rice"
                >
                  {labels.imageCredits}
                </Link>
              </li>
            </ul>
          </nav>

          <div className="grid gap-8 sm:grid-cols-2">
            {locations.map((location) => (
              <div key={location.id} className="space-y-2 text-sm">
                <h2 className="text-xs uppercase tracking-[0.3em] text-rice/50">
                  {location.name}
                </h2>
                <p className="text-rice/70">{fullAddress(location)}</p>
                <a
                  href={location.phoneHref}
                  className="block text-rice/90 transition-colors hover:text-vermilion"
                >
                  {location.phone}
                </a>
                <ul className="space-y-1 pt-1 text-rice/55">
                  {location.hours.map((row) => (
                    <li key={row.days}>
                      <span className="text-rice/75">{row.days}:</span>{" "}
                      {row.hours}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-rice/10 pt-6 text-xs text-rice/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="max-w-xl">{footerContent.note}</p>
        </div>
      </Container>
    </footer>
  );
}
