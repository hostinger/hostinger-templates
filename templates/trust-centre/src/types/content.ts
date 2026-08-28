/** Shapes of the two editable content files in `src/data/`. */

export interface SiteLink {
  label: string;
  href: string;
}

export interface SiteContent {
  company: {
    name: string;
    legalName: string;
    product: string;
    productDescription: string;
    headquarters: string;
  };
  page: {
    title: string;
    tagline: string;
    intro: string;
    audienceNote: string;
    ctaLabel: string;
    lastReviewedLabel: string;
    lastReviewed: string;
    metaDescription: string;
  };
  navigation: SiteLink[];
  securityContact: {
    email: string;
    team: string;
    responseNote: string;
  };
  links: SiteLink[];
  footer: {
    linksLabel: string;
    securityLabel: string;
    note: string;
  };
  notFound: {
    heading: string;
    lead: string;
    backLabel: string;
  };
}

export interface PostureItem {
  id: string;
  name: string;
  status: string;
  summary: string;
}

export interface Subprocessor {
  name: string;
  purpose: string;
  region: string;
}

export type DataHandlingIcon = 'lock' | 'clock' | 'key';

export interface DataHandlingItem {
  id: string;
  icon: DataHandlingIcon;
  title: string;
  body: string;
}

export interface DisclosureCategory {
  id: string;
  label: string;
}

export interface DisclosureFormCopy {
  emailLabel: string;
  emailOptionalTag: string;
  emailHint: string;
  categoryLabel: string;
  categoryPlaceholder: string;
  descriptionLabel: string;
  descriptionHint: string;
  submitLabel: string;
  directEmailLead: string;
  categories: DisclosureCategory[];
}

export interface DisclosureValidationCopy {
  errorSummaryHeading: string;
  errorSummaryLead: string;
  emailInvalid: string;
  categoryMissing: string;
  descriptionMissing: string;
  descriptionTooShort: string;
  descriptionTooLong: string;
}

export interface DisclosureFallbackCopy {
  heading: string;
  lead: string;
  toLabel: string;
  subjectLabel: string;
  mailtoCta: string;
  copyCta: string;
  copiedLabel: string;
  copyHint: string;
  reportRegionLabel: string;
  truncationNote: string;
  anonymousReporter: string;
  backLabel: string;
}

export interface DisclosureReportLabels {
  subjectPrefix: string;
  title: string;
  category: string;
  reporter: string;
  prepared: string;
  body: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface TrustContent {
  posture: {
    heading: string;
    intro: string;
    items: PostureItem[];
  };
  subprocessors: {
    heading: string;
    intro: string;
    lastUpdatedLabel: string;
    lastUpdated: string;
    columns: {
      name: string;
      purpose: string;
      region: string;
    };
    items: Subprocessor[];
  };
  dataHandling: {
    heading: string;
    intro: string;
    items: DataHandlingItem[];
  };
  disclosure: {
    heading: string;
    intro: string;
    formNote: string;
    expectationsHeading: string;
    expectations: string[];
    form: DisclosureFormCopy;
    validation: DisclosureValidationCopy;
    fallback: DisclosureFallbackCopy;
    reportLabels: DisclosureReportLabels;
  };
  faqs: {
    heading: string;
    intro: string;
    items: Faq[];
  };
}
