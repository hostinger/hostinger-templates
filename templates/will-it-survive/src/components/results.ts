import { plants, quiz, site } from '../content';
import { caveatIcon, linkIcon, mailIcon, reasonIcon } from '../icons/icons';
import { plantIllustration } from '../illustrations/plants';
import type { MatchCard, PartialAnswers } from '../types/content';
import { countAnswered, isComplete } from '../types/content';
import { escapeHtml, fillTemplate, renderInto } from '../utils/html';
import { matchPlants } from '../utils/matching';
import { reserveMailto } from '../utils/reserve';

const copy = site.sections.results;

export function initResults(): void {
  const shell = `
    <div class="section-inner">
      <div class="section-head">
        <p class="kicker">${escapeHtml(copy.kicker)}</p>
        <h2 id="results-title">${escapeHtml(copy.title)}</h2>
      </div>
      <p class="results-status" id="results-status" role="status"></p>
      <div class="results-body" id="results-body"></div>
    </div>`;
  const section = renderInto('results', shell);
  section.addEventListener('click', handleCopyClick);
}

export function updateResults(answers: PartialAnswers): void {
  const status = document.getElementById('results-status');
  const body = document.getElementById('results-body');
  if (!status || !body) {
    return;
  }
  if (!isComplete(answers)) {
    status.textContent = fillTemplate(copy.progressTemplate, {
      answered: String(countAnswered(answers)),
    });
    body.innerHTML = renderPlaceholder();
    return;
  }
  const outcome = matchPlants(plants, answers);
  status.textContent = fillTemplate(copy.completeTemplate, {
    count: String(outcome.cards.length),
  });
  const note = outcome.usedFallback
    ? `<p class="results-note">${caveatIcon}<span>${escapeHtml(copy.fallbackNote)}</span></p>`
    : '';
  body.innerHTML = `
    ${note}
    <div class="results-grid results-grid-${outcome.cards.length}">${outcome.cards
      .map(renderMatchCard)
      .join('')}</div>
    <div class="results-actions">
      <button class="button button-ghost" type="button" data-copy-link>${linkIcon}<span data-copy-label>${escapeHtml(copy.copyLinkLabel)}</span></button>
      <p class="results-honesty">${escapeHtml(copy.honestyNote)}</p>
    </div>`;
}

function renderPlaceholder(): string {
  return `
    <div class="results-placeholder">
      <div class="placeholder-illustration">${plantIllustration('sprout')}</div>
      <div>
        <h3>${escapeHtml(copy.placeholderTitle)}</h3>
        <p>${escapeHtml(copy.placeholderBody)}</p>
      </div>
    </div>`;
}

function renderMatchCard(card: MatchCard): string {
  const { plant } = card;
  const flag = card.exact
    ? ''
    : `<p class="close-flag">${caveatIcon}<span>${escapeHtml(copy.closeFlag)}</span></p>`;
  const reasons = card.reasons
    .map((reason) => `<li class="reason">${reasonIcon}<span>${escapeHtml(reason)}</span></li>`)
    .join('');
  const caveats = card.caveats
    .map(
      (caveat) =>
        `<li class="reason reason-caveat">${caveatIcon}<span>${escapeHtml(caveat)}</span></li>`,
    )
    .join('');
  const petChip = plant.petSafe
    ? `<span class="chip chip-safe">${escapeHtml(quiz.tagLabels.petSafe)}</span>`
    : `<span class="chip chip-warn">${escapeHtml(quiz.tagLabels.notPetSafe)}</span>`;
  return `
    <article class="match-card${card.exact ? '' : ' match-card-close'}">
      ${flag}
      <div class="match-illustration">${plantIllustration(plant.id)}</div>
      <h3 class="plant-name">${escapeHtml(plant.name)}</h3>
      <p class="botanical">${escapeHtml(plant.botanical)}</p>
      <div class="match-meta">
        <span class="price-pill">${escapeHtml(site.currencySymbol)}${plant.price}</span>
        ${petChip}
      </div>
      <ul class="reason-list">${reasons}${caveats}</ul>
      <p class="personality">&ldquo;${escapeHtml(plant.personality)}&rdquo;</p>
      <a class="button button-primary" href="${reserveMailto(plant)}" aria-label="${escapeHtml(`${copy.reserveLabel}: ${plant.name}, by email`)}">${mailIcon}<span>${escapeHtml(copy.reserveLabel)}</span></a>
    </article>`;
}

function handleCopyClick(event: Event): void {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }
  const button = target.closest('[data-copy-link]');
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }
  const label = button.querySelector('[data-copy-label]');
  if (!label) {
    return;
  }
  navigator.clipboard
    .writeText(window.location.href)
    .then(() => flashLabel(label, copy.copiedLabel))
    .catch(() => flashLabel(label, copy.copyFailedLabel));
}

function flashLabel(label: Element, message: string): void {
  label.textContent = message;
  window.setTimeout(() => {
    label.textContent = copy.copyLinkLabel;
  }, 2000);
}
