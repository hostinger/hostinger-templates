import { FormEvent, useState } from 'react';
import { BUSINESS, COVERAGE } from '../constants/business';
import { ArrowIcon, CheckIcon } from '../icons';
import { CoverageMap } from './CoverageMap';

export const CoverageSection = () => {
  const [street, setStreet] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedStreet = street.trim();

    setResult(
      normalizedStreet
        ? COVERAGE.successMessage(normalizedStreet)
        : COVERAGE.emptyMessage,
    );
  };

  return (
    <section className="coverage-section" id="coverage">
      <div className="coverage-card">
        <div className="coverage-copy">
          <span className="kicker kicker-light">Our patch</span>
          <h2>
            Are you in our
            <br />
            callout area?
          </h2>
          <p>
            We cover {BUSINESS.serviceArea}. Pop in your street to check.
          </p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="street">Street or postcode</label>
            <div className="input-row">
              <input
                autoComplete="street-address"
                id="street"
                onChange={(event) => setStreet(event.target.value)}
                placeholder={COVERAGE.placeholder}
                value={street}
              />
              <button type="submit">
                Check <ArrowIcon />
              </button>
            </div>
            {result && (
              <p className="coverage-result" role="status">
                <CheckIcon /> {result}
              </p>
            )}
          </form>
        </div>
        <CoverageMap />
      </div>
    </section>
  );
};
