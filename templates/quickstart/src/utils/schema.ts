import type { FaqItem } from '../types/content.js';

/**
 * Builds FAQPage JSON-LD from the same FAQ entries rendered on the page.
 * `<` is escaped so the payload can never close its own script tag.
 */
export function buildFaqJsonLd(items: FaqItem[]): string {
  const payload = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
  return JSON.stringify(payload).replaceAll('<', '\\u003c');
}
