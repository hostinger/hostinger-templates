import { siteContent } from "@/content/site";
import { ProductVisual } from "./ProductVisual";

export function Hero() {
  const { hero } = siteContent;

  return (
    <section className="hero" id="top">
      <div className="issue-line">
        <span>{hero.issue}</span>
        <span>{hero.kicker}</span>
      </div>
      <div className="hero-grid">
        <div className="hero-copy">
          <h1>{hero.title}</h1>
          <p>{hero.body}</p>
          <div className="hero-actions">
            <a className="button" href="#waitlist">
              {hero.primaryCta}
            </a>
            <a className="text-link" href="#proof">
              {hero.secondaryCta} <span aria-hidden="true">↘</span>
            </a>
          </div>
        </div>
        <ProductVisual />
      </div>
      <div className="ticker" aria-label={hero.ticker}>
        <span>{hero.ticker}</span>
        <span aria-hidden="true">{hero.ticker}</span>
      </div>
    </section>
  );
}
