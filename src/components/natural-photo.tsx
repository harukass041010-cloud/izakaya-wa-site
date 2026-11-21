import Image from "next/image";
import dimensions from "@/content/image-dimensions.json";
import { cn } from "@/lib/cn";

/*
 * A photo shown at its own aspect ratio — nothing is cropped, so the whole
 * dish stays in frame. Sizes come from the build-time index in
 * src/content/image-dimensions.json; the fallback only matters before the
 * index has been generated (e.g. on the very first `next dev` run).
 */
const sizes = dimensions as Record<string, { width: number; height: number }>;

export function NaturalPhoto({
  src,
  alt,
  className,
  priority = false,
  sizes: sizesAttribute,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const size = sizes[src] ?? { width: 1400, height: 1050 };

  return (
    <Image
      src={src}
      alt={alt}
      width={size.width}
      height={size.height}
      priority={priority}
      sizes={sizesAttribute}
      style={{ width: "100%", height: "auto" }}
      className={cn("block", className)}
    />
  );
}
