import { Link } from 'react-router-dom';
import { AREAS_PAGE_COPY } from '../constants/areas';
import { ArrowIcon, PinIcon } from '../icons';
import { buildBookingPath } from '../lib/areas';
import { formatPrice, formatWeekdayList } from '../lib/format';
import type { WalkArea } from '../types/content';
import { AreaFacts } from './AreaFacts';
import { TerrainBadge } from './TerrainBadge';

interface AreaCardProps {
  area: WalkArea;
  pinNumber?: number;
  isSelected?: boolean;
  onSelect?: (areaId: string) => void;
  bookLabel: string;
}

export function AreaCard({ area, pinNumber, isSelected = false, onSelect, bookLabel }: AreaCardProps) {
  const headingId = `area-${area.id}-title`;

  return (
    <article
      className={`area-card${isSelected ? ' area-card--selected' : ''}`}
      aria-labelledby={headingId}
      id={`area-${area.id}`}
    >
      <div className="area-card__top">
        <TerrainBadge terrain={area.terrain} />
        <p className="area-card__price">
          <strong>{formatPrice(area.price)}</strong> {AREAS_PAGE_COPY.perWalkSuffix}
        </p>
      </div>
      <h3 id={headingId} className="area-card__title">
        {onSelect ? (
          <button type="button" className="area-card__select" aria-pressed={isSelected} onClick={() => onSelect(area.id)}>
            {pinNumber !== undefined && <span className="area-card__pin-number">{pinNumber}</span>}
            {area.name}
          </button>
        ) : (
          area.name
        )}
      </h3>
      <p className="area-card__place">
        <PinIcon width={16} height={16} />
        {area.neighbourhood} · {AREAS_PAGE_COPY.runsOnPrefix} {formatWeekdayList(area.walkDays)}
      </p>
      <p className="area-card__summary">{area.summary}</p>
      <AreaFacts area={area} />
      {isSelected && (
        <ul className="area-card__highlights">
          {area.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
          <li>
            {AREAS_PAGE_COPY.walkerPrefix} {area.walker}
          </li>
        </ul>
      )}
      <Link to={buildBookingPath(area.id)} className="area-card__link">
        {bookLabel}
        <ArrowIcon width={18} height={18} />
      </Link>
    </article>
  );
}
