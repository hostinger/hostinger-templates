import { Link } from 'react-router-dom';
import { AreaCard } from '../components/AreaCard';
import { FaqSection } from '../components/FaqSection';
import { SectionHeading } from '../components/SectionHeading';
import { WALK_AREAS } from '../constants/areas';
import { ROUTES } from '../constants/routes';
import {
  CALL_TO_ACTION_COPY,
  FEATURED_AREA_IDS,
  FEATURED_AREAS_COPY,
  HERO_COPY,
  HOW_IT_WORKS_COPY,
  HOW_IT_WORKS_STEPS,
  STATS,
  TESTIMONIALS,
  TESTIMONIALS_COPY,
} from '../constants/site';
import { ArrowIcon, CalendarIcon, PawIcon } from '../icons';
import { DogIllustration } from '../icons/DogIllustration';

const featuredAreas = WALK_AREAS.filter((area) => FEATURED_AREA_IDS.includes(area.id));

export function HomePage() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__layout">
          <div className="hero__copy">
            <p className="eyebrow">{HERO_COPY.eyebrow}</p>
            <h1 id="hero-title" className="hero__title">
              {HERO_COPY.title}
            </h1>
            <p className="hero__body">{HERO_COPY.body}</p>
            <div className="hero__actions">
              <Link to={ROUTES.booking} className="button button--primary">
                {HERO_COPY.primaryAction}
                <ArrowIcon width={18} height={18} />
              </Link>
              <Link to={ROUTES.areas} className="button button--ghost">
                {HERO_COPY.secondaryAction}
              </Link>
            </div>
          </div>
          <div className="hero__visual">
            <DogIllustration label={HERO_COPY.illustrationLabel} />
            <div className="hero__ticket">
              <span className="hero__ticket-icon">
                <CalendarIcon width={20} height={20} />
              </span>
              <span>
                <span className="hero__ticket-label">{HERO_COPY.ticketLabel}</span>
                <strong className="hero__ticket-walk">{HERO_COPY.ticketWalk}</strong>
                <span className="hero__ticket-detail">{HERO_COPY.ticketDetail}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="container">
          <ul className="stats">
            {STATS.map((stat) => (
              <li key={stat.label} className="stats__item">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section steps" aria-labelledby="steps-title">
        <div className="container">
          <SectionHeading eyebrow={HOW_IT_WORKS_COPY.eyebrow} title={HOW_IT_WORKS_COPY.title} id="steps-title" />
          <ol className="steps__list">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <li key={step.title} className="steps__item">
                <span className="steps__number">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section featured" aria-labelledby="featured-title">
        <div className="container">
          <div className="featured__header">
            <SectionHeading eyebrow={FEATURED_AREAS_COPY.eyebrow} title={FEATURED_AREAS_COPY.title} id="featured-title" />
            <Link to={ROUTES.areas} className="text-link">
              {FEATURED_AREAS_COPY.viewAll}
              <ArrowIcon width={18} height={18} />
            </Link>
          </div>
          <div className="area-grid">
            {featuredAreas.map((area) => (
              <AreaCard key={area.id} area={area} bookLabel={FEATURED_AREAS_COPY.bookArea} />
            ))}
          </div>
        </div>
      </section>

      <section className="section testimonials" aria-labelledby="testimonials-title">
        <div className="container">
          <SectionHeading eyebrow={TESTIMONIALS_COPY.eyebrow} title={TESTIMONIALS_COPY.title} id="testimonials-title" />
          <div className="testimonials__grid">
            {TESTIMONIALS.map((testimonial) => (
              <figure key={testimonial.author} className="testimonial">
                <PawIcon width={22} height={22} className="testimonial__paw" />
                <blockquote>{testimonial.quote}</blockquote>
                <figcaption>
                  <strong>{testimonial.author}</strong>
                  <span>{testimonial.dog}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <FaqSection />

      <section className="cta-band" aria-labelledby="cta-title">
        <div className="container cta-band__layout">
          <div>
            <h2 id="cta-title" className="cta-band__title">
              {CALL_TO_ACTION_COPY.title}
            </h2>
            <p>{CALL_TO_ACTION_COPY.body}</p>
          </div>
          <Link to={ROUTES.booking} className="button button--light">
            {CALL_TO_ACTION_COPY.action}
            <ArrowIcon width={18} height={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
