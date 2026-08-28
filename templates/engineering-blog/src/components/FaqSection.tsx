import type { SiteContent } from '../types/content';

type Props = {
  faq: SiteContent['faq'];
};

export function FaqSection({ faq }: Props) {
  return (
    <div className="faq-band">
      <section id="faq" className="faq section" aria-labelledby="faq-heading">
        <div className="section-grid">
          <div className="section-head">
            <h2 id="faq-heading">{faq.heading}</h2>
            <p>{faq.lede}</p>
          </div>
          <dl className="faq__list">
            {faq.items.map((item) => (
              <div className="faq__item" key={item.question}>
                <dt>{item.question}</dt>
                <dd>{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}
