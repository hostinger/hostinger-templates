import type { FC } from 'hono/jsx';
import type { SiteContent } from '../types/content.js';
import { isExternalHref, resolveHref } from '../utils/content.js';

export const Header: FC<{ site: SiteContent }> = ({ site }) => {
  const { project, nav } = site;
  return (
    <header class="site-header">
      <div class="container header-inner">
        <a class="brand" href="/">
          <span class="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="30" height="30" focusable="false">
              <defs>
                <linearGradient id="brand-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stop-color="#2e5bff" />
                  <stop offset="1" stop-color="#00d4ff" />
                </linearGradient>
              </defs>
              <rect width="32" height="32" rx="8" fill="#0b1220" />
              <path
                d="M9 10.5 16 16l-7 5.5"
                fill="none"
                stroke="url(#brand-grad)"
                stroke-width="2.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <line
                x1="18.5"
                y1="21.5"
                x2="24"
                y2="21.5"
                stroke="url(#brand-grad)"
                stroke-width="2.6"
                stroke-linecap="round"
              />
            </svg>
          </span>
          <span class="brand-name">{project.name}</span>
          <span class="brand-version">v{project.version}</span>
        </a>
        <nav class="site-nav" aria-label="Primary">
          {nav.map((link) => {
            const href = resolveHref(project, link.href);
            const external = isExternalHref(href);
            const isRepo = link.href === '$repo';
            return (
              <a
                class={isRepo ? 'nav-link nav-github' : 'nav-link'}
                href={href}
                rel={external ? 'noreferrer' : undefined}
              >
                {link.label}
                {external ? (
                  <span class="ext-mark" aria-hidden="true">
                    ↗
                  </span>
                ) : null}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
