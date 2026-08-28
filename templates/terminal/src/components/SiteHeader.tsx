import type { NavigationItem } from '../types/site';

type SiteHeaderProps = {
  name: string;
  version: string;
  navigation: NavigationItem[];
};

export const SiteHeader = ({ name, version, navigation }: SiteHeaderProps) => (
  <header className="site-header">
    <a className="wordmark" href="#top" aria-label={`${name} home`}>
      <span className="wordmark__prompt" aria-hidden="true">
        &gt;_
      </span>
      {name}
      <small>{version}</small>
    </a>
    <nav aria-label="Primary navigation">
      <ul className="site-nav">
        {navigation.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              {...(item.external
                ? { target: '_blank', rel: 'noreferrer', 'aria-label': `${item.label} (opens in a new tab)` }
                : {})}
            >
              {item.label}
              {item.external && <span aria-hidden="true"> ↗</span>}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  </header>
);
