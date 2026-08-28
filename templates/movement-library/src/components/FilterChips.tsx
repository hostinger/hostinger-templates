import type { BodyPartFilter } from '../types/content';
import {
  countExercisesForPart,
  exercises,
  formatBodyPart,
  libraryBodyParts,
} from '../utils/content';

type FilterChipsProps = {
  activePart: BodyPartFilter;
  onChange: (part: BodyPartFilter) => void;
};

export const FilterChips = ({ activePart, onChange }: FilterChipsProps) => (
  <div
    className="filter-chips"
    role="group"
    aria-label="Filter exercises by body part"
  >
    <button
      type="button"
      className="chip"
      aria-pressed={activePart === 'all'}
      onClick={() => onChange('all')}
    >
      <span className="chip-body">
        All movements
        <span className="chip-count">{exercises.length}</span>
      </span>
    </button>
    {libraryBodyParts.map((part) => (
      <button
        key={part}
        type="button"
        className="chip"
        aria-pressed={activePart === part}
        onClick={() => onChange(part)}
      >
        <span className="chip-body">
          {formatBodyPart(part)}
          <span className="chip-count">{countExercisesForPart(part)}</span>
        </span>
      </button>
    ))}
  </div>
);
