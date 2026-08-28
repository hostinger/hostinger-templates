import site from "@/content/site.json";

export function Faq() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: site.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section className="faq-section" aria-labelledby="faq-heading">
      <div className="section-marker">
        <p className="label">04 / Notes</p>
        <h2 id="faq-heading">Useful particulars</h2>
      </div>
      <div className="faq-list">
        {site.faq.map((item, index) => (
          <details key={item.question}>
            <summary>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.question}
            </summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </section>
  );
}
