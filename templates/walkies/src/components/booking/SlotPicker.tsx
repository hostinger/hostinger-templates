import { BOOKING_PAGE_COPY } from '../../constants/booking';
import type { TimeSlot } from '../../types/content';

interface SlotPickerProps {
  hasDate: boolean;
  slots: TimeSlot[];
  selectedTime: string | null;
  onSelect: (time: string) => void;
}

function describeSlot(slot: TimeSlot): string {
  if (slot.status === 'full') {
    return BOOKING_PAGE_COPY.fullLabel;
  }

  if (slot.status === 'yours') {
    return BOOKING_PAGE_COPY.yoursLabel;
  }

  const description = `${slot.spotsLeft} ${BOOKING_PAGE_COPY.spotsLeftSuffix}`;

  return description;
}

export function SlotPicker({ hasDate, slots, selectedTime, onSelect }: SlotPickerProps) {
  const emptyMessage = hasDate ? BOOKING_PAGE_COPY.noSlotsOnDate : BOOKING_PAGE_COPY.chooseDateFirst;

  return (
    <fieldset className="booking-step" disabled={!hasDate}>
      <legend className="booking-step__title">
        <span className="booking-step__number">3</span>
        {BOOKING_PAGE_COPY.slotStepTitle}
      </legend>
      {slots.length > 0 ? (
        <div className="slot-options">
          {slots.map((slot) => {
            const description = describeSlot(slot);

            return (
              <label key={slot.time} className={`slot-option slot-option--${slot.status}`}>
                <input
                  type="radio"
                  name="walk-slot"
                  value={slot.time}
                  checked={slot.time === selectedTime}
                  disabled={slot.status !== 'available'}
                  onChange={() => onSelect(slot.time)}
                  aria-label={`${slot.time}, ${description}`}
                />
                <span className="slot-option__time" aria-hidden="true">
                  {slot.time}
                </span>
                <span className="slot-option__status" aria-hidden="true">
                  {description}
                </span>
              </label>
            );
          })}
        </div>
      ) : (
        <p className="booking-step__hint">{emptyMessage}</p>
      )}
    </fieldset>
  );
}
