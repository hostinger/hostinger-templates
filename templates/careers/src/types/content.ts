export const REMOTE_POLICIES = ["remote", "hybrid", "on-site"] as const;

/** How a role treats location. Every role in roles.json declares one. */
export type RemotePolicy = (typeof REMOTE_POLICIES)[number];

export const CHIP_HUES = [
  "periwinkle",
  "teal",
  "coral",
  "magenta",
  "sky",
  "slate",
] as const;

/** Named chip colors defined in src/styles/global.css (`.chip--<hue>`). */
export type ChipHue = (typeof CHIP_HUES)[number];

export function isRemotePolicy(value: string): value is RemotePolicy {
  return (REMOTE_POLICIES as readonly string[]).includes(value);
}

export function isChipHue(value: string): value is ChipHue {
  return (CHIP_HUES as readonly string[]).includes(value);
}

export interface HiringStep {
  title: string;
  detail: string;
}

export interface Role {
  slug: string;
  title: string;
  team: string;
  location: string;
  remotePolicy: RemotePolicy;
  /** Display string, e.g. "$72,000 – $92,000". Set to null to hide it. */
  salaryRange: string | null;
  oneLiner: string;
  whatYoudDo: string[];
  whatYouWont: string[];
  howWeHire: HiringStep[];
}

/** A role exactly as it sits in roles.json, before validation. */
export interface RoleSeed extends Omit<Role, "remotePolicy"> {
  remotePolicy: string;
}

export interface Team {
  name: string;
  hue: ChipHue;
}

/** A team exactly as it sits in roles.json, before the hue is validated. */
export interface TeamSeed {
  name: string;
  hue: string;
}

export interface Fact {
  label: string;
  value: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface SiteLink {
  label: string;
  href: string;
}

export interface SiteContent {
  companyName: string;
  product: string;
  valuesLine: string;
  email: string;
  city: string;
  nav: {
    skip: string;
    roles: string;
    hiring: string;
    hello: string;
  };
  hero: {
    kicker: string;
    headline: string;
    intro: string;
    ctaLabel: string;
    artCaption: string;
  };
  facts: Fact[];
  board: {
    kicker: string;
    title: string;
    note: string;
    teamLegend: string;
    locationLegend: string;
    policyLegend: string;
    filtersLabel: string;
    clearLabel: string;
    resultsTemplate: string;
    cardCta: string;
    emptyTitle: string;
    emptyBody: string;
    emptyCtaLabel: string;
  };
  policyLabels: Record<RemotePolicy, string>;
  rolePage: {
    backLabel: string;
    applyLabel: string;
    applyNote: string;
    doTitle: string;
    dontTitle: string;
    hireTitle: string;
    aboutTitle: string;
    aboutBody: string;
    questionsTitle: string;
    questionsBody: string;
    questionsCtaLabel: string;
    bottomTitle: string;
    notFoundTitle: string;
    notFoundBody: string;
  };
  faqSection: {
    kicker: string;
    title: string;
  };
  faqs: Faq[];
  footer: {
    kicker: string;
    title: string;
  };
  links: SiteLink[];
  footerNote: string;
}
