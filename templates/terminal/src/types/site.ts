export type NavigationItem = {
  label: string;
  href: string;
  external?: boolean;
};

export type InstallOption = {
  id: string;
  label: string;
  command: string;
};

export type WorkflowStep = {
  number: string;
  command: string;
  title: string;
  description: string;
};

export type Feature = {
  label: string;
  title: string;
  description: string;
};

export type OutputExample = {
  title: string;
  command: string;
  output: string[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type SiteContent = {
  brand: {
    name: string;
    version: string;
    eyebrow: string;
    headline: string;
    description: string;
    availability: string;
  };
  navigation: NavigationItem[];
  heroDemo: {
    command: string;
    output: string[];
  };
  install: {
    title: string;
    description: string;
    options: InstallOption[];
  };
  workflow: {
    kicker: string;
    title: string;
    steps: WorkflowStep[];
  };
  features: Feature[];
  examples: OutputExample[];
  faq: FaqItem[];
  footer: {
    note: string;
    copyright: string;
  };
};
