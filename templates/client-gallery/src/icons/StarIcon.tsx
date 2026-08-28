interface StarIconProps {
  filled?: boolean;
  size?: number;
}

export function StarIcon({ filled = false, size = 18 }: StarIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 3.6l2.6 5.3 5.8.85-4.2 4.1.99 5.75L12 16.9l-5.19 2.7.99-5.75-4.2-4.1 5.8-.85z" />
    </svg>
  );
}
