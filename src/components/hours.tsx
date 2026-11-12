import { cn } from "@/lib/cn";
import type { Location } from "@/lib/site";

export function HoursList({
  location,
  tone = "light",
  className,
}: {
  location: Location;
  tone?: "light" | "dark";
  className?: string;
}) {
  const divider = tone === "light" ? "divide-ink/10" : "divide-rice/15";
  const muted = tone === "light" ? "text-clay" : "text-rice/65";

  return (
    <dl className={cn("divide-y", divider, className)}>
      {location.hours.map((row) => (
        <div
          key={row.days}
          className="flex items-baseline justify-between gap-6 py-2.5"
        >
          <dt className="text-sm font-medium">{row.days}</dt>
          <dd className={cn("text-right text-sm", muted)}>
            {row.hours}
            {row.note ? (
              <span className="mt-0.5 block text-xs opacity-70">
                {row.note}
              </span>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
