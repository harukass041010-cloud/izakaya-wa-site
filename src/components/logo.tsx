import Link from "next/link";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/site";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 44"
      role="img"
      aria-label="Izakaya WA monogram"
      className={cn("h-10 w-10", className)}
    >
      <rect width="44" height="44" rx="12" fill="#b23a2e" />
      <g
        fill="none"
        stroke="#f5efe4"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M9 29c3.4-4.4 6.8-4.4 10.2 0" />
        <path d="M18.4 29c3.4-4.4 6.8-4.4 10.2 0" />
        <path d="M13.7 22c3.4-4.4 6.8-4.4 10.2 0" />
        <path d="M23.1 22c3.4-4.4 6.8-4.4 10.2 0" />
      </g>
    </svg>
  );
}

export function Logo({
  tone = "light",
  className,
  withWordmark = true,
}: {
  tone?: "light" | "dark";
  className?: string;
  withWordmark?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="Izakaya WA — home"
      className={cn("group flex items-center gap-3", className)}
    >
      <LogoMark className="h-9 w-9 shrink-0 transition-transform duration-300 group-hover:-rotate-3" />
      {withWordmark ? (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-display text-base tracking-[0.22em]",
              tone === "light" ? "text-rice" : "text-ink",
            )}
          >
            {siteConfig.logo.top}
          </span>
          <span
            className={cn(
              "mt-1 text-[0.58rem] uppercase tracking-[0.32em]",
              tone === "light" ? "text-rice/60" : "text-clay",
            )}
          >
            {siteConfig.logo.sub}
          </span>
        </span>
      ) : null}
    </Link>
  );
}
