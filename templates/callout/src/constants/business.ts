import type {
  NavigationItem,
  OperatingHour,
  Service,
} from '../types/business';

export const BUSINESS = {
  name: 'Copper & Co.',
  trade: 'Plumbing',
  phoneDisplay: '020 7946 0283',
  phoneHref: 'tel:+442079460283',
  location: 'N7',
  availability: 'On call tonight until 11pm',
  emergencyHours: 'Until 11pm',
  serviceArea: 'North London and nearby neighbourhoods',
  registration: 'Gas Safe registered · Fully insured',
} as const;

export const NAVIGATION: NavigationItem[] = [
  { label: 'Services', href: '#services' },
  { label: 'Coverage', href: '#coverage' },
  { label: 'Hours', href: '#hours' },
];

export const SERVICES: Service[] = [
  {
    id: 'repairs',
    number: '01',
    title: 'Repairs & leaks',
    description:
      'Dripping tap or mystery puddle? We find the source and fix it properly.',
    icon: 'droplet',
  },
  {
    id: 'heating',
    number: '02',
    title: 'Boilers & heating',
    description:
      'Servicing, pressure problems, and cold radiators sorted without the fuss.',
    icon: 'boiler',
  },
  {
    id: 'emergency',
    number: '03',
    title: 'Emergency callouts',
    description:
      'A real local plumber on the phone, with clear pricing before we set off.',
    icon: 'emergency',
  },
];

export const OPERATING_HOURS: OperatingHour[] = [
  { label: 'Monday–Friday', value: '7:30am — 8pm' },
  { label: 'Saturday', value: '8am — 6pm' },
  { label: 'Sunday', value: 'Emergency only' },
];

export const COVERAGE = {
  placeholder: 'e.g. Highbury Grove',
  emptyMessage: 'Enter your street or postcode first.',
  successMessage: (street: string) =>
    `Good news — ${street} is in our callout area.`,
} as const;
