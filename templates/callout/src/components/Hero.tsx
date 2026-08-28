import { BUSINESS } from '../constants/business';
import { ArrowIcon, PhoneIcon } from '../icons';
import { HeroIllustration } from './HeroIllustration';

export const Hero = () => (
  <section className="hero" id="top">
    <div className="hero-copy">
      <div className="eyebrow">
        <span className="pulse" />
        {BUSINESS.availability}
      </div>
      <h1>
        Plumbing sorted.
        <br />
        <em>No drama.</em>
      </h1>
      <p className="hero-intro">
        Your friendly local plumber for repairs, boilers and those
        why-is-there-water-there moments.
      </p>
      <div className="hero-actions">
        <a className="button button-primary" href={BUSINESS.phoneHref}>
          <PhoneIcon />
          Call {BUSINESS.phoneDisplay}
        </a>
        <a className="text-link" href="#coverage">
          Check your street <ArrowIcon />
        </a>
      </div>
      <div className="trust-row">
        <div className="avatars" aria-hidden="true">
          <span>JM</span>
          <span>SK</span>
          <span>AD</span>
        </div>
        <p>
          <strong>4.9</strong>
          <span className="stars">★★★★★</span>
          <small>from 180+ local jobs</small>
        </p>
      </div>
    </div>

    <HeroIllustration />
  </section>
);
