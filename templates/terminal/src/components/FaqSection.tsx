import type { FaqItem } from '../types/site';

type FaqSectionProps = {
  items: FaqItem[];
};

export const FaqSection = ({ items }: FaqSectionProps) => (
  <section className="faq-section" aria-labelledby="faq-title">
    <header>
      <p>Troubleshooting / 04</p>
      <h2 id="faq-title">Frequently transmitted questions.</h2>
    </header>
    <div className="faq-list">
      {items.map((item, index) => (
        <details key={item.question} open={index === 0}>
          <summary>
            <span>{String(index + 1).padStart(2, '0')}</span>
            {item.question}
          </summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  </section>
);
