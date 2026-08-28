import { site } from '../content';
import { logoIcon, mailIcon } from '../icons/icons';
import { escapeHtml } from '../utils/html';

export function renderHeader(): string {
  const nav = site.navigation
    .map((link) => `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`)
    .join('');
  return `
    <div class="header-inner">
      <a class="brand" href="#quiz">
        <span class="brand-mark">${logoIcon}</span>
        <span class="brand-text">
          <span class="brand-name">${escapeHtml(site.name)}</span>
          <span class="brand-tagline">${escapeHtml(site.tagline)}</span>
        </span>
      </a>
      <nav class="site-nav" aria-label="Site">${nav}</nav>
      <a class="button button-ghost header-mail" href="mailto:${escapeHtml(site.email)}">${mailIcon}<span>${escapeHtml(site.emailButtonLabel)}</span></a>
    </div>`;
}
