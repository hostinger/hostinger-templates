import { siteContent } from "@/content/site";

export function StorySections() {
  const { story, proof, process } = siteContent;

  return (
    <>
      <section className="story section-pad" id="story">
        <p className="eyebrow">{story.eyebrow}</p>
        <div className="story-grid">
          <h2>{story.title}</h2>
          <div>
            <p className="lead-copy">{story.body}</p>
            <p className="margin-note">{story.note}</p>
          </div>
        </div>
      </section>

      <section className="proof section-pad" id="proof">
        <div className="section-heading">
          <p className="eyebrow">{proof.eyebrow}</p>
          <h2>{proof.title}</h2>
        </div>
        <div className="proof-layout">
          <div className="proof-stats">
            {proof.stats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
          <figure>
            <blockquote>“{proof.quote}”</blockquote>
            <figcaption>— {proof.attribution}</figcaption>
          </figure>
        </div>
      </section>

      <section className="process section-pad">
        <div className="section-heading split-heading">
          <p className="eyebrow">{process.eyebrow}</p>
          <h2>{process.title}</h2>
        </div>
        <ol className="process-list">
          {process.steps.map((step) => (
            <li key={step.number}>
              <span className="step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
