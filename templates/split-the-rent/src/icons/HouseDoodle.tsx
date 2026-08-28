export function HouseDoodle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M8 30 32 9l24 21"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 28v25h36V28"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27 53V40a5 5 0 0 1 10 0v13"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="40" y="33" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="3" />
      <path d="M44 9v7" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
