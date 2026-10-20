import { FAQ_COPY, FAQ_ITEMS } from '../constants/site';
import { SectionHeading } from './SectionHeading';

export function FaqSection() {
  return (
    <section className="section faq" aria-labelledby="faq-title">
      <div className="container faq__layout">
        <SectionHeading eyebrow={FAQ_COPY.eyebrow} title={FAQ_COPY.title} id="faq-title" />
        <div className="faq__list">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} className="faq__item">
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
