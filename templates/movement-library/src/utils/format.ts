/** Locale used for any date shown to patients — change once, applies everywhere. */
const PLAN_LOCALE = 'en-US';

export const formatPlanDate = (date: Date): string =>
  new Intl.DateTimeFormat(PLAN_LOCALE, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
