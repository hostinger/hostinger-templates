import { site } from "@/lib/site";
import styles from "@/components/FaqSection.module.css";

export function FaqSection() {
  const jsonLd = {
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
    <section id="faq" className={`shell ${styles.section}`} aria-labelledby="faq-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={styles.intro}>
        <p className="eyebrow">Before you ask</p>
        <h2 id="faq-title" className={styles.title}>
          Listener questions
        </h2>
        <p className={styles.lead}>
          Anything else, write to{" "}
          <a href={`mailto:${site.email}`} className={styles.mail}>
            {site.email}
          </a>
          .
        </p>
      </div>
      <div className={styles.list}>
        {site.faqs.map((faq, index) => (
          <details key={faq.question} className={styles.faq} open={index === 0}>
            <summary className={styles.question}>
              {faq.question}
              <span className={styles.marker} aria-hidden="true" />
            </summary>
            <p className={styles.answer}>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
