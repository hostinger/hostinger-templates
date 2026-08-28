import type { ChipHue } from "~/types/content";

/**
 * A single shape-person, tinted by team hue (see `.buddy--<hue>` in
 * src/styles/global.css). Decorates each role page header.
 */
export function ShapeBuddy({ hue }: { hue: ChipHue }) {
  return (
    <svg
      viewBox="0 0 96 122"
      className={`shape-buddy buddy--${hue}`}
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx="48" cy="114" rx="36" ry="6" fill="#dcdeee" />
      <path
        d="M16 112V74a32 32 0 0 1 64 0v38Z"
        fill="var(--buddy-body, #17182b)"
      />
      <circle cx="48" cy="24" r="20" fill="var(--buddy-head, #5257e5)" />
    </svg>
  );
}
