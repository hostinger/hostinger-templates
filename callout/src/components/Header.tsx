import { BUSINESS, NAVIGATION } from '../constants/business';
import { PhoneIcon } from '../icons';
import { Brand } from './Brand';

export const Header = () => (
  <header className="site-header">
    <Brand />

    <nav aria-label="Main navigation">
      {NAVIGATION.map(({ href, label }) => (
        <a href={href} key={href}>
          {label}
        </a>
      ))}
    </nav>

    <a className="header-phone" href={BUSINESS.phoneHref}>
      <PhoneIcon />
      <span>
        <small>Call us now</small>
        {BUSINESS.phoneDisplay}
      </span>
    </a>
  </header>
);
