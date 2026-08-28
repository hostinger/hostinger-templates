import { DOCUMENT, inject, Injectable } from '@angular/core';
import type { Faq } from '../models/content';

/**
 * Adds schema.org FAQPage structured data to the document head so search
 * engines pick up the club questions. The copy comes from `src/data/club.json`,
 * the same file that renders the visible FAQ section.
 */
@Injectable({ providedIn: 'root' })
export class FaqJsonLd {
  private readonly document = inject(DOCUMENT);

  register(faqs: Faq[]): void {
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
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
    });
    this.document.head.appendChild(script);
  }
}
