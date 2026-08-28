type Props = {
  filled?: boolean;
};

/** A node on the series thread. Inherits its color from `currentColor`. */
export function ThreadNode({ filled = true }: Props) {
  return (
    <svg
      className="thread-node"
      viewBox="0 0 12 12"
      width="12"
      height="12"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="6"
        cy="6"
        r="4.4"
        fill={filled ? 'currentColor' : 'var(--bg, #ffffff)'}
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}
