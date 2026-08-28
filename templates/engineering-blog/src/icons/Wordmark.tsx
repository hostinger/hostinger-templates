/** Original Halyard pennant mark: an ink mast with a crimson pennant. */
export function Wordmark() {
  return (
    <svg
      className="wordmark__mark"
      viewBox="0 0 26 26"
      width="26"
      height="26"
      aria-hidden="true"
      focusable="false"
    >
      <line
        x1="6"
        y1="2.5"
        x2="6"
        y2="23.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path d="M9 4.5 L23.5 9 L9 13.5 Z" fill="var(--accent, #be123c)" />
    </svg>
  );
}
