import { site } from '../content';
import { mailIcon } from '../icons/icons';
import { sprig } from '../illustrations/plants';
import { escapeHtml } from '../utils/html';

export function renderVisitSection(): string {
  const copy = site.sections.visit;
  const hours = site.hours
    .map(
      (row) =>
        `<div class="hours-row"><dt>${escapeHtml(row.days)}</dt><dd>${escapeHtml(row.time)}</dd></div>`,
    )
    .join('');
  return `
    <div class="section-inner visit-inner">
      <div class="visit-copy">
        <p class="kicker">${escapeHtml(copy.kicker)}</p>
        <h2 id="visit-title">${escapeHtml(copy.title)}</h2>
        <p class="lede">${escapeHtml(copy.lede)}</p>
        <p class="visit-email-lead">${escapeHtml(copy.emailLead)}</p>
        <a class="button button-primary" href="mailto:${escapeHtml(site.email)}">${mailIcon}<span>${escapeHtml(site.email)}</span></a>
        <div class="visit-sprig" aria-hidden="true">${sprig(true)}</div>
      </div>
      <div class="visit-cards">
        <div class="visit-card">
          <h3>${escapeHtml(copy.addressTitle)}</h3>
          <p>${escapeHtml(site.name)}<br />${escapeHtml(site.address)}</p>
        </div>
        <div class="visit-card">
          <h3>${escapeHtml(copy.hoursTitle)}</h3>
          <dl class="hours-list">${hours}</dl>
        </div>
      </div>
    </div>`;
}
