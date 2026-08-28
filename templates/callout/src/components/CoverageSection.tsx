import { FormEvent, useState } from 'react';
import { BUSINESS, COVERAGE } from '../constants/business';
import { ArrowIcon, CheckIcon } from '../icons';
import { CoverageMap } from './CoverageMap';

export const CoverageSection = () => {
  const [street, setStreet] = useState('');
  const [result, setResult] = useState<{
    kind: 'covered' | 'enquiry' | 'empty';
    message: string;
  } | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedStreet = street.trim();

    if (!normalizedStreet) {
      setResult({ kind: 'empty', message: COVERAGE.emptyMessage });
      return;
    }

    const comparableLocation = normalizedStreet.toLowerCase();
    const postcode = normalizedStreet.toUpperCase().replace(/\s/g, '');
    const outwardCode =
      postcode.match(/^([A-Z]{1,2}\d[A-Z\d]?)\d[A-Z]{2}$/)?.[1] ??
      postcode.match(/^[A-Z]{1,2}\d[A-Z\d]?$/)?.[0];
    const matchesArea = COVERAGE.areaNames.some((area) =>
      comparableLocation.includes(area),
    );
    const matchesPostcode =
      outwardCode !== undefined &&
      COVERAGE.postcodePrefixes.includes(
        outwardCode as (typeof COVERAGE.postcodePrefixes)[number],
      );

    setResult({
      kind: matchesArea || matchesPostcode ? 'covered' : 'enquiry',
      message:
        matchesArea || matchesPostcode
          ? COVERAGE.coveredMessage(normalizedStreet)
          : COVERAGE.enquiryMessage(normalizedStreet),
    });
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
                onChange={(event) => {
                  setStreet(event.target.value);
                  setResult(null);
                }}
                placeholder={COVERAGE.placeholder}
                value={street}
              />
              <button type="submit">
                Check <ArrowIcon />
              </button>
            </div>
            {result && (
              <p className="coverage-result" role="status">
                {result.kind === 'covered' && <CheckIcon />} {result.message}
              </p>
            )}
          </form>
        </div>
        <CoverageMap />
      </div>
    </section>
  );
};
