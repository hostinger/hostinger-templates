import { site } from '../utils/content';

const faqJsonLd = JSON.stringify({
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
});

export const FaqSection = () => (
  <section className="faq" id="faq" aria-labelledby="faq-heading">
    <div className="container faq-inner">
      <header className="faq-head">
        <h2 id="faq-heading">{site.faqHeading}</h2>
        <p className="faq-intro">{site.faqIntro}</p>
      </header>
      <div className="faq-list">
        {site.faqs.map((faq) => (
          <details key={faq.question} className="faq-item">
            <summary>
              <span>{faq.question}</span>
              <span className="faq-marker" aria-hidden="true" />
            </summary>
            <p className="faq-answer">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: faqJsonLd }}
    />
  </section>
);
