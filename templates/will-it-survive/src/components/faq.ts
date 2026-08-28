import { site } from '../content';
import { escapeHtml } from '../utils/html';

export function renderFaqSection(): string {
  const copy = site.sections.faq;
  const items = site.faqs
    .map(
      (faq, index) => `
      <details class="faq-item"${index === 0 ? ' open' : ''}>
        <summary>${escapeHtml(faq.question)}<span class="faq-marker" aria-hidden="true">+</span></summary>
        <p>${escapeHtml(faq.answer)}</p>
      </details>`,
    )
    .join('');
  return `
    <div class="section-inner faq-inner">
      <div class="section-head">
        <p class="kicker">${escapeHtml(copy.kicker)}</p>
        <h2 id="faq-title">${escapeHtml(copy.title)}</h2>
      </div>
      <div class="faq-list">${items}</div>
    </div>`;
}

/** Adds FAQPage structured data built from the same site.json questions. */
export function injectFaqJsonLd(): void {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: site.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}
