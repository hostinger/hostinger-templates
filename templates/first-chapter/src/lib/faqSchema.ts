import type { FaqItem } from './types';

/** Builds `FAQPage` JSON-LD from the FAQ entries in `src/data/site.json`. */
export function faqJsonLd(items: FaqItem[]): string {
  return JSON.stringify({
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
  });
}

/** The complete `<script type="application/ld+json">` tag for `<svelte:head>`. */
export function faqSchemaTag(items: FaqItem[]): string {
  return `<script type="application/ld+json">${faqJsonLd(items)}</script>`;
}
