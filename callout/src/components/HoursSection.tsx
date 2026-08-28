import { BUSINESS, OPERATING_HOURS } from '../constants/business';

export const HoursSection = () => (
  <section className="hours-section" id="hours">
    <div>
      <span className="kicker">When to call</span>
      <h2>
        Here when the
        <br />
        pipes misbehave.
      </h2>
    </div>
    <div className="hours-list">
      {OPERATING_HOURS.map(({ label, value }) => (
        <div key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
      <div className="emergency-row">
        <span>
          <i className="pulse" /> Tonight’s emergency cover
        </span>
        <strong>{BUSINESS.emergencyHours}</strong>
      </div>
    </div>
  </section>
);
