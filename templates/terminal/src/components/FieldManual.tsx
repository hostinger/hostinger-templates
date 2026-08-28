import type { Feature, WorkflowStep } from '../types/site';

type FieldManualProps = {
  kicker: string;
  title: string;
  steps: WorkflowStep[];
  features: Feature[];
};

export const FieldManual = ({ kicker, title, steps, features }: FieldManualProps) => (
  <>
    <section className="workflow-section" id="workflow" aria-labelledby="workflow-title">
      <header className="manual-heading">
        <p>{kicker}</p>
        <h2 id="workflow-title">{title}</h2>
      </header>
      <ol className="workflow-list">
        {steps.map((step) => (
          <li key={step.number}>
            <span className="workflow-number">{step.number}</span>
            <code>{step.command}</code>
            <div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>

    <section className="features-section" aria-labelledby="features-title">
      <div className="feature-rail">
        <p>Field notes / 02</p>
        <h2 id="features-title">Small commands.<br />Useful evidence.</h2>
        <span className="annotation" aria-hidden="true">Keep this part ↓</span>
      </div>
      <div className="feature-list">
        {features.map((feature, index) => (
          <article key={feature.label}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <p>{feature.label}</p>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  </>
);
