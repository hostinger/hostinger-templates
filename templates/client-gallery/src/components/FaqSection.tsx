import type { Faq } from '../types/content';

interface FaqSectionProps {
  faqs: Faq[];
}

export function FaqSection({ faqs }: FaqSectionProps) {
  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <div className="faq-heading">
        <p className="eyebrow">Good to know</p>
        <h2 id="faq-title">Questions, answered</h2>
      </div>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <details key={faq.question} open={index === 0}>
            <summary>
              {faq.question}
              <span className="faq-marker" aria-hidden="true">
                +
              </span>
            </summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
