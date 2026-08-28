import { APP_COPY } from '../constants/copy';

export function FaqSection() {
  return (
    <section className="faq" aria-labelledby="faq-heading">
      <h2 id="faq-heading">{APP_COPY.faq.heading}</h2>
      <div className="faq__items">
        {APP_COPY.faq.items.map((item) => (
          <article key={item.question} className="faq__item">
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
