import { BUSINESS } from '../constants/business';
import { ArrowIcon } from '../icons';
import { Brand } from './Brand';

export const Footer = () => (
  <footer>
    <div>
      <Brand footer />
      <p>Good work. Clear prices. No soggy socks.</p>
    </div>
    <a className="footer-call" href={BUSINESS.phoneHref}>
      <span>Need a plumber?</span>
      <strong>
        {BUSINESS.phoneDisplay} <ArrowIcon />
      </strong>
    </a>
    <div className="footer-meta">
      <span>© 2026 {BUSINESS.name}</span>
      <span>{BUSINESS.registration}</span>
    </div>
  </footer>
);
