import { siteContent } from "@/content/site";

export function MethodAndFaq() {
  const waitlistHref = `mailto:${siteContent.email}?subject=${encodeURIComponent("Model early access")}`;

  return (
    <>
      <section className="method" id="method" aria-labelledby="method-title">
        <div className="section-index"><span>02</span><p>Method notes</p></div>
        <div className="method-content">
          <div>
            <span className="kicker">INSPECTABLE BY DESIGN</span>
            <h2 id="method-title">Automation you can question.</h2>
          </div>
          <div className="method-grid">
            <article><span>01 / SIGNAL</span><h3>Readable inputs</h3><p>Keyword evidence stays visible beside every classification, so agents know why a ticket moved.</p></article>
            <article><span>02 / CALIBRATE</span><h3>Confidence in context</h3><p>Scores support review thresholds. They are never presented as certainty or hidden behind a magic label.</p></article>
            <article><span>03 / HANDOFF</span><h3>Human-owned actions</h3><p>Drafts accelerate the first response. Your team keeps final authority over routing and customer communication.</p></article>
          </div>
        </div>
      </section>

      <section className="faq" aria-labelledby="faq-title">
        <div className="section-index"><span>03</span><p>Review questions</p></div>
        <div className="faq-content">
          <h2 id="faq-title">Before you approve the run.</h2>
          <div>
            {siteContent.faq.map((item) => (
              <details key={item.question}>
                <summary>{item.question}<span aria-hidden="true">+</span></summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="waitlist">
        <span className="stamp">EARLY ACCESS / Q4</span>
        <h2>Bring your queue.<br />Keep the judgment.</h2>
        <p>Join the pilot list for production integrations, review controls, and evaluation tooling.</p>
        <a className="button" href={waitlistHref}>Request early access ↗</a>
      </section>
    </>
  );
}
