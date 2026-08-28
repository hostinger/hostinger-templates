import type { ReactNode } from 'react';

type IconProps = {
  className?: string;
};

type IconBaseProps = IconProps & {
  children: ReactNode;
};

const IconBase = ({ children, className }: IconBaseProps) => (
  <svg
    viewBox="0 0 20 20"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    {children}
  </svg>
);

export const PlusIcon = ({ className }: IconProps) => (
  <IconBase className={className}>
    <path d="M10 4v12M4 10h12" />
  </IconBase>
);

export const CheckIcon = ({ className }: IconProps) => (
  <IconBase className={className}>
    <path d="m4 10.5 4 4 8-9" />
  </IconBase>
);

export const CrossIcon = ({ className }: IconProps) => (
  <IconBase className={className}>
    <path d="m5 5 10 10M15 5 5 15" />
  </IconBase>
);

export const PrinterIcon = ({ className }: IconProps) => (
  <IconBase className={className}>
    <path d="M6 7V2.5h8V7" />
    <rect x="2.5" y="7" width="15" height="7.5" rx="1.5" />
    <path d="M6 11.5h8V18H6z" fill="var(--icon-paper, transparent)" />
  </IconBase>
);

export const PhoneIcon = ({ className }: IconProps) => (
  <IconBase className={className}>
    <path d="M3.5 2.5h3.2l1.6 4-2 1.6a11.5 11.5 0 0 0 5.6 5.6l1.6-2 4 1.6v3.2a1.5 1.5 0 0 1-1.6 1.5C8.7 17.5 2.5 11.3 2 4.1a1.5 1.5 0 0 1 1.5-1.6Z" />
  </IconBase>
);

export const MailIcon = ({ className }: IconProps) => (
  <IconBase className={className}>
    <rect x="2.5" y="4" width="15" height="12" rx="1.5" />
    <path d="m3.5 6 6.5 5 6.5-5" />
  </IconBase>
);

export const CautionIcon = ({ className }: IconProps) => (
  <IconBase className={className}>
    <path d="M10 3 18 17H2z" />
    <path d="M10 8.5v3.5" />
    <path d="M10 14.7v.1" />
  </IconBase>
);

export const ClipboardIcon = ({ className }: IconProps) => (
  <IconBase className={className}>
    <rect x="4" y="3.5" width="12" height="14.5" rx="1.5" />
    <path d="M7.5 3.5V2h5v1.5" />
    <path d="M7.5 9h5M7.5 12.5h3.5" />
  </IconBase>
);

export const LogoMark = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 32 32"
    width="32"
    height="32"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <rect width="32" height="32" rx="8" fill="var(--logo-bg, #1e2a44)" />
    <g
      fill="none"
      stroke="var(--logo-fg, #fbf6ee)"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 16.5h8.5" />
      <path d="M15 16.5v7" />
      <path d="M21 17v6.5" />
    </g>
    <g
      fill="none"
      stroke="var(--logo-accent, #2e9b74)"
      strokeWidth="2.4"
      strokeLinecap="round"
    >
      <path d="M14 16.5 7 14.8" />
      <path d="m22.5 16.5 5-2.2" />
    </g>
    <circle cx="11.2" cy="11" r="2.9" fill="var(--logo-fg, #fbf6ee)" />
  </svg>
);
