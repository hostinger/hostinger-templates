import { Link } from 'react-router-dom';

import { ThreadNode } from '../icons/ThreadNode';
import { seriesPartLabel, type SeriesNavigation } from '../utils/series';

type Props = {
  nav: SeriesNavigation;
};

export function SeriesNav({ nav }: Props) {
  return (
    <nav className="series-nav" aria-label={`${nav.series} series`}>
      <p className="series-nav__title">
        <span className="series-nav__eyebrow">
          <ThreadNode /> Series
        </span>
        <span className="series-nav__name">
          {nav.series} · {seriesPartLabel(nav.part, nav.totalParts)}
        </span>
      </p>
      <div className="series-nav__grid">
        {nav.previous ? (
          <Link
            className="series-nav__card"
            to={nav.previous.path}
            rel="prev"
          >
            <span className="series-nav__label">
              ← Previous · Part {nav.previous.part}
            </span>
            <span className="series-nav__post">{nav.previous.title}</span>
          </Link>
        ) : (
          <p className="series-nav__card series-nav__card--empty">
            <span className="series-nav__label">Part {nav.part}</span>
            <span className="series-nav__post">The series starts here.</span>
          </p>
        )}
        {nav.next ? (
          <Link className="series-nav__card" to={nav.next.path} rel="next">
            <span className="series-nav__label">
              Next · Part {nav.next.part} →
            </span>
            <span className="series-nav__post">{nav.next.title}</span>
          </Link>
        ) : (
          <p className="series-nav__card series-nav__card--empty">
            <span className="series-nav__label">End of the series</span>
            <span className="series-nav__post">
              You have read every part published so far.
            </span>
          </p>
        )}
      </div>
    </nav>
  );
}
