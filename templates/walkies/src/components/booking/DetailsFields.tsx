import { BOOKING_PAGE_COPY, NOTES_MAX_LENGTH } from '../../constants/booking';
import type { BookingDetails, BookingFieldErrors } from '../../types/content';

interface DetailsFieldsProps {
  details: BookingDetails;
  errors: BookingFieldErrors;
  onChange: (field: keyof BookingDetails, value: string) => void;
}

interface TextFieldConfig {
  field: Exclude<keyof BookingDetails, 'notes'>;
  label: string;
  type: 'text' | 'email';
  autoComplete: string;
}

const TEXT_FIELDS: TextFieldConfig[] = [
  { field: 'ownerName', label: BOOKING_PAGE_COPY.ownerNameLabel, type: 'text', autoComplete: 'name' },
  { field: 'email', label: BOOKING_PAGE_COPY.emailLabel, type: 'email', autoComplete: 'email' },
  { field: 'dogName', label: BOOKING_PAGE_COPY.dogNameLabel, type: 'text', autoComplete: 'off' },
];

export function DetailsFields({ details, errors, onChange }: DetailsFieldsProps) {
  const notesHintId = 'booking-notes-hint';
  const notesErrorId = 'booking-notes-error';
  const notesDescribedBy = errors.notes ? `${notesHintId} ${notesErrorId}` : notesHintId;

  return (
    <fieldset className="booking-step">
      <legend className="booking-step__title">
        <span className="booking-step__number">4</span>
        {BOOKING_PAGE_COPY.detailsStepTitle}
      </legend>
      <div className="details-grid">
        {TEXT_FIELDS.map(({ field, label, type, autoComplete }) => {
          const inputId = `booking-${field}`;
          const errorId = `${inputId}-error`;
          const error = errors[field];

          return (
            <div key={field} className="form-field">
              <label htmlFor={inputId}>{label}</label>
              <input
                id={inputId}
                type={type}
                value={details[field]}
                autoComplete={autoComplete}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                onChange={(event) => onChange(field, event.target.value)}
              />
              {error && (
                <p id={errorId} className="form-field__error">
                  {error}
                </p>
              )}
            </div>
          );
        })}
        <div className="form-field form-field--wide">
          <label htmlFor="booking-notes">{BOOKING_PAGE_COPY.notesLabel}</label>
          <textarea
            id="booking-notes"
            rows={3}
            maxLength={NOTES_MAX_LENGTH}
            value={details.notes}
            aria-invalid={errors.notes ? true : undefined}
            aria-describedby={notesDescribedBy}
            onChange={(event) => onChange('notes', event.target.value)}
          />
          <p id={notesHintId} className="form-field__hint">
            {BOOKING_PAGE_COPY.notesHint}
          </p>
          {errors.notes && (
            <p id={notesErrorId} className="form-field__error">
              {errors.notes}
            </p>
          )}
        </div>
      </div>
    </fieldset>
  );
}
