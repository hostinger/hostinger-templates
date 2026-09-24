import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { site } from '../constants/content';
import { BallIcon } from '../icons';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to={ROUTES.home} className="brand" onClick={() => setMenuOpen(false)}>
          <BallIcon className="brand__ball" width={28} height={28} />
          <span className="brand__name">{site.brand}</span>
          <span className="brand__city">{site.city}</span>
        </Link>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="menu-toggle__bars" aria-hidden="true" />
          <span className="visually-hidden">{menuOpen ? 'Close menu' : 'Open menu'}</span>
        </button>
        <nav id="site-nav" className={`site-nav${menuOpen ? ' site-nav--open' : ''}`} aria-label="Main">
          {site.nav.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === ROUTES.home}
              className={({ isActive }) => `site-nav__link${isActive ? ' site-nav__link--active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
