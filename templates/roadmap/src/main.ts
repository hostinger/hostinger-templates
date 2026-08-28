import { roadmap, site } from './content';
import { fillTemplate } from './utils/template';
import type { RoadmapItem } from './types/content';
import {
  displayCount,
  readVotedIds,
  safeLocalStorage,
  toggleVote,
  writeVotedIds,
} from './utils/votes';

/**
 * The page is fully rendered at build time from src/data — this module only
 * brings the vote pills to life: it enables them, restores this device's
 * votes from localStorage, and keeps counts and pressed state in sync.
 */

const storage = safeLocalStorage();
let votedIds = readVotedIds(storage);

function syncPill(pill: HTMLButtonElement, item: RoadmapItem, voted: boolean): void {
  const count = displayCount(item.baseVotes, voted);
  const labelTemplate = voted ? site.board.unvoteLabelTemplate : site.board.voteLabelTemplate;
  pill.classList.toggle('is-voted', voted);
  pill.setAttribute('aria-pressed', String(voted));
  pill.setAttribute(
    'aria-label',
    fillTemplate(labelTemplate, { title: item.title, count: String(count) }),
  );
  const countElement = pill.querySelector('.vote-count');
  if (countElement) {
    countElement.textContent = String(count);
  }
}

function wirePill(item: RoadmapItem): void {
  const pill = document.querySelector<HTMLButtonElement>(`.vote-pill[data-item="${item.id}"]`);
  if (!pill) {
    return;
  }
  pill.disabled = false;
  syncPill(pill, item, votedIds.has(item.id));
  pill.addEventListener('click', () => {
    votedIds = toggleVote(votedIds, item.id);
    writeVotedIds(storage, votedIds);
    syncPill(pill, item, votedIds.has(item.id));
  });
}

function init(): void {
  document.body.classList.add('js-ready');
  roadmap.items.forEach(wirePill);
}

init();
