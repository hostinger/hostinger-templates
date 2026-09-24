import { Link } from 'react-router-dom';
import { amenitiesById, neighbourhoodsById, settingsById, site } from '../constants/content';
import { clubPath } from '../constants/routes';
import { AmenityIcon, ArrowRightIcon, PinIcon } from '../icons';
import type { ClubResult } from '../utils/finder';
import { formatDistance, formatPerPlayer, pluralise } from '../utils/format';
import { CourtStrip } from './CourtStrip';
import { StatusPill } from './StatusPill';

type ClubCardProps = {
  result: ClubResult;
  index?: number;
  active?: boolean;
  onActivate?: (id: string | null) => void;
  showDistance?: boolean;
};

export function ClubCard({ result, index, active = false, onActivate, showDistance = true }: ClubCardProps) {
  const { club, distance, status } = result;
  const area = neighbourhoodsById.get(club.neighbourhood);

  return (
    <article
      className={`club-card club-card--${club.setting}${active ? ' club-card--active' : ''}`}
      onMouseEnter={() => onActivate?.(club.id)}
      onMouseLeave={() => onActivate?.(null)}
    >
      <header className="club-card__header">
        {index !== undefined && (
          <span className="club-card__index" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
        )}
        <span className="club-card__setting">{settingsById.get(club.setting)?.label}</span>
        <StatusPill status={status} />
      </header>
      <h3 className="club-card__name">
        <Link
          to={clubPath(club.id)}
          className="club-card__link"
          onFocus={() => onActivate?.(club.id)}
          onBlur={() => onActivate?.(null)}
        >
          {club.name}
        </Link>
      </h3>
      <p className="club-card__where">
        <PinIcon width={16} height={16} />
        {area?.name}
        {showDistance && <span className="club-card__distance">· {formatDistance(distance)}</span>}
      </p>
      <p className="club-card__summary">{club.summary}</p>
      <div className="club-card__courts">
        <CourtStrip courts={club.courts} />
        <span>
          {pluralise(club.courts, 'court')} · {club.courtType.toLowerCase()}
        </span>
      </div>
      <footer className="club-card__footer">
        <p className="club-card__price">
          <span className="club-card__price-value">{formatPerPlayer(club.prices.offPeak)}</span>
          <span className="club-card__price-label">
            per player, off-peak {site.pricing.sessionLength}
          </span>
        </p>
        <ul className="club-card__amenities" aria-label="Facilities">
          {club.amenities.map((id) => (
            <li key={id} title={amenitiesById.get(id)?.label}>
              <AmenityIcon id={id} width={18} height={18} />
              <span className="visually-hidden">{amenitiesById.get(id)?.label}</span>
            </li>
          ))}
        </ul>
        <ArrowRightIcon className="club-card__arrow" width={22} height={22} />
      </footer>
    </article>
  );
}
