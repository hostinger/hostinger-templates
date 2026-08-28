import { APP_COPY } from '../constants/copy';

interface RentInputProps {
  rent: string;
  onChange: (rent: string) => void;
}

export function RentInput({ rent, onChange }: RentInputProps) {
  return (
    <div className="rent-card">
      <label className="rent-card__label" htmlFor="total-rent">
        {APP_COPY.rent.label}
      </label>
      <div className="rent-card__field">
        <span className="rent-card__symbol" aria-hidden="true">
          £
        </span>
        <input
          id="total-rent"
          className="rent-card__input"
          type="number"
          inputMode="decimal"
          min="0.01"
          step="0.01"
          value={rent}
          onChange={(event) => onChange(event.target.value)}
          aria-describedby="total-rent-hint"
        />
      </div>
      <p id="total-rent-hint" className="rent-card__hint">
        {APP_COPY.rent.hint}
      </p>
    </div>
  );
}
