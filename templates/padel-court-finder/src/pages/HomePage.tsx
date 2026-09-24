import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigationType, useSearchParams } from 'react-router-dom';
import { CityMap } from '../components/CityMap';
import { ClubCard } from '../components/ClubCard';
import { FinderFilters } from '../components/FinderFilters';
import { HomeHero } from '../components/HomeHero';
import { clubs, neighbourhoodsById, site, sortOptions } from '../constants/content';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useNow } from '../hooks/useNow';
import type { SortKey } from '../types/content';
import { DEFAULT_STATE, findClubs, parseFinderState, serializeFinderState, type FinderState } from '../utils/finder';
import { pluralise } from '../utils/format';

const RESULTS_ID = 'courts';

export function HomePage() {
  useDocumentTitle();
  const now = useNow();
  const location = useLocation();
  const navigationType = useNavigationType();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeId, setActiveId] = useState<string | null>(null);
  // Local state drives the inputs; the URL mirrors it so filtered views can be shared.
  const [state, setState] = useState<FinderState>(() => parseFinderState(searchParams));
  const [seenLocationKey, setSeenLocationKey] = useState(location.key);

  if (location.key !== seenLocationKey) {
    setSeenLocationKey(location.key);
    if (navigationType !== 'REPLACE') setState(parseFinderState(searchParams));
  }

  useEffect(() => {
    const next = serializeFinderState(state);
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true, preventScrollReset: true });
    }
  }, [state, searchParams, setSearchParams]);

  const results = useMemo(() => findClubs(clubs, state, now), [state, now]);
  const nearName = neighbourhoodsById.get(state.near)?.name;

  const update = (patch: Partial<FinderState>) => setState((current) => ({ ...current, ...patch }));

  const clearFilters = () =>
    update({
      settings: DEFAULT_STATE.settings,
      amenities: DEFAULT_STATE.amenities,
      maxPrice: DEFAULT_STATE.maxPrice,
      openNow: DEFAULT_STATE.openNow,
    });

  const resetAll = () => setState(DEFAULT_STATE);

  return (
    <>
      <HomeHero state={state} now={now} onChange={update} resultsId={RESULTS_ID} />

      <section id={RESULTS_ID} className="finder" aria-labelledby="finder-title">
        <div className="finder__head">
          <div>
            <h2 id="finder-title" className="section-title">
              {site.finder.title}
            </h2>
            <p className="finder__intro">{site.finder.intro}</p>
          </div>
          <div className="finder__toolbar">
            <p className="finder__count" role="status">
              <strong>{pluralise(results.length, 'club')}</strong>
              {state.query.trim() && <> matching “{state.query.trim()}”</>} near {nearName}
            </p>
            <label className="select-field">
              <span>Sort</span>
              <select value={state.sort} onChange={(event) => update({ sort: event.target.value as SortKey })}>
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="finder__layout">
          <FinderFilters state={state} onChange={update} onReset={clearFilters} />

          <div className="finder__results">
            {results.length > 0 ? (
              <ol className="club-list">
                {results.map((result, index) => (
                  <li key={result.club.id}>
                    <ClubCard
                      result={result}
                      index={index}
                      active={activeId === result.club.id}
                      onActivate={setActiveId}
                    />
                  </li>
                ))}
              </ol>
            ) : (
              <div className="empty-state">
                <h3>{site.finder.emptyTitle}</h3>
                <p>{site.finder.emptyBody}</p>
                <button type="button" className="button button--court" onClick={resetAll}>
                  Show all clubs
                </button>
              </div>
            )}
            <p className="finder__notes">
              {site.finder.distanceNote} {site.finder.hoursNote}
            </p>
          </div>

          <div className="finder__map">
            <CityMap
              clubs={results.map(({ club }) => club)}
              nearId={state.near}
              activeId={activeId}
              onActivate={setActiveId}
              label={`Map of ${pluralise(results.length, 'matching club')}`}
            />
          </div>
        </div>
      </section>
    </>
  );
}
