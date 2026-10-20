import type { CSSProperties } from 'react';
import { AREAS_PAGE_COPY, TERRAINS } from '../constants/areas';
import { AreaMapArt } from '../icons/AreaMapArt';
import { getPinNumber } from '../lib/areas';
import type { WalkArea } from '../types/content';

interface AreaMapProps {
  areas: WalkArea[];
  selectedAreaId: string | null;
  onSelect: (areaId: string) => void;
}

export function AreaMap({ areas, selectedAreaId, onSelect }: AreaMapProps) {
  return (
    <div className="area-map" role="group" aria-label={AREAS_PAGE_COPY.mapLabel}>
      <AreaMapArt />
      {areas.map((area) => {
        const isSelected = area.id === selectedAreaId;
        const pinStyle = {
          left: `${area.mapPosition.left}%`,
          top: `${area.mapPosition.top}%`,
          '--pin-color': TERRAINS[area.terrain].colorVariable,
        } as CSSProperties;

        return (
          <button
            key={area.id}
            type="button"
            className={`area-map__pin${isSelected ? ' area-map__pin--selected' : ''}`}
            style={pinStyle}
            aria-pressed={isSelected}
            onClick={() => onSelect(area.id)}
          >
            <span className="area-map__pin-number" aria-hidden="true">
              {getPinNumber(area.id)}
            </span>
            <span className="area-map__pin-label">{area.name}</span>
          </button>
        );
      })}
    </div>
  );
}
