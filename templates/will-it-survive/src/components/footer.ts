import { site } from '../content';
import { logoIcon } from '../icons/icons';
import { escapeHtml } from '../utils/html';

export function renderFooter(): string {
  const copy = site.sections.footer;
  const socials = site.socials
    .map(
      (link) =>
        `<a href="${escapeHtml(link.href)}" rel="noreferrer">${escapeHtml(link.label)}</a>`,
    )
    .join('');
  const year = new Date().getFullYear();
  return `
    <div class="footer-inner">
      <div class="footer-brand">
        <span class="brand-mark">${logoIcon}</span>
        <span>${escapeHtml(site.name)}</span>
      </div>
      <p class="footer-line">${escapeHtml(copy.line)}</p>
      <div class="footer-contact">
        <a href="mailto:${escapeHtml(site.email)}">${escapeHtml(site.email)}</a>
        <span>${escapeHtml(site.address)}</span>
        ${socials}
      </div>
      <p class="footer-small">&copy; ${year} ${escapeHtml(site.name)}. ${escapeHtml(copy.smallPrint)}</p>
    </div>`;
}
