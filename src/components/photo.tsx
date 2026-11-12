import Image from "next/image";
import { cn } from "@/lib/cn";

/*
  A framed, cover-fit image. The wrapper is positioned and needs an explicit
  size or aspect ratio from the caller (e.g. `aspect-[4/3]`).
*/
export function Photo({
  src,
  alt,
  className,
  imageClassName,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-ink/5", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", imageClassName)}
      />
    </div>
  );
}
