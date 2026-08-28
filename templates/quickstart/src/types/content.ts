/** Shapes for everything in `src/data/site.json` — the single place to edit copy. */

export interface MetaContent {
  title: string;
  description: string;
}

export interface ProjectContent {
  name: string;
  binary: string;
  version: string;
  oneLiner: string;
  licenseName: string;
  repoUrl: string;
  docsUrl: string;
}

/**
 * `href` is either a literal URL / `#anchor`, or one of the tokens
 * `$repo`, `$docs`, `$issues`, which resolve against `project` so each
 * external URL lives in exactly one place.
 */
export interface NavLink {
  label: string;
  href: string;
}

export interface HeroContent {
  kicker: string;
  headline: string;
  quickstartCta: string;
  githubCta: string;
  installLead: string;
  primaryInstallId: string;
}

export interface ResultItem {
  title: string;
  detail: string;
}

export type TerminalLineKind = 'cmd' | 'info' | 'ok' | 'err' | 'muted';

export interface TerminalLine {
  kind: TerminalLineKind;
  text: string;
}

export interface TerminalIllustration {
  title: string;
  ariaLabel: string;
  lines: TerminalLine[];
}

export interface ResultContent {
  eyebrow: string;
  title: string;
  items: ResultItem[];
  terminal: TerminalIllustration;
}

export interface InstallMethod {
  id: string;
  label: string;
  command: string;
  note: string;
}

export interface InstallContent {
  heading: string;
  sub: string;
  tabsLabel: string;
  methods: InstallMethod[];
  verifyLead: string;
}

export interface QuickstartStep {
  title: string;
  command: string;
  explanation: string;
}

export interface QuickstartContent {
  heading: string;
  sub: string;
  steps: QuickstartStep[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqContent {
  heading: string;
  sub: string;
  items: FaqItem[];
}

export interface FooterContent {
  blurb: string;
  links: NavLink[];
  finePrint: string;
}

export interface NotFoundContent {
  title: string;
  message: string;
  ctaLabel: string;
  terminal: TerminalIllustration;
}

export interface SiteContent {
  meta: MetaContent;
  project: ProjectContent;
  nav: NavLink[];
  hero: HeroContent;
  result: ResultContent;
  install: InstallContent;
  quickstart: QuickstartContent;
  faq: FaqContent;
  footer: FooterContent;
  notFound: NotFoundContent;
}
