import { MailIcon, PhoneIcon } from '../icons';
import { site } from '../utils/content';

export const Footer = () => (
  <footer className="site-footer">
    <div className="container footer-inner">
      <div className="footer-grid">
        <div className="footer-practice">
          <p className="footer-name">{site.practiceName}</p>
          <p className="footer-detail">{site.physioName}</p>
          <p className="footer-detail">{site.address}</p>
        </div>
        <div className="footer-contact">
          <h2>{site.contactHeading}</h2>
          <p className="footer-blurb">{site.contactBlurb}</p>
          <p className="footer-links">
            <a href={`tel:${site.phone}`}>
              <PhoneIcon className="footer-link-icon" />
              <span>{site.phoneDisplay}</span>
            </a>
            <a href={`mailto:${site.email}`}>
              <MailIcon className="footer-link-icon" />
              <span>{site.email}</span>
            </a>
          </p>
        </div>
      </div>
      <p className="footer-note">{site.guidanceNote}</p>
      <p className="footer-legal">
        © {new Date().getFullYear()} {site.practiceName}
      </p>
    </div>
  </footer>
);
