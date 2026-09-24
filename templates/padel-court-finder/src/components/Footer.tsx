import { Link } from 'react-router-dom';
import { site } from '../constants/content';
import { BallIcon, MailIcon, PhoneIcon } from '../icons';
import { mailtoHref, telHref } from '../utils/contact';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <p className="brand brand--footer">
            <BallIcon className="brand__ball" width={26} height={26} />
            <span className="brand__name">{site.brand}</span>
          </p>
          <p>{site.footer.blurb}</p>
        </div>
        <nav className="site-footer__nav" aria-label="Footer">
          {site.nav.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="site-footer__contact">
          <a href={mailtoHref(site.contact.email)}>
            <MailIcon width={18} height={18} />
            {site.contact.email}
          </a>
          <a href={telHref(site.contact.phone)}>
            <PhoneIcon width={18} height={18} />
            {site.contact.phone}
          </a>
        </div>
      </div>
      <p className="site-footer__legal">
        © {year} {site.brand}. {site.footer.legal}
      </p>
    </footer>
  );
}
