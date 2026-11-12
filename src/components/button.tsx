import { cn } from "@/lib/cn";

type Variant = "primary" | "light" | "outlineLight" | "outlineDark";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-vermilion text-paper hover:bg-vermilion-dark",
  light: "bg-paper text-ink hover:bg-white",
  outlineLight: "border border-rice/40 text-rice hover:border-rice/80 hover:bg-rice/10",
  outlineDark: "border border-ink/25 text-ink hover:border-ink/60 hover:bg-ink/5",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-[0.95rem]",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md") {
  return cn(base, variants[variant], sizes[size]);
}
