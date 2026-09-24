import type { FormEvent } from 'react';
import { clubs, neighbourhoods, site } from '../constants/content';
import { ArrowRightIcon, SearchIcon } from '../icons';
import type { FinderState } from '../utils/finder';
import { formatPerPlayer } from '../utils/format';
import { getOpenStatus } from '../utils/hours';
import { CourtDiagram } from './CourtDiagram';

type HomeHeroProps = {
  state: FinderState;
  now: Date;
  onChange: (patch: Partial<FinderState>) => void;
  resultsId: string;
};

export function HomeHero({ state, now, onChange, resultsId }: HomeHeroProps) {
  const totalCourts = clubs.reduce((sum, club) => sum + club.courts, 0);
  const cheapest = Math.min(...clubs.map((club) => club.prices.offPeak));
  const openNow = clubs.filter((club) => getOpenStatus(club.hours, now).open).length;

  const stats = [
    { value: String(clubs.length), label: 'clubs' },
    { value: String(totalCourts), label: 'courts' },
    { value: String(openNow), label: 'open now' },
    { value: formatPerPlayer(cheapest), label: 'from, per player' },
  ];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    document.getElementById(resultsId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__inner">
        <div className="hero__copy">
          <p className="eyebrow eyebrow--on-dark">{site.hero.eyebrow}</p>
          <h1 id="hero-title" className="hero__title">
            {site.hero.headline}
          </h1>
          <p className="hero__intro">{site.hero.intro}</p>

          <form className="hero-search" role="search" onSubmit={handleSubmit}>
            <label className="hero-search__field hero-search__field--query">
              <span className="hero-search__label">{site.hero.searchLabel}</span>
              <span className="hero-search__control">
                <SearchIcon width={18} height={18} />
                <input
                  type="search"
                  value={state.query}
                  maxLength={60}
                  placeholder={site.hero.searchPlaceholder}
                  onChange={(event) => onChange({ query: event.target.value })}
                />
              </span>
            </label>
            <label className="hero-search__field">
              <span className="hero-search__label">{site.hero.nearLabel}</span>
              <span className="hero-search__control">
                <select value={state.near} onChange={(event) => onChange({ near: event.target.value })}>
                  {neighbourhoods.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </span>
            </label>
            <button type="submit" className="button button--ball hero-search__submit">
              {site.hero.submitLabel}
              <ArrowRightIcon width={18} height={18} />
            </button>
          </form>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="hero__court">
            <CourtDiagram className="court--hero" />
            <span className="hero__ball" />
            <svg className="hero__arc" viewBox="0 0 200 100" preserveAspectRatio="none">
              <path d="M28 78C70 8 128 6 172 40" />
            </svg>
          </div>
        </div>

        <dl className="scoreboard">
          {stats.map((stat) => (
            <div key={stat.label} className="scoreboard__cell">
              <dt>{stat.label}</dt>
              <dd>{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
