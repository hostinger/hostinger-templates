import { BOOKING_PAGE_COPY } from '../../constants/booking';
import { formatDateChip, formatLongDate } from '../../lib/format';
import { isAreaRunningOn, type BookableDate } from '../../lib/schedule';
import type { WalkArea } from '../../types/content';

interface DatePickerProps {
  area: WalkArea | undefined;
  dates: BookableDate[];
  selectedDateKey: string | null;
  onSelect: (dateKey: string) => void;
}

export function DatePicker({ area, dates, selectedDateKey, onSelect }: DatePickerProps) {
  return (
    <fieldset className="booking-step" disabled={!area}>
      <legend className="booking-step__title">
        <span className="booking-step__number">2</span>
        {BOOKING_PAGE_COPY.dateStepTitle}
      </legend>
      {area ? (
        <div className="date-options">
          {dates.map(({ date, dateKey }) => {
            const isRunning = isAreaRunningOn(area, date);
            const chip = formatDateChip(date);

            return (
              <label key={dateKey} className={`date-option${isRunning ? '' : ' date-option--off'}`}>
                <input
                  type="radio"
                  name="walk-date"
                  value={dateKey}
                  checked={dateKey === selectedDateKey}
                  disabled={!isRunning}
                  onChange={() => onSelect(dateKey)}
                  aria-label={isRunning ? formatLongDate(date) : `${formatLongDate(date)}, ${BOOKING_PAGE_COPY.notRunningLabel}`}
                />
                <span className="date-option__weekday" aria-hidden="true">
                  {chip.weekday}
                </span>
                <span className="date-option__day" aria-hidden="true">
                  {chip.day}
                </span>
                <span className="date-option__month" aria-hidden="true">
                  {isRunning ? chip.month : BOOKING_PAGE_COPY.notRunningLabel}
                </span>
              </label>
            );
          })}
        </div>
      ) : (
        <p className="booking-step__hint">{BOOKING_PAGE_COPY.chooseAreaFirst}</p>
      )}
    </fieldset>
  );
}
