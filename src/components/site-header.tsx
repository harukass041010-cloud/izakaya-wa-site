"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/container";
import { Logo } from "@/components/logo";
import { buttonClasses } from "@/components/button";
import { labels, locations, nav } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solid
          ? "border-b border-rice/10 bg-ink/95 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-20 items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative text-sm tracking-wide text-rice/80 transition-colors hover:text-rice",
                  active && "text-rice",
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-vermilion transition-transform duration-300",
                    active && "scale-x-100",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={locations[0].phoneHref}
            className="text-sm text-rice/70 transition-colors hover:text-rice"
          >
            {locations[0].phone}
          </a>
          <Link
            href="/reservations"
            className={buttonClasses("primary", "md")}
          >
            {labels.reserve}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="relative flex h-11 w-11 items-center justify-center rounded-full text-rice lg:hidden"
        >
          <span className="sr-only">Menu</span>
          <span
            aria-hidden
            className={cn(
              "absolute h-px w-6 bg-current transition-transform duration-300",
              open ? "rotate-45" : "-translate-y-1.5",
            )}
          />
          <span
            aria-hidden
            className={cn(
              "absolute h-px w-6 bg-current transition-transform duration-300",
              open ? "-rotate-45" : "translate-y-1.5",
            )}
          />
        </button>
      </Container>

      <div
        id="mobile-nav"
        className={cn(
          "overflow-hidden border-t border-rice/10 bg-ink transition-[max-height,opacity] duration-300 lg:hidden",
          open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <Container className="flex flex-col gap-1 py-6">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-rice/10 py-3.5 font-display text-2xl text-rice/90"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-5 flex flex-col gap-3">
            <Link
              href="/reservations"
              onClick={() => setOpen(false)}
              className={buttonClasses("primary", "lg")}
            >
              {labels.reserveTable}
            </Link>
            <div className="flex flex-wrap gap-x-5 gap-y-1 pt-1 text-sm text-rice/60">
              {locations.map((location) => (
                <a
                  key={location.id}
                  href={location.phoneHref}
                  className="hover:text-rice"
                >
                  {location.name}: {location.phone}
                </a>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
}
