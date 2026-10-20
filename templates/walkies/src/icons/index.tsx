import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const baseProps: IconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

export function PawIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props} fill="currentColor" stroke="none">
      <ellipse cx="6" cy="10" rx="2.2" ry="2.8" />
      <ellipse cx="10" cy="6" rx="2.2" ry="2.8" />
      <ellipse cx="14" cy="6" rx="2.2" ry="2.8" />
      <ellipse cx="18" cy="10" rx="2.2" ry="2.8" />
      <path d="M12 11.5c-3 0-6 3.6-6 6.2 0 1.8 1.4 2.8 3 2.8 1.2 0 2-.6 3-.6s1.8.6 3 .6c1.6 0 3-1 3-2.8 0-2.6-3-6.2-6-6.2Z" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export function DogsIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="8" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M2.5 20c.6-3.4 2.8-5.5 5.5-5.5s4.9 2.1 5.5 5.5" />
      <path d="M14 15.2c.9-.8 1.9-1.2 3-1.2 2.3 0 4 1.8 4.5 4.8" />
    </svg>
  );
}

export function LeashIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M5 4a3 3 0 1 0 0 6c3 0 4 2 5 5s2 5 5 5" />
      <circle cx="18" cy="19" r="2" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function ArrowIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2Z" />
    </svg>
  );
}
