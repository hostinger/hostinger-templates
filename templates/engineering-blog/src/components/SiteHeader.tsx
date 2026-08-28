import { Link } from 'gatsby';

import siteData from '../data/site.json';
import { Wordmark } from '../icons/Wordmark';
import type { SiteContent } from '../types/content';

const site = siteData as SiteContent;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="wordmark" to="/" aria-label={`${site.name} — home`}>
          <Wordmark />
          <span className="wordmark__name">
            {site.wordmark.lead} <em>{site.wordmark.tail}</em>
          </span>
        </Link>
        <nav aria-label="Site">
          <ul className="site-nav">
            {site.nav.map((link) => (
              <li key={link.href}>
                <Link to={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
