import { cn } from "@/lib/cn";
import { Container } from "@/components/container";

type Tone = "rice" | "paper" | "ink" | "charcoal";

const tones: Record<Tone, string> = {
  rice: "bg-rice text-ink",
  paper: "bg-paper text-ink",
  ink: "bg-ink text-rice",
  charcoal: "bg-charcoal text-rice",
};

export function Section({
  id,
  tone = "rice",
  className,
  containerClassName,
  children,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("py-20 sm:py-28", tones[tone], className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-vermilion",
        className,
      )}
    >
      <span aria-hidden className="h-px w-8 bg-current opacity-60" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="max-w-2xl text-balance text-3xl leading-tight sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>
      {intro ? (
        <p className="max-w-2xl text-pretty text-base leading-relaxed text-clay sm:text-lg">
          {intro}
        </p>
      ) : null}
    </div>
  );
}
