import type {
  DisclosureCategory,
  DisclosureReportLabels,
  DisclosureValidationCopy,
} from '../types/content.js';

/** Validation rules shared conceptually with `public/js/disclosure-form.js`. */
export const DESCRIPTION_MIN_LENGTH = 20;
export const DESCRIPTION_MAX_LENGTH = 4000;
export const EMAIL_MAX_LENGTH = 254;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Mail clients silently drop very long mailto bodies, so the prefilled email
 * carries at most this many characters of the description; the full text stays
 * visible on the fallback page for copy-and-paste.
 */
export const MAILTO_DESCRIPTION_LIMIT = 1500;

export interface DisclosureInput {
  email: string;
  category: string;
  description: string;
}

export interface DisclosureErrors {
  email?: string;
  category?: string;
  description?: string;
}

function firstString(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value) && typeof value[0] === 'string') {
    return value[0];
  }
  return '';
}

/** Strips control characters that have no place in a plain-text report. */
function stripControlCharacters(value: string): string {
  let cleaned = '';
  for (const character of value) {
    const code = character.codePointAt(0) ?? 0;
    const isTabOrNewline = code === 9 || code === 10 || code === 13;
    if (isTabOrNewline || (code >= 32 && code !== 127)) {
      cleaned += character;
    }
  }
  return cleaned;
}

/**
 * Coerces an urlencoded request body into the three disclosure fields:
 * trimmed, control characters removed, and hard-capped so a hostile payload
 * cannot balloon the rendered page.
 */
export function normalizeDisclosureInput(body: unknown): DisclosureInput {
  const record =
    typeof body === 'object' && body !== null
      ? (body as Record<string, unknown>)
      : {};

  return {
    email: stripControlCharacters(firstString(record.email)).trim().slice(0, 320),
    category: firstString(record.category).trim().slice(0, 80),
    description: stripControlCharacters(firstString(record.description))
      .replaceAll('\r\n', '\n')
      .trim()
      .slice(0, DESCRIPTION_MAX_LENGTH + 400),
  };
}

/**
 * Server-side validation. The client script mirrors these checks for instant
 * feedback, but this is the authoritative pass.
 */
export function validateDisclosure(
  input: DisclosureInput,
  categories: DisclosureCategory[],
  messages: DisclosureValidationCopy,
): DisclosureErrors {
  const errors: DisclosureErrors = {};

  if (
    input.email !== '' &&
    (input.email.length > EMAIL_MAX_LENGTH || !EMAIL_PATTERN.test(input.email))
  ) {
    errors.email = messages.emailInvalid;
  }

  if (!categories.some((category) => category.id === input.category)) {
    errors.category = messages.categoryMissing;
  }

  if (input.description === '') {
    errors.description = messages.descriptionMissing;
  } else if (input.description.length < DESCRIPTION_MIN_LENGTH) {
    errors.description = messages.descriptionTooShort;
  } else if (input.description.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = messages.descriptionTooLong;
  }

  return errors;
}

export function hasErrors(errors: DisclosureErrors): boolean {
  return Object.keys(errors).length > 0;
}

export interface PreparedReport {
  /** Full plain-text report shown on the fallback page for copying. */
  text: string;
  /** `mailto:` link to the displayed security address, prefilled. */
  mailtoHref: string;
  /** True when the mailto body carries a shortened description. */
  mailtoTruncated: boolean;
  subject: string;
  reporterLine: string;
}

export interface ReportContext {
  securityEmail: string;
  productName: string;
  categoryLabel: string;
  anonymousReporter: string;
  labels: DisclosureReportLabels;
  preparedAt: string;
}

/**
 * Builds the plain-text report and the prefilled mailto link from the same
 * displayed contact data. Nothing is transmitted anywhere — the caller renders
 * both so the visitor can send the email themselves.
 */
export function prepareReport(
  input: DisclosureInput,
  context: ReportContext,
): PreparedReport {
  const { labels } = context;
  const reporterLine = input.email === '' ? context.anonymousReporter : input.email;

  const headerLines = [
    `${labels.title} — ${context.productName}`,
    `${labels.category}: ${context.categoryLabel}`,
    `${labels.reporter}: ${reporterLine}`,
    `${labels.prepared}: ${context.preparedAt}`,
    '',
    `${labels.body}:`,
  ];

  const text = [...headerLines, input.description].join('\n');

  const mailtoTruncated = input.description.length > MAILTO_DESCRIPTION_LIMIT;
  const mailtoDescription = mailtoTruncated
    ? `${input.description.slice(0, MAILTO_DESCRIPTION_LIMIT)}\n\n[Description shortened for the email link — paste the full report text from the trust centre page.]`
    : input.description;
  const mailtoBody = [...headerLines, mailtoDescription].join('\n');

  const subject = `${labels.subjectPrefix} — ${context.categoryLabel} (${context.productName})`;
  const mailtoHref = `mailto:${context.securityEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailtoBody)}`;

  return { text, mailtoHref, mailtoTruncated, subject, reporterLine };
}
