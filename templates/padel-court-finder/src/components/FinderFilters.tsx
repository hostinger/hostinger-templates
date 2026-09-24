import { useState } from 'react';
import { amenityOptions, priceSteps, settingOptions, site } from '../constants/content';
import { AmenityIcon, FilterIcon } from '../icons';
import type { AmenityId, Setting } from '../types/content';
import { countActiveFilters, type FinderState } from '../utils/finder';
import { formatPerPlayer, formatPrice } from '../utils/format';

type FinderFiltersProps = {
  state: FinderState;
  onChange: (patch: Partial<FinderState>) => void;
  onReset: () => void;
};

const toggle = <T,>(list: T[], value: T) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

export function FinderFilters({ state, onChange, onReset }: FinderFiltersProps) {
  const [open, setOpen] = useState(false);
  const active = countActiveFilters(state);

  return (
    <aside className={`filters${open ? ' filters--open' : ''}`} aria-labelledby="filters-title">
      <div className="filters__head">
        <h2 id="filters-title" className="filters__title">
          <FilterIcon width={18} height={18} />
          {site.finder.filtersTitle}
          {active > 0 && <span className="filters__count">{active}</span>}
        </h2>
        <button
          type="button"
          className="filters__toggle"
          aria-expanded={open}
          aria-controls="filters-body"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? 'Hide' : 'Show'}
          <span className="visually-hidden"> filters</span>
        </button>
      </div>

      <div id="filters-body" className="filters__body">
        <label className="switch">
          <input
            type="checkbox"
            checked={state.openNow}
            onChange={(event) => onChange({ openNow: event.target.checked })}
          />
          <span className="switch__track" aria-hidden="true" />
          <span className="switch__label">Open now</span>
        </label>

        <fieldset className="filters__group">
          <legend>Setting</legend>
          <div className="chips">
            {settingOptions.map((option) => (
              <label key={option.id} className="chip" title={option.description}>
                <input
                  type="checkbox"
                  checked={state.settings.includes(option.id)}
                  onChange={() => onChange({ settings: toggle<Setting>(state.settings, option.id) })}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="filters__group">
          <legend>Off-peak court price</legend>
          <div className="chips">
            <label className="chip">
              <input
                type="radio"
                name="max-price"
                checked={state.maxPrice === null}
                onChange={() => onChange({ maxPrice: null })}
              />
              <span>Any</span>
            </label>
            {priceSteps.map((step) => (
              <label key={step} className="chip" title={`${formatPerPlayer(step)} per player`}>
                <input
                  type="radio"
                  name="max-price"
                  checked={state.maxPrice === step}
                  onChange={() => onChange({ maxPrice: step })}
                />
                <span>≤ {formatPrice(step)}</span>
              </label>
            ))}
          </div>
          <p className="filters__hint">
            Per court, {site.pricing.sessionLength}. Split between {site.pricing.playersPerCourt} players.
          </p>
        </fieldset>

        <fieldset className="filters__group">
          <legend>Facilities</legend>
          <div className="chips chips--stacked">
            {amenityOptions.map((option) => (
              <label key={option.id} className="chip chip--icon" title={option.description}>
                <input
                  type="checkbox"
                  checked={state.amenities.includes(option.id)}
                  onChange={() => onChange({ amenities: toggle<AmenityId>(state.amenities, option.id) })}
                />
                <span>
                  <AmenityIcon id={option.id} width={18} height={18} />
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <button type="button" className="button button--ghost filters__reset" onClick={onReset} disabled={active === 0}>
          Clear filters
        </button>
      </div>
    </aside>
  );
}
