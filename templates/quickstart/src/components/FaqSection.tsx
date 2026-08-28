import type { FC } from 'hono/jsx';
import type { FaqContent } from '../types/content.js';

/** Native disclosure widgets: keyboard accessible and fully readable without JavaScript. */
export const FaqSection: FC<{ faq: FaqContent }> = ({ faq }) => (
  <section class="section section-faq" id="faq" aria-labelledby="faq-heading">
    <div class="container faq-container">
      <div class="section-head">
        <h2 class="section-heading" id="faq-heading">
          {faq.heading}
        </h2>
        <p class="section-sub">{faq.sub}</p>
      </div>
      <div class="faq-list">
        {faq.items.map((item) => (
          <details class="faq-item">
            <summary class="faq-question">
              <span class="faq-question-text">{item.question}</span>
              <span class="faq-marker" aria-hidden="true">
                +
              </span>
            </summary>
            <p class="faq-answer">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);
