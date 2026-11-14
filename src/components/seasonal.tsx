import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/*
  Four-season ornament for the home hero — 四季.

  Two parts, both purely ornamental (aria-hidden, non-interactive, low
  contrast):

  - `SeasonalDecor` scatters sakura petals across the whole hero; they drift
    slowly down and swirl. The drift is CSS-only and stops for visitors who
    prefer reduced motion, who see the petals sitting still.
  - `SeasonalRow` is the quiet caption under the hero copy: one thin-line
    motif per season beside its kanji.
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

/*
  Thin-line season motifs. Drawn with strokes and no fills, so they read as
  drawn art rather than flat emoji.
*/

function Sakura({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {[0, 72, 144, 216, 288].map((angle) => (
        <path
          key={angle}
          d="M12 12c-1.5-2.6-1.7-5.2 0-6.8 1.7 1.6 1.5 4.2 0 6.8Z"
          transform={`rotate(${angle} 12 12)`}
        />
      ))}
      <circle cx="12" cy="12" r="1.2" />
    </svg>
  );
}

function YoungLeaf({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path d="M12 3c4.2 2.5 6.2 6 6.2 9.6 0 4.7-3.1 8.1-6.2 8.1s-6.2-3.4-6.2-8.1C5.8 9 7.8 5.5 12 3Z" />
      <path d="M12 4.8v14.6M12 9.4l3.2-2M12 12.8l3.7-2.3M12 16l3.2-1.9" />
    </svg>
  );
}

function MapleLeaf({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path d="M12 2.3 13.2 6 16 4.2 15.2 7.5 19 6.7 16.5 9.4 20.7 10.7 16.7 12.5 19.5 15.1 15.6 14.9 16 18.3 13 16.5 12.6 21.7 11.4 21.7 11 16.5 8 18.3 8.4 14.9 4.5 15.1 7.3 12.5 3.3 10.7 7.5 9.4 5 6.7 8.8 7.5 8 4.2 10.8 6Z" />
      <path d="M12 6.4v11" />
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
      strokeWidth="1.1"
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
  A single sakura petal: a soft pink gradient with one faint vein. The path
  carries the little notch at the petal's tip that makes a cherry blossom read
  as a cherry blossom.
*/
const PETAL_PATH =
  "M12 3.8C11.4 2.4 10.4 2 9.9 3 7.4 6 6.6 9.4 6.6 12.6 6.6 16.8 8.8 20 12 22.2 15.2 20 17.4 16.8 17.4 12.6 17.4 9.4 16.6 6 14.1 3 13.6 2 12.6 2.4 12 3.8Z";

function SakuraPetal({
  gradient,
  className,
}: {
  gradient: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d={PETAL_PATH} fill={`url(#${gradient})`} />
      <path
        d="M12 20.6V6.2M12 10.4l2.7-1.9M12 14l3-2.1M12 10.4 9.3 8.5M12 14 9 11.9"
        fill="none"
        stroke="var(--color-paper)"
        strokeOpacity="0.4"
        strokeWidth="0.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* Three petal tints — pale, mid, deep — defined once and shared by every petal. */
function PetalGradients() {
  return (
    <svg aria-hidden="true" className="absolute h-0 w-0">
      <defs>
        <linearGradient id="wa-petal-a" x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#fbdbe3" />
          <stop offset="100%" stopColor="#df8ba2" />
        </linearGradient>
        <linearGradient id="wa-petal-b" x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#fdeef2" />
          <stop offset="100%" stopColor="#eab0c1" />
        </linearGradient>
        <linearGradient id="wa-petal-c" x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#f3c2cf" />
          <stop offset="100%" stopColor="#d0728c" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/*
  Petals are placed by hand (no randomness, which would break static
  rendering): spread across the whole hero, each with its own size, tint,
  speed, sway and starting rotation. `soft` ones are blurred a touch so the
  field has some depth.
*/
type Petal = {
  gradient: "wa-petal-a" | "wa-petal-b" | "wa-petal-c";
  size: number;
  soft?: boolean;
  style: CSSProperties;
};

const PETALS: Petal[] = [
  { gradient: "wa-petal-a", size: 26, style: { top: "6%", left: "6%", "--petal-o": 0.28, "--petal-dur": "22s", "--petal-delay": "-2s", "--petal-sway": "26px", "--petal-r": "12deg" } as CSSProperties },
  { gradient: "wa-petal-b", size: 16, soft: true, style: { top: "13%", left: "34%", "--petal-o": 0.2, "--petal-dur": "27s", "--petal-delay": "-9s", "--petal-sway": "-20px", "--petal-r": "-30deg" } as CSSProperties },
  { gradient: "wa-petal-c", size: 30, style: { top: "4%", left: "62%", "--petal-o": 0.24, "--petal-dur": "24s", "--petal-delay": "-14s", "--petal-sway": "22px", "--petal-r": "40deg" } as CSSProperties },
  { gradient: "wa-petal-a", size: 18, style: { top: "16%", left: "89%", "--petal-o": 0.22, "--petal-dur": "21s", "--petal-delay": "-5s", "--petal-sway": "-24px", "--petal-r": "-10deg" } as CSSProperties },
  { gradient: "wa-petal-b", size: 22, style: { top: "27%", left: "12%", "--petal-o": 0.26, "--petal-dur": "28s", "--petal-delay": "-18s", "--petal-sway": "28px", "--petal-r": "60deg" } as CSSProperties },
  { gradient: "wa-petal-c", size: 14, soft: true, style: { top: "33%", left: "45%", "--petal-o": 0.16, "--petal-dur": "30s", "--petal-delay": "-7s", "--petal-sway": "-16px", "--petal-r": "20deg" } as CSSProperties },
  { gradient: "wa-petal-a", size: 20, style: { top: "24%", left: "73%", "--petal-o": 0.22, "--petal-dur": "23s", "--petal-delay": "-12s", "--petal-sway": "24px", "--petal-r": "-40deg" } as CSSProperties },
  { gradient: "wa-petal-c", size: 16, soft: true, style: { top: "41%", left: "8%", "--petal-o": 0.18, "--petal-dur": "26s", "--petal-delay": "-3s", "--petal-sway": "-22px", "--petal-r": "30deg" } as CSSProperties },
  { gradient: "wa-petal-b", size: 24, style: { top: "45%", left: "30%", "--petal-o": 0.26, "--petal-dur": "20s", "--petal-delay": "-16s", "--petal-sway": "26px", "--petal-r": "80deg" } as CSSProperties },
  { gradient: "wa-petal-a", size: 18, style: { top: "53%", left: "58%", "--petal-o": 0.2, "--petal-dur": "29s", "--petal-delay": "-6s", "--petal-sway": "-20px", "--petal-r": "-20deg" } as CSSProperties },
  { gradient: "wa-petal-b", size: 14, soft: true, style: { top: "49%", left: "83%", "--petal-o": 0.16, "--petal-dur": "31s", "--petal-delay": "-20s", "--petal-sway": "18px", "--petal-r": "50deg" } as CSSProperties },
  { gradient: "wa-petal-c", size: 22, style: { top: "61%", left: "16%", "--petal-o": 0.24, "--petal-dur": "22s", "--petal-delay": "-11s", "--petal-sway": "-26px", "--petal-r": "-60deg" } as CSSProperties },
  { gradient: "wa-petal-a", size: 16, soft: true, style: { top: "67%", left: "41%", "--petal-o": 0.18, "--petal-dur": "27s", "--petal-delay": "-4s", "--petal-sway": "20px", "--petal-r": "15deg" } as CSSProperties },
  { gradient: "wa-petal-b", size: 26, style: { top: "62%", left: "68%", "--petal-o": 0.26, "--petal-dur": "24s", "--petal-delay": "-15s", "--petal-sway": "-24px", "--petal-r": "-80deg" } as CSSProperties },
  { gradient: "wa-petal-c", size: 18, soft: true, style: { top: "75%", left: "25%", "--petal-o": 0.2, "--petal-dur": "28s", "--petal-delay": "-8s", "--petal-sway": "24px", "--petal-r": "45deg" } as CSSProperties },
  { gradient: "wa-petal-a", size: 22, style: { top: "79%", left: "56%", "--petal-o": 0.24, "--petal-dur": "21s", "--petal-delay": "-19s", "--petal-sway": "-22px", "--petal-r": "-25deg" } as CSSProperties },
  { gradient: "wa-petal-b", size: 16, soft: true, style: { top: "71%", left: "91%", "--petal-o": 0.18, "--petal-dur": "30s", "--petal-delay": "-13s", "--petal-sway": "20px", "--petal-r": "70deg" } as CSSProperties },
  { gradient: "wa-petal-c", size: 20, style: { top: "85%", left: "79%", "--petal-o": 0.22, "--petal-dur": "25s", "--petal-delay": "-1s", "--petal-sway": "-18px", "--petal-r": "35deg" } as CSSProperties },
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
      <PetalGradients />
      {PETALS.map((petal, index) => (
        <span
          key={index}
          className={cn(
            "petal-drift absolute block",
            petal.soft && "petal-soft",
          )}
          style={{
            ...petal.style,
            width: petal.size,
            height: petal.size,
          }}
        >
          <SakuraPetal gradient={petal.gradient} className="h-full w-full" />
        </span>
      ))}
    </div>
  );
}
