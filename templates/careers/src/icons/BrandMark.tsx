/**
 * The Slipway mark: one abstract shape-person (circle head, arch body).
 * Colors come from CSS custom properties so the footer can invert it.
 */
export function BrandMark() {
  return (
    <svg
      viewBox="0 0 32 32"
      width="26"
      height="26"
      aria-hidden="true"
      focusable="false"
      className="brand-mark"
    >
      <path
        d="M7 30v-7a9 9 0 0 1 18 0v7Z"
        fill="var(--mark-body, #17182b)"
      />
      <circle cx="16" cy="8" r="6" fill="var(--mark-head, #5257e5)" />
    </svg>
  );
}
