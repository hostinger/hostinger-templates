import { Link } from 'react-router-dom';
import { site } from '../constants/content';

export function Header() {
  return (
    <header className="site-header">
      <Link className="wordmark" to="/" aria-label={`${site.studioName} home`}>
        <span aria-hidden="true">✦</span>
        <strong>{site.studioName}</strong>
        <small>Tattoo studio</small>
      </Link>
      <nav aria-label="Primary navigation">
        <Link to="/#flash">Flash</Link>
        <Link to="/#studio">Studio</Link>
        <a href={`mailto:${site.email}`}>Contact</a>
      </nav>
    </header>
  );
}
