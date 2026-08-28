import { plants, quiz, site } from '../content';
import { arrowIcon } from '../icons/icons';
import { plantIllustration } from '../illustrations/plants';
import type { Plant } from '../types/content';
import { escapeHtml } from '../utils/html';
import { reserveMailto } from '../utils/reserve';

export function renderCatalogue(): string {
  const copy = site.sections.catalogue;
  return `
    <div class="section-inner">
      <div class="section-head">
        <p class="kicker">${escapeHtml(copy.kicker)}</p>
        <h2 id="catalogue-title">${escapeHtml(copy.title)}</h2>
        <p class="lede">${escapeHtml(copy.lede)}</p>
      </div>
      <div class="catalogue-grid">${plants.map(renderPlantCard).join('')}</div>
    </div>`;
}

function renderPlantCard(plant: Plant): string {
  const lightChips = plant.light
    .map((level) => `<li class="chip chip-light">${escapeHtml(quiz.tagLabels.light[level])}</li>`)
    .join('');
  const waterChips = plant.water
    .map((habit) => `<li class="chip chip-water">${escapeHtml(quiz.tagLabels.water[habit])}</li>`)
    .join('');
  const petChip = plant.petSafe
    ? `<li class="chip chip-safe">${escapeHtml(quiz.tagLabels.petSafe)}</li>`
    : `<li class="chip chip-warn">${escapeHtml(quiz.tagLabels.notPetSafe)}</li>`;
  const reserveLabel = site.sections.catalogue.reserveLabel;
  return `
    <article class="plant-card">
      <div class="plant-illustration">${plantIllustration(plant.id)}</div>
      <div class="plant-head">
        <h3 class="plant-name">${escapeHtml(plant.name)}</h3>
        <span class="price-pill">${escapeHtml(site.currencySymbol)}${plant.price}</span>
      </div>
      <p class="botanical">${escapeHtml(plant.botanical)}</p>
      <p class="personality">${escapeHtml(plant.personality)}</p>
      <ul class="tag-list" aria-label="Care tags">${lightChips}${waterChips}${petChip}</ul>
      <a class="reserve-link" href="${reserveMailto(plant)}" aria-label="${escapeHtml(`${reserveLabel}: ${plant.name}, by email`)}"><span>${escapeHtml(reserveLabel)}</span>${arrowIcon}</a>
    </article>`;
}
