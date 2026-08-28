import type { FaqEntry } from "@/lib/types";
import styles from "./FaqSection.module.css";

interface FaqSectionProps {
  title: string;
  intro: string;
  items: FaqEntry[];
}

export function FaqSection({ title, intro, items }: FaqSectionProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section className="panel" aria-labelledby="faq-heading">
      <div className="panel-header">
        <h2 className="panel-title" id="faq-heading">
          {title}
        </h2>
        <p className="panel-sub">{intro}</p>
      </div>
      <div className={styles.list}>
        {items.map((item) => (
          <details key={item.question} className={styles.item}>
            <summary className={styles.question}>
              {item.question}
              <span className={styles.marker} aria-hidden />
            </summary>
            <p className={styles.answer}>{item.answer}</p>
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}
