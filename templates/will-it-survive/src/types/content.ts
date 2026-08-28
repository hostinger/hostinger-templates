export const LIGHT_LEVELS = ['low', 'medium', 'bright'] as const;
export type LightLevel = (typeof LIGHT_LEVELS)[number];

export const CARE_HABITS = ['forgetful', 'regular', 'attentive'] as const;
export type CareHabit = (typeof CARE_HABITS)[number];

export const PETS_ANSWERS = ['yes', 'no'] as const;
export type PetsAnswer = (typeof PETS_ANSWERS)[number];

export function isLightLevel(value: string): value is LightLevel {
  return (LIGHT_LEVELS as readonly string[]).includes(value);
}

export function isCareHabit(value: string): value is CareHabit {
  return (CARE_HABITS as readonly string[]).includes(value);
}

export function isPetsAnswer(value: string): value is PetsAnswer {
  return (PETS_ANSWERS as readonly string[]).includes(value);
}

export interface Plant {
  id: string;
  name: string;
  botanical: string;
  price: number;
  light: LightLevel[];
  water: CareHabit[];
  petSafe: boolean;
  personality: string;
}

export interface Answers {
  light: LightLevel;
  care: CareHabit;
  pets: PetsAnswer;
}

export type PartialAnswers = Partial<Answers>;

export function isComplete(answers: PartialAnswers): answers is Answers {
  return (
    answers.light !== undefined && answers.care !== undefined && answers.pets !== undefined
  );
}

export function countAnswered(answers: PartialAnswers): number {
  return [answers.light, answers.care, answers.pets].filter((value) => value !== undefined)
    .length;
}

export interface MatchCard {
  plant: Plant;
  exact: boolean;
  reasons: string[];
  caveats: string[];
}

export interface MatchOutcome {
  cards: MatchCard[];
  usedFallback: boolean;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface HoursRow {
  days: string;
  time: string;
}

export interface SiteLink {
  label: string;
  href: string;
}

export interface SiteContent {
  name: string;
  city: string;
  tagline: string;
  email: string;
  address: string;
  currencySymbol: string;
  hours: HoursRow[];
  navigation: SiteLink[];
  socials: SiteLink[];
  emailButtonLabel: string;
  sections: {
    quiz: {
      kicker: string;
      title: string;
      lede: string;
      urlNote: string;
      benchLine: string;
    };
    results: {
      kicker: string;
      title: string;
      placeholderTitle: string;
      placeholderBody: string;
      progressTemplate: string;
      completeTemplate: string;
      honestyNote: string;
      fallbackNote: string;
      closeFlag: string;
      copyLinkLabel: string;
      copiedLabel: string;
      copyFailedLabel: string;
      reserveLabel: string;
    };
    catalogue: {
      kicker: string;
      title: string;
      lede: string;
      reserveLabel: string;
    };
    faq: {
      kicker: string;
      title: string;
    };
    visit: {
      kicker: string;
      title: string;
      lede: string;
      addressTitle: string;
      hoursTitle: string;
      emailLead: string;
    };
    footer: {
      line: string;
      smallPrint: string;
    };
  };
  reserve: {
    subject: string;
    body: string;
  };
  faqs: Faq[];
}

export interface QuizOption {
  value: string;
  label: string;
  description: string;
  icon: string;
}

export interface QuizQuestion {
  id: string;
  legend: string;
  hint: string;
  options: QuizOption[];
}

export interface QuizContent {
  questions: QuizQuestion[];
  reasons: {
    light: Record<LightLevel, string>;
    care: Record<CareHabit, string>;
    pets: { yes: string };
  };
  mismatches: {
    light: { brighter: string; dimmer: string };
    care: { more: string; less: string };
  };
  tagLabels: {
    light: Record<LightLevel, string>;
    water: Record<CareHabit, string>;
    petSafe: string;
    notPetSafe: string;
  };
}
