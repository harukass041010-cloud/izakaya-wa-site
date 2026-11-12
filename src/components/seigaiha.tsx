/*
  Decorative seigaiha (blue-ocean-wave) pattern. Purely ornamental — always
  rendered with aria-hidden and a low opacity by the caller.
*/
export function Seigaiha({
  id = "seigaiha",
  className,
}: {
  id?: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id={id}
          width="48"
          height="24"
          patternUnits="userSpaceOnUse"
          patternTransform="scale(1.1)"
        >
          <g fill="none" stroke="currentColor" strokeWidth="1.1">
            <circle cx="0" cy="24" r="24" />
            <circle cx="0" cy="24" r="16" />
            <circle cx="0" cy="24" r="8" />
            <circle cx="48" cy="24" r="24" />
            <circle cx="48" cy="24" r="16" />
            <circle cx="48" cy="24" r="8" />
            <circle cx="24" cy="12" r="24" />
            <circle cx="24" cy="12" r="16" />
            <circle cx="24" cy="12" r="8" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
