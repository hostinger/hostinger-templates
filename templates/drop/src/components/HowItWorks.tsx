import { site } from "~/utils/content";

export function HowItWorks() {
  return (
    <section className="how" id="how" aria-labelledby="how-title">
      <p className="section-kicker">02 — The rules</p>
      <h2 id="how-title" className="section-title">
        How a drop works
      </h2>
      <ol className="how-steps">
        {site.howItWorks.map((step) => (
          <li className="how-step" key={step.step}>
            <span className="how-step-number" aria-hidden="true">
              {step.step}
            </span>
            <h3 className="how-step-title">{step.title}</h3>
            <p className="how-step-text">{step.text}</p>
          </li>
        ))}
      </ol>
      <div className="claim-strip">
        <p className="claim-strip-note">{site.claimNote}</p>
        <a className="claim-strip-email" href={`mailto:${site.email}`}>
          {site.email}
        </a>
      </div>
    </section>
  );
}
