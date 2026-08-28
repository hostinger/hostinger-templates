import { renderCatalogue } from './components/catalogue';
import { injectFaqJsonLd, renderFaqSection } from './components/faq';
import { renderFooter } from './components/footer';
import { renderHeader } from './components/header';
import { initQuiz, renderQuizSection } from './components/quiz';
import { initResults, updateResults } from './components/results';
import { renderVisitSection } from './components/visit';
import { site } from './content';
import type { PartialAnswers } from './types/content';
import { isComplete } from './types/content';
import { renderInto } from './utils/html';
import { parseAnswers, syncUrl } from './utils/urlState';

let resultsWereComplete = false;

function handleAnswersChange(answers: PartialAnswers): void {
  syncUrl(answers);
  updateResults(answers);
  const nowComplete = isComplete(answers);
  if (nowComplete && !resultsWereComplete) {
    scrollToResults();
  }
  resultsWereComplete = nowComplete;
}

function scrollToResults(): void {
  const section = document.getElementById('results');
  if (!section) {
    return;
  }
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  section.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function init(): void {
  document.title = `${site.sections.quiz.title} — ${site.name}`;
  renderInto('site-header', renderHeader());
  renderInto('quiz', renderQuizSection());
  initResults();
  renderInto('catalogue', renderCatalogue());
  renderInto('faq', renderFaqSection());
  injectFaqJsonLd();
  renderInto('visit', renderVisitSection());
  renderInto('site-footer', renderFooter());

  const initial = parseAnswers(window.location.search);
  initQuiz(initial, handleAnswersChange);
  updateResults(initial);
  resultsWereComplete = isComplete(initial);
}

init();
