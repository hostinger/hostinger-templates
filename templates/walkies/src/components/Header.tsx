import { Link, NavLink } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { BRAND, HEADER_COPY, NAVIGATION_LINKS } from '../constants/site';
import { PawIcon } from '../icons';

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner container">
        <Link to={ROUTES.home} className="brand" aria-label={HEADER_COPY.homeLabel}>
          <span className="brand__mark">
            <PawIcon width={22} height={22} />
          </span>
          <span className="brand__name">{BRAND.name}</span>
        </Link>
        <nav className="site-nav" aria-label={HEADER_COPY.navigationLabel}>
          <ul className="site-nav__list">
            {NAVIGATION_LINKS.map((link) => (
              <li key={link.path}>
                <NavLink to={link.path} end className="site-nav__link">
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <Link to={ROUTES.booking} className="button button--primary site-header__cta">
          {HEADER_COPY.bookButton}
        </Link>
      </div>
    </header>
  );
}
