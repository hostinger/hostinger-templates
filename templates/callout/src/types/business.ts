export type ServiceIconName = 'droplet' | 'boiler' | 'emergency';

export type Service = {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: ServiceIconName;
};

export type OperatingHour = {
  label: string;
  value: string;
};

export type NavigationItem = {
  label: string;
  href: `#${string}`;
};
