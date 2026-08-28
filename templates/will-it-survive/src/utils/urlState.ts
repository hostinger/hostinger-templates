import type { PartialAnswers } from '../types/content';
import { isCareHabit, isLightLevel, isPetsAnswer } from '../types/content';

export function parseAnswers(search: string): PartialAnswers {
  const params = new URLSearchParams(search);
  const answers: PartialAnswers = {};
  const light = params.get('light');
  if (light !== null && isLightLevel(light)) {
    answers.light = light;
  }
  const care = params.get('care');
  if (care !== null && isCareHabit(care)) {
    answers.care = care;
  }
  const pets = params.get('pets');
  if (pets !== null && isPetsAnswer(pets)) {
    answers.pets = pets;
  }
  return answers;
}

export function answersToSearch(answers: PartialAnswers): string {
  const params = new URLSearchParams();
  if (answers.light) {
    params.set('light', answers.light);
  }
  if (answers.care) {
    params.set('care', answers.care);
  }
  if (answers.pets) {
    params.set('pets', answers.pets);
  }
  return params.toString();
}

export function syncUrl(answers: PartialAnswers): void {
  const url = new URL(window.location.href);
  url.search = answersToSearch(answers);
  window.history.replaceState(null, '', url);
}
