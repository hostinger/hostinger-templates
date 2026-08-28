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
    <section className="faq shell" id="faq" aria-labelledby="faq-title">
      <div className="faq-panel">
        <p className="kicker">{site.faqSection.kicker}</p>
        <h2 id="faq-title" className="section-title">
          {site.faqSection.title}
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
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </section>
  );
}
