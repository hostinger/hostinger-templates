/** Decorative horizontal series thread: a line passing through two nodes. */
export function ThreadRule() {
  return (
    <svg
      className="thread-rule"
      viewBox="0 0 132 12"
      width="132"
      height="12"
      aria-hidden="true"
      focusable="false"
    >
      <line x1="0" y1="6" x2="132" y2="6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="38" cy="6" r="4.2" fill="currentColor" />
      <circle
        cx="94"
        cy="6"
        r="3.6"
        fill="var(--bg, #ffffff)"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}
