import type { Faq } from '../types/content.js';

/**
 * Serializes the FAQ copy from `src/data/trust.json` as FAQPage JSON-LD,
 * escaped so the string is safe to inline inside a `<script>` element.
 */
export function buildFaqJsonLd(faqs: Faq[]): string {
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
