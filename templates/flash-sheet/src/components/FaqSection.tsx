import { site } from '../constants/content';

export function FaqSection() {
  return (
    <section className="faq section-shell" aria-labelledby="faq-title">
      <div className="section-heading">
        <p className="kicker">Before you write</p>
        <h2 id="faq-title">Good to know.</h2>
      </div>
      <div className="faq-list">
        {site.faqs.map((faq, index) => (
          <details key={faq.question} open={index === 0}>
            <summary><span>0{index + 1}</span>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
