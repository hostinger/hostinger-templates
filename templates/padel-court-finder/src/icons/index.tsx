import type { ReactNode, SVGProps } from 'react';
import type { AmenityId } from '../types/content';

type IconProps = SVGProps<SVGSVGElement>;

const Icon = ({ children, ...props }: IconProps & { children: ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    {children}
  </svg>
);

export const BallIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M4.5 7.5c3.5 1 5.5 4 5.5 8.8M19.5 16.5c-3.5-1-5.5-4-5.5-8.8" />
  </Icon>
);

export const SearchIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </Icon>
);

export const PinIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </Icon>
);

export const ClockIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Icon>
);

export const PhoneIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6.6 3.5h2.6l1.4 4-2 1.3a11 11 0 0 0 6.6 6.6l1.3-2 4 1.4v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" />
  </Icon>
);

export const MailIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </Icon>
);

export const ArrowRightIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);

export const ArrowLeftIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Icon>
);

export const CheckIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Icon>
);

export const FilterIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 6h16M7 12h10M10 18h4" />
  </Icon>
);

export const CourtIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="4" y="3" width="16" height="18" rx="1" />
    <path d="M4 12h16M12 6.5v11M4 6.5h16M4 17.5h16" />
  </Icon>
);

const CoachingIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 10.5 12 6l8 4.5-8 4.5-8-4.5Z" />
    <path d="M7.5 12.5V16c0 1.2 2 2.5 4.5 2.5s4.5-1.3 4.5-2.5v-3.5" />
  </Icon>
);

const RacketIcon = (props: IconProps) => (
  <Icon {...props}>
    <ellipse cx="14" cy="9" rx="5.5" ry="6" transform="rotate(35 14 9)" />
    <path d="m9.5 13.5-5 5.5" />
    <circle cx="13" cy="8" r=".6" fill="currentColor" />
    <circle cx="15.5" cy="10" r=".6" fill="currentColor" />
  </Icon>
);

const FloodlightIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 21V11M8 21h8M7 4h10l-1.5 5h-7L7 4Z" />
    <path d="M4 7l1.5.6M20 7l-1.5.6" />
  </Icon>
);

const ShowerIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M5 21V7a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v1" />
    <path d="M10 9h6M11 12v1M13 12v1M15 12v1M11 15v1M13 15v1M15 15v1" />
  </Icon>
);

const ParkingIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <path d="M10 16.5v-9h3a2.8 2.8 0 0 1 0 5.6h-3" />
  </Icon>
);

const CupIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V9Z" />
    <path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16M9 3.5c-.5 1 .5 2 0 3M12 3.5c-.5 1 .5 2 0 3" />
  </Icon>
);

const AccessIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="4.5" r="1.6" />
    <path d="M12 7.5v6h4.5l2 5M12 10h4" />
    <path d="M9 11.5a5 5 0 1 0 6.5 6.2" />
  </Icon>
);

const amenityIcons: Record<AmenityId, (props: IconProps) => ReactNode> = {
  coaching: CoachingIcon,
  rental: RacketIcon,
  floodlights: FloodlightIcon,
  changing: ShowerIcon,
  parking: ParkingIcon,
  cafe: CupIcon,
  accessible: AccessIcon,
};

export const AmenityIcon = ({ id, ...props }: IconProps & { id: AmenityId }) => amenityIcons[id](props);
