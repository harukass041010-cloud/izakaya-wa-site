import { cn } from "@/lib/cn";
import { buttonClasses } from "@/components/button";
import { HoursList } from "@/components/hours";
import {
  fullAddress,
  mapsHref,
  type Location,
} from "@/lib/site";

export function LocationCard({
  location,
  className,
}: {
  location: Location;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "flex flex-col gap-6 rounded-2xl border border-ink/10 bg-paper p-7 shadow-soft",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl">{location.name}</h3>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-clay">
            {location.neighborhood}
          </p>
        </div>
        <span
          aria-hidden
          className="font-display text-3xl leading-none text-vermilion/25"
        >
          和
        </span>
      </header>

      <div className="space-y-1 text-sm">
        <p className="text-ink/80">{fullAddress(location)}</p>
        <a
          href={location.phoneHref}
          className="inline-block font-medium text-vermilion hover:text-vermilion-dark"
        >
          {location.phone}
        </a>
      </div>

      <HoursList location={location} />

      {location.note ? (
        <p className="text-xs text-clay">{location.note}</p>
      ) : null}

      <div className="mt-auto flex flex-wrap gap-3 pt-2">
        <a
          href={mapsHref(location)}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses("primary", "md")}
        >
          Directions
        </a>
        <a
          href={location.phoneHref}
          className={buttonClasses("outlineDark", "md")}
        >
          Call to reserve
        </a>
      </div>
    </article>
  );
}
