import { BOOKING_PAGE_COPY } from '../../constants/booking';
import { formatPrice } from '../../lib/format';
import type { WalkArea } from '../../types/content';
import { TerrainBadge } from '../TerrainBadge';

interface AreaPickerProps {
  areas: WalkArea[];
  selectedAreaId: string | null;
  onSelect: (areaId: string) => void;
}

export function AreaPicker({ areas, selectedAreaId, onSelect }: AreaPickerProps) {
  return (
    <fieldset className="booking-step">
      <legend className="booking-step__title">
        <span className="booking-step__number">1</span>
        {BOOKING_PAGE_COPY.areaStepTitle}
      </legend>
      <div className="area-options">
        {areas.map((area) => (
          <label key={area.id} className="area-option">
            <input
              type="radio"
              name="walk-area"
              value={area.id}
              checked={area.id === selectedAreaId}
              onChange={() => onSelect(area.id)}
            />
            <span className="area-option__body">
              <span className="area-option__name">{area.name}</span>
              <span className="area-option__meta">
                <TerrainBadge terrain={area.terrain} />
                {area.durationMinutes} min · {formatPrice(area.price)}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
