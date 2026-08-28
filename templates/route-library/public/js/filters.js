// Progressive enhancement for the route filters.
// Without JavaScript the chips are ordinary links and the server filters
// via ?distance= and ?climb=. With JavaScript, filtering is instant and
// the URL is kept in sync so every view stays shareable.

const filterBar = document.querySelector('[data-filter-bar]');
const grid = document.querySelector('[data-route-grid]');
const countLine = document.querySelector('[data-result-count]');
const emptyState = document.querySelector('[data-empty-state]');

if (filterBar && grid && countLine && emptyState) {
  const chips = Array.from(filterBar.querySelectorAll('a[data-filter-id]'));
  const cards = Array.from(grid.querySelectorAll('[data-distance]'));
  const resetLink = document.querySelector('[data-filter-reset]');

  const knownIds = (group) =>
    chips
      .filter((chip) => chip.dataset.filterGroup === group)
      .map((chip) => chip.dataset.filterId);

  const readStateFromUrl = () => {
    const params = new URLSearchParams(location.search);
    const pick = (group) => {
      const value = params.get(group);
      return value && knownIds(group).includes(value) ? value : 'all';
    };
    return { distance: pick('distance'), climb: pick('climb') };
  };

  let state = readStateFromUrl();

  const hrefFor = (distance, climb) => {
    const params = new URLSearchParams();
    if (distance !== 'all') {
      params.set('distance', distance);
    }
    if (climb !== 'all') {
      params.set('climb', climb);
    }
    const query = params.toString();
    return query ? `/?${query}` : '/';
  };

  const apply = () => {
    let shown = 0;
    for (const card of cards) {
      const matches =
        (state.distance === 'all' || card.dataset.distance === state.distance) &&
        (state.climb === 'all' || card.dataset.climb === state.climb);
      card.hidden = !matches;
      if (matches) {
        shown += 1;
      }
    }

    countLine.textContent = `Showing ${shown} of ${cards.length} routes`;
    emptyState.hidden = shown > 0;

    for (const chip of chips) {
      const group = chip.dataset.filterGroup;
      const id = chip.dataset.filterId;
      const nextDistance = group === 'distance' ? id : state.distance;
      const nextClimb = group === 'climb' ? id : state.climb;
      chip.setAttribute('href', hrefFor(nextDistance, nextClimb));
      if (state[group] === id) {
        chip.setAttribute('aria-current', 'true');
      } else {
        chip.removeAttribute('aria-current');
      }
    }
  };

  for (const chip of chips) {
    chip.addEventListener('click', (event) => {
      event.preventDefault();
      state = { ...state, [chip.dataset.filterGroup]: chip.dataset.filterId };
      apply();
      history.pushState({}, '', hrefFor(state.distance, state.climb));
    });
  }

  if (resetLink) {
    resetLink.addEventListener('click', (event) => {
      event.preventDefault();
      state = { distance: 'all', climb: 'all' };
      apply();
      history.pushState({}, '', '/');
    });
  }

  window.addEventListener('popstate', () => {
    state = readStateFromUrl();
    apply();
  });
}
