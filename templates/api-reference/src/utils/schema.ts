import type { SiteFaq } from '../types/content.js';

/**
 * Build the FAQPage JSON-LD script contents for the home page. `<` is
 * escaped so the JSON can never terminate its surrounding script tag.
 */
export function buildFaqJsonLd(faqs: SiteFaq[]): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
  return JSON.stringify(schema).replaceAll('<', '\\u003c');
}
