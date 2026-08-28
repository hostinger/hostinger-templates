import { ShapeCrew } from "~/components/ShapeCrew";
import { roles, site } from "~/utils/content";

export function Hero() {
  return (
    <section className="hero shell" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="kicker">{site.hero.kicker}</p>
        <h1 id="hero-title" className="hero-headline">
          {site.hero.headline}
        </h1>
        <p className="hero-intro">{site.hero.intro}</p>
        <a className="button button-primary" href="#roles">
          {site.hero.ctaLabel}
          <span className="button-count">{roles.length}</span>
        </a>
      </div>
      <figure className="hero-art">
        <ShapeCrew />
        <figcaption className="hero-art-caption">
          {site.hero.artCaption}
        </figcaption>
      </figure>
      <dl className="facts">
        {site.facts.map((fact) => (
          <div className="fact" key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
