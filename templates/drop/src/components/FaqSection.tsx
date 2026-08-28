import { site } from "~/utils/content";

export function FaqSection() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: site.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <p className="section-kicker">03 — Questions</p>
      <h2 id="faq-title" className="section-title">
        Asked every drop
      </h2>
      <div className="faq-list">
        {site.faqs.map((faq) => (
          <details className="faq-item" key={faq.question}>
            <summary className="faq-question">
              {faq.question}
              <span className="faq-marker" aria-hidden="true" />
            </summary>
            <p className="faq-answer">{faq.answer}</p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </section>
  );
}
