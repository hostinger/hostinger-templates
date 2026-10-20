import { BRAND, CONTACT, FOOTER_COPY } from '../constants/site';
import { MailIcon, PhoneIcon } from '../icons';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner container">
        <div>
          <h2 className="site-footer__title">{FOOTER_COPY.aboutTitle}</h2>
          <p>{FOOTER_COPY.about}</p>
        </div>
        <div>
          <h2 className="site-footer__title">{FOOTER_COPY.contactTitle}</h2>
          <ul className="site-footer__list">
            <li>
              <a href={`mailto:${CONTACT.email}`}>
                <MailIcon width={18} height={18} />
                {CONTACT.email}
              </a>
            </li>
            <li>
              <a href={`tel:${CONTACT.phoneDial}`}>
                <PhoneIcon width={18} height={18} />
                {CONTACT.phoneDisplay}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="site-footer__title">{FOOTER_COPY.hoursTitle}</h2>
          <p>{CONTACT.hours}</p>
          <p>{CONTACT.serviceArea}</p>
        </div>
      </div>
      <div className="site-footer__base container">
        <p>
          © {BRAND.name} · {BRAND.tagline}
        </p>
        <p>{FOOTER_COPY.demoNote}</p>
      </div>
    </footer>
  );
}
