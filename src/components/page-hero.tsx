import { cn } from "@/lib/cn";
import { Container } from "@/components/container";
import { Photo } from "@/components/photo";
import { Eyebrow } from "@/components/section";
import { Seigaiha } from "@/components/seigaiha";

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden bg-ink pt-32 pb-16 text-rice sm:pt-40 sm:pb-24",
        className,
      )}
    >
      {image ? (
        <Photo
          src={image}
          alt={imageAlt ?? ""}
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 h-full w-full"
          imageClassName="opacity-45"
        />
      ) : null}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/70 via-ink/85 to-ink"
      />
      <Seigaiha
        id="hero-waves"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-56 text-rice/[0.07]"
      />

      <Container
        className={cn(
          "relative",
          align === "center" && "flex flex-col items-center text-center",
        )}
      >
        {eyebrow ? <Eyebrow className="text-gold">{eyebrow}</Eyebrow> : null}
        <h1 className="mt-5 max-w-3xl text-balance text-4xl leading-[1.1] sm:text-5xl md:text-6xl">
          {title}
        </h1>
        {intro ? (
          <p
            className={cn(
              "mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-rice/70",
              align === "center" && "mx-auto",
            )}
          >
            {intro}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
