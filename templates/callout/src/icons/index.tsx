import type { ReactNode } from 'react';
import type { ServiceIconName } from '../types/business';

type IconProps = {
  children: ReactNode;
  size?: number;
};

const Icon = ({ children, size = 24 }: IconProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    height={size}
    viewBox="0 0 24 24"
    width={size}
  >
    {children}
  </svg>
);

export const PhoneIcon = () => (
  <Icon size={20}>
    <path
      d="M7.2 3.5 9 7.7 6.7 9.1a14 14 0 0 0 8.2 8.2l1.4-2.3 4.2 1.8v2.7c0 .8-.7 1.5-1.5 1.5A16 16 0 0 1 3 5c0-.8.7-1.5 1.5-1.5h2.7Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </Icon>
);

export const ArrowIcon = () => (
  <Icon size={18}>
    <path
      d="M5 12h14M14 7l5 5-5 5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </Icon>
);

export const CheckIcon = () => (
  <Icon size={18}>
    <path
      d="m5 12 4 4L19 6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.2"
    />
  </Icon>
);

const DropletIcon = () => (
  <Icon size={31}>
    <path
      d="M12 3S6.5 9.2 6.5 14a5.5 5.5 0 0 0 11 0C17.5 9.2 12 3 12 3Z"
      stroke="currentColor"
      strokeWidth="1.7"
    />
    <path
      d="M9.5 15.2c.4 1.4 1.3 2.2 2.8 2.4"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.7"
    />
  </Icon>
);

const BoilerIcon = () => (
  <Icon size={31}>
    <rect
      height="17"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.7"
      width="14"
      x="5"
      y="3.5"
    />
    <path
      d="M8 7h8M9 17h.01M15 17h.01M9 11c1.2-1.3 4.8-1.3 6 0"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.7"
    />
  </Icon>
);

const EmergencyIcon = () => (
  <Icon size={31}>
    <path
      d="M12 3.5a7 7 0 1 0 7 7"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.7"
    />
    <path
      d="M12 7v4l2.8 1.8M16.5 3.5H21V8"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
    />
  </Icon>
);

const serviceIcons: Record<ServiceIconName, ReactNode> = {
  droplet: <DropletIcon />,
  boiler: <BoilerIcon />,
  emergency: <EmergencyIcon />,
};

export const ServiceIcon = ({ name }: { name: ServiceIconName }) =>
  serviceIcons[name];
