import { Link } from 'react-router-dom';
import { CourtDiagram } from '../components/CourtDiagram';
import { site } from '../constants/content';
import { ROUTES } from '../constants/routes';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { ArrowRightIcon, CheckIcon } from '../icons';

export function GuidePage() {
  const { guide } = site;
  useDocumentTitle(guide.eyebrow);

  return (
    <div className="guide">
      <header className="page-hero">
        <div className="page-hero__inner">
          <p className="eyebrow eyebrow--on-dark">{guide.eyebrow}</p>
          <h1 className="page-hero__title">{guide.title}</h1>
          <p className="page-hero__intro">{guide.intro}</p>
        </div>
      </header>

      <section className="guide__court" aria-labelledby="court-title">
        <div className="guide__court-copy">
          <h2 id="court-title" className="section-title">
            {guide.courtTitle}
          </h2>
          <p>{guide.courtIntro}</p>
        </div>
        <CourtDiagram labelled title="Top-down padel court diagram, 20 by 10 metres, with net, service lines, glass walls, and mesh fencing" />
      </section>

      <section className="guide__rules" aria-labelledby="rules-title">
        <h2 id="rules-title" className="section-title">
          {guide.rulesTitle}
        </h2>
        <ol className="rule-list">
          {guide.rules.map((rule) => (
            <li key={rule.title} className="rule-list__item">
              <h3>{rule.title}</h3>
              <p>{rule.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="guide__split">
        <section className="guide__kit" aria-labelledby="kit-title">
          <h2 id="kit-title" className="section-title">
            {guide.kitTitle}
          </h2>
          <ul className="check-list">
            {guide.kit.map((item) => (
              <li key={item}>
                <CheckIcon width={20} height={20} />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="guide__levels" aria-labelledby="levels-title">
          <h2 id="levels-title" className="section-title">
            {guide.levelsTitle}
          </h2>
          <dl className="level-list">
            {guide.levels.map((level) => (
              <div key={level.name} className="level-list__item">
                <dt>
                  <span className="level-list__rating">{level.rating}</span>
                  {level.name}
                </dt>
                <dd>{level.description}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <section className="guide__faq" aria-labelledby="faq-title">
        <h2 id="faq-title" className="section-title">
          {guide.faqTitle}
        </h2>
        <div className="faq-list">
          {guide.faqs.map((faq) => (
            <details key={faq.question} className="faq">
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="cta-band" aria-labelledby="cta-title">
        <div>
          <h2 id="cta-title">{guide.ctaTitle}</h2>
          <p>{guide.ctaBody}</p>
        </div>
        <Link to={ROUTES.home} className="button button--ball">
          {guide.ctaLabel}
          <ArrowRightIcon width={18} height={18} />
        </Link>
      </section>
    </div>
  );
}
