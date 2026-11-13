import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/*
  Four-season ornament for the home hero — 四季.

  `SeasonalRow` is the quiet caption that sits under the hero copy: one
  motif per season (sakura, young leaf, maple, snow). `SeasonalDecor` scatters
  the same motifs through the hero, drifting slowly; the drift is CSS-only and
  stops for visitors who prefer reduced motion.

  Everything here is ornamental: aria-hidden, non-interactive, low contrast.
*/

export type Season = "spring" | "summer" | "autumn" | "winter";

const KANJI: Record<Season, string> = {
  spring: "春",
  summer: "夏",
  autumn: "秋",
  winter: "冬",
};

const ENGLISH: Record<Season, string> = {
  spring: "Spring",
  summer: "Summer",
  autumn: "Autumn",
  winter: "Winter",
};

function Sakura({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <g fill="currentColor">
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse
            key={angle}
            cx="12"
            cy="6.6"
            rx="3.1"
            ry="4.5"
            transform={`rotate(${angle} 12 12)`}
          />
        ))}
      </g>
      <circle cx="12" cy="12" r="1.9" fill="var(--color-paper)" opacity="0.85" />
    </svg>
  );
}

function YoungLeaf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 2.6c4.8 2.4 6.9 6.3 6.9 10.1 0 5.2-3.5 9-6.9 9s-6.9-3.8-6.9-9c0-3.8 2.1-7.7 6.9-10.1z"
        fill="currentColor"
      />
      <path
        d="M12 4.8v15.4M12 9.2l3.6-2.2M12 12.6l4.2-2.5M12 16l3.6-2.1"
        fill="none"
        stroke="var(--color-paper)"
        strokeOpacity="0.45"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MapleLeaf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 2.3 13.2 6 16 4.2 15.2 7.5 19 6.7 16.5 9.4 20.7 10.7 16.7 12.5 19.5 15.1 15.6 14.9 16 18.3 13 16.5 12.6 21.7 11.4 21.7 11 16.5 8 18.3 8.4 14.9 4.5 15.1 7.3 12.5 3.3 10.7 7.5 9.4 5 6.7 8.8 7.5 8 4.2 10.8 6z"
        fill="currentColor"
      />
    </svg>
  );
}

function Snowflake({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    >
      {[0, 60, 120].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 12 12)`}>
          <line x1="12" y1="2.6" x2="12" y2="21.4" />
          <path d="M12 5.6 9.7 3.3M12 5.6l2.3-2.3M12 18.4l-2.3 2.3M12 18.4l2.3 2.3" />
        </g>
      ))}
    </svg>
  );
}

export function SeasonMotif({
  season,
  className,
}: {
  season: Season;
  className?: string;
}) {
  switch (season) {
    case "spring":
      return <Sakura className={className} />;
    case "summer":
      return <YoungLeaf className={className} />;
    case "autumn":
      return <MapleLeaf className={className} />;
    case "winter":
      return <Snowflake className={className} />;
  }
}

const ORDER: Season[] = ["spring", "summer", "autumn", "winter"];

/* Motif colours — blossom pink, shiso green, vermilion, pale snow. */
const TINT: Record<Season, string> = {
  spring: "text-[#e9a7b8]",
  summer: "text-shiso",
  autumn: "text-vermilion",
  winter: "text-rice",
};

/* The four seasons, spelled out under the hero copy. */
export function SeasonalRow({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "flex flex-wrap items-center gap-x-7 gap-y-3 text-rice/60",
        className,
      )}
    >
      {ORDER.map((season) => (
        <li key={season} className="flex items-center gap-2.5">
          <SeasonMotif
            season={season}
            className={cn("h-4 w-4 shrink-0", TINT[season])}
          />
          <span className="font-display text-base leading-none text-rice/85">
            {KANJI[season]}
          </span>
          <span className="text-[0.62rem] uppercase tracking-[0.28em] text-rice/40">
            {ENGLISH[season]}
          </span>
        </li>
      ))}
    </ul>
  );
}

/*
  Drifting motifs. Positions are fixed (no randomness, which would break
  static rendering); each gets its own size, colour, speed and sway.
*/
type Drift = {
  season: Season;
  style: CSSProperties;
  size: string;
  className?: string;
};

const DRIFTS: Drift[] = [
  {
    season: "spring",
    size: "h-6 w-6",
    style: { top: "14%", left: "4%", "--petal-o": 0.5, "--petal-dur": "19s", "--petal-delay": "-3s", "--petal-x": "30px", "--petal-r": "90deg" } as CSSProperties,
  },
  {
    season: "spring",
    size: "h-4 w-4",
    style: { top: "12%", left: "52%", "--petal-o": 0.4, "--petal-dur": "23s", "--petal-delay": "-11s", "--petal-x": "-24px", "--petal-r": "-70deg" } as CSSProperties,
  },
  {
    season: "summer",
    size: "h-6 w-6",
    style: { top: "58%", left: "7%", "--petal-o": 0.34, "--petal-dur": "21s", "--petal-delay": "-6s", "--petal-x": "22px", "--petal-r": "60deg" } as CSSProperties,
  },
  {
    season: "autumn",
    size: "h-6 w-6",
    style: { top: "22%", left: "88%", "--petal-o": 0.5, "--petal-dur": "18s", "--petal-delay": "-9s", "--petal-x": "-28px", "--petal-r": "-100deg" } as CSSProperties,
  },
  {
    season: "autumn",
    size: "h-4 w-4",
    style: { top: "70%", left: "60%", "--petal-o": 0.4, "--petal-dur": "24s", "--petal-delay": "-15s", "--petal-x": "34px", "--petal-r": "120deg" } as CSSProperties,
  },
  {
    season: "winter",
    size: "h-5 w-5",
    style: { top: "8%", left: "66%", "--petal-o": 0.45, "--petal-dur": "22s", "--petal-delay": "-4s", "--petal-x": "-18px", "--petal-r": "50deg" } as CSSProperties,
  },
  {
    season: "winter",
    size: "h-4 w-4",
    style: { top: "44%", left: "94%", "--petal-o": 0.4, "--petal-dur": "26s", "--petal-delay": "-18s", "--petal-x": "-22px", "--petal-r": "-60deg" } as CSSProperties,
  },
  {
    season: "spring",
    size: "h-5 w-5",
    style: { top: "78%", left: "34%", "--petal-o": 0.35, "--petal-dur": "25s", "--petal-delay": "-8s", "--petal-x": "26px", "--petal-r": "80deg" } as CSSProperties,
  },
];

export function SeasonalDecor({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {DRIFTS.map((drift, index) => (
        <span
          key={index}
          className={cn(
            "season-drift absolute block",
            drift.size,
            TINT[drift.season],
            drift.className,
          )}
          style={drift.style}
        >
          <SeasonMotif season={drift.season} className="h-full w-full" />
        </span>
      ))}
    </div>
  );
}
