import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { neighbourhoods, neighbourhoodsById, site } from '../constants/content';
import { clubPath } from '../constants/routes';
import type { Club, MapPoint } from '../types/content';

const MAP_WIDTH = 100;
const MAP_HEIGHT = 70;

type CityMapProps = {
  clubs: Club[];
  nearId?: string;
  activeId?: string | null;
  onActivate?: (id: string | null) => void;
  compact?: boolean;
  label: string;
};

const position = ({ x, y }: MapPoint): CSSProperties => ({
  left: `${(x / MAP_WIDTH) * 100}%`,
  top: `${(y / MAP_HEIGHT) * 100}%`,
});

function MapArtwork() {
  return (
    <svg className="city-map__art" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} aria-hidden="true" focusable="false">
      <rect className="city-map__land" width={MAP_WIDTH} height={MAP_HEIGHT} />
      <g className="city-map__contours">
        <ellipse cx="21" cy="16" rx="15" ry="10" />
        <ellipse cx="21" cy="16" rx="10.5" ry="6.8" />
        <ellipse cx="21" cy="16" rx="6" ry="3.8" />
      </g>
      <g className="city-map__parks">
        <path d="M40 38c3-2 8-1.5 9 1s-1.5 5-5 5.3-7.5-3.8-4-6.3Z" />
        <path d="M60 18c2.5-1.5 6-1 6.6 1.2s-1.4 3.8-4 3.8-5-3.2-2.6-5Z" />
        <path d="M5 30c3-1.5 7 0 7 2.5s-3 3.4-5.4 3S2.4 31.6 5 30Z" />
      </g>
      <g className="city-map__roads">
        <path d="M0 27h100" />
        <path d="M48 0v70" />
        <path d="M6 66 30 40 60 22 90 4" />
        <path d="M14 0c6 18 10 34 4 70" />
        <path d="M30 70c8-10 22-14 40-12s20 2 28-2" />
        <path d="M62 0c2 14 6 28 8 40" />
      </g>
      <path className="city-map__river" d="M0 45c10-3 18 2 26 4s14-1 20-5 14-9 22-8 10 2 14 0" />
      <path
        className="city-map__sea"
        d="M95 0C89 8 93 18 88.5 25.5 85.5 30.5 80 33 82 37.5 85 42 92.5 46 92.5 54 92.5 60 94.5 65 95.5 70H100V0Z"
      />
      <path className="city-map__coast" d="M95 0C89 8 93 18 88.5 25.5 85.5 30.5 80 33 82 37.5 85 42 92.5 46 92.5 54 92.5 60 94.5 65 95.5 70" />
    </svg>
  );
}

export function CityMap({ clubs, nearId, activeId = null, onActivate, compact = false, label }: CityMapProps) {
  const near = nearId ? neighbourhoodsById.get(nearId) : undefined;

  return (
    <figure className={`city-map${compact ? ' city-map--compact' : ''}`}>
      <div className="city-map__canvas" role="group" aria-label={label}>
        <MapArtwork />
        {!compact &&
          neighbourhoods.map((area) => (
            <span key={area.id} className="city-map__area" style={position(area)} aria-hidden="true">
              {area.name}
            </span>
          ))}
        {near && (
          <span className="city-map__origin" style={position(near)}>
            <span className="visually-hidden">Starting point: {near.name}</span>
          </span>
        )}
        {clubs.map((club, index) => (
          <Link
            key={club.id}
            to={clubPath(club.id)}
            className={`city-map__pin${activeId === club.id ? ' city-map__pin--active' : ''}`}
            style={position(club.location)}
            aria-label={`${index + 1}. ${club.name}`}
            onMouseEnter={() => onActivate?.(club.id)}
            onMouseLeave={() => onActivate?.(null)}
            onFocus={() => onActivate?.(club.id)}
            onBlur={() => onActivate?.(null)}
          >
            <span aria-hidden="true">{compact ? '' : index + 1}</span>
          </Link>
        ))}
      </div>
      <figcaption className="city-map__caption">
        {compact ? `${site.city}, schematic map` : `Schematic map of ${site.city}. Numbers match the club list.`}
      </figcaption>
    </figure>
  );
}
