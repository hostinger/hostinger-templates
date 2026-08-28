export const BODY_PARTS = [
  'neck',
  'shoulder',
  'back',
  'hip',
  'knee',
  'ankle',
] as const;

export type BodyPart = (typeof BODY_PARTS)[number];

export type BodyPartFilter = BodyPart | 'all';

export type Exercise = {
  id: string;
  name: string;
  figure: string;
  bodyParts: BodyPart[];
  dosage: string;
  steps: string[];
  caution: string;
};

export type Faq = {
  question: string;
  answer: string;
};

export type SiteContent = {
  practiceName: string;
  physioName: string;
  tagline: string;
  email: string;
  phoneDisplay: string;
  phone: string;
  address: string;
  hero: {
    eyebrow: string;
    headline: string;
    intro: string;
    steps: string[];
    sampleExerciseId: string;
  };
  guidanceNote: string;
  library: {
    heading: string;
    intro: string;
  };
  plan: {
    heading: string;
    emptyHint: string;
    printLabel: string;
    clearLabel: string;
  };
  printCard: {
    title: string;
    preparedForLabel: string;
    guidedByLabel: string;
    tickHint: string;
    emptyMessage: string;
    footnote: string;
  };
  faqHeading: string;
  faqIntro: string;
  contactHeading: string;
  contactBlurb: string;
  faqs: Faq[];
};
