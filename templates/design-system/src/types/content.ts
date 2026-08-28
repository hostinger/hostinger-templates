/** A single prop value the playground can hold. */
export type PropValue = string | boolean;

/** The full prop configuration of one playground, keyed by prop name. */
export type PlaygroundConfig = Record<string, PropValue>;

/** Which control the playground renders for a prop. */
export type ControlKind = 'select' | 'toggle' | 'text';

export interface PropMeta {
  /** Prop name exactly as it appears in markup, e.g. `variant`. */
  name: string;
  /** Type shown in the prop table, e.g. `'primary' | 'secondary' | 'ghost'`. */
  type: string;
  control: ControlKind;
  /** Allowed values — only for `select` controls. */
  options?: readonly string[];
  /** Required props have no default and always appear in the snippet. */
  required?: boolean;
  /** The component's real default. Omitted values match this default. */
  default?: PropValue;
  /** The value the playground starts from before any edits. */
  initial: PropValue;
  description: string;
}

export interface ComponentDoc {
  /** Route id and registry key, e.g. `button` → `/components/button`. */
  id: string;
  name: string;
  /** Tag rendered in snippets, e.g. `VButton`. */
  tag: string;
  /** Small group label shown above the name, e.g. `Actions`. */
  kicker: string;
  /** One-line summary for the component index. */
  summary: string;
  /** Paragraph shown at the top of the component page. */
  intro: string;
  /** Default-slot text used in the preview and the snippet (Button). */
  slotText?: string;
  /** Placeholder line printed inside the snippet's slot (Card). */
  slotPlaceholder?: string;
  /** Demo body text rendered in the preview only, never in the snippet. */
  stageBody?: string;
  guidance: string[];
  props: PropMeta[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PrincipleItem {
  title: string;
  body: string;
}

export interface SiteContent {
  systemName: string;
  tagline: string;
  version: string;
  packageName: string;
  skipLinkLabel: string;
  nav: {
    ariaLabel: string;
    componentsLabel: string;
    faqLabel: string;
  };
  hero: {
    kicker: string;
    headline: string;
    headlineMark: string;
    intro: string;
    primaryCta: string;
    secondaryCta: string;
    stageLabel: string;
    stageCaption: string;
  };
  principles: {
    kicker: string;
    heading: string;
    items: PrincipleItem[];
  };
  componentIndex: {
    kicker: string;
    heading: string;
    intro: string;
    propsAriaLabel: string;
    openLabel: string;
  };
  playground: {
    ariaLabel: string;
    previewLabel: string;
    controlsHeading: string;
    resetLabel: string;
    persistNote: string;
    snippetLabel: string;
    copyLabel: string;
    copiedLabel: string;
    copyFailedLabel: string;
    copiedAnnouncement: string;
    unregisteredNote: string;
    propTableHeading: string;
    guidanceHeading: string;
    requiredLabel: string;
    table: {
      prop: string;
      type: string;
      default: string;
      description: string;
    };
    prevLabel: string;
    nextLabel: string;
    pagerAriaLabel: string;
    breadcrumbAriaLabel: string;
  };
  faq: {
    kicker: string;
    heading: string;
    items: FaqItem[];
  };
  notFound: {
    title: string;
    unknownComponent: string;
    unknownPage: string;
    homeLabel: string;
    browseLabel: string;
  };
  footer: {
    line: string;
    navAriaLabel: string;
    editNote: string;
  };
}
