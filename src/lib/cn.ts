import { twMerge } from "tailwind-merge";

/*
  Join class names, letting later utilities win over earlier ones. Without this,
  a base class such as `relative` on a component would fight a caller-supplied
  `absolute` (CSS order decides, not the caller), which breaks layouts.
*/
export function cn(
  ...parts: Array<string | false | null | undefined>
): string {
  return twMerge(parts.filter(Boolean).join(" "));
}
