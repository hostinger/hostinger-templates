export function KeysDoodle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="3.5" />
      <circle cx="20" cy="20" r="3" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M27 28 48 49m0 0 6-6m-6 6-5 5m-2-14 5-5"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
