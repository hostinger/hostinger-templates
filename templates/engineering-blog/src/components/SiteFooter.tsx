import { Link } from 'gatsby';

import siteData from '../data/site.json';
import { Wordmark } from '../icons/Wordmark';
import type { SiteContent } from '../types/content';

const site = siteData as SiteContent;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__brand">
          <Wordmark />
          <span>{site.name}</span>
        </p>
        <p className="site-footer__note">{site.footer.note}</p>
        <ul className="site-footer__links">
          {site.footer.links.map((link) => (
            <li key={link.href}>
              <Link to={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
        <p className="site-footer__colophon">{site.footer.colophon}</p>
      </div>
    </footer>
  );
}
