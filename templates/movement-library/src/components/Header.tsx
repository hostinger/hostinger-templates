import { LogoMark, MailIcon, PhoneIcon } from '../icons';
import { site } from '../utils/content';

export const Header = () => (
  <header className="site-header">
    <div className="container header-inner">
      <a className="brand" href="/">
        <LogoMark className="brand-mark" />
        <span className="brand-text">
          <strong>{site.practiceName}</strong>
          <span>{site.tagline}</span>
        </span>
      </a>
      <nav className="header-contact" aria-label="Contact the practice">
        <a className="header-link" href={`tel:${site.phone}`}>
          <PhoneIcon className="header-link-icon" />
          <span>{site.phoneDisplay}</span>
        </a>
        <a className="header-link" href={`mailto:${site.email}`}>
          <MailIcon className="header-link-icon" />
          <span>Email the practice</span>
        </a>
      </nav>
    </div>
  </header>
);
