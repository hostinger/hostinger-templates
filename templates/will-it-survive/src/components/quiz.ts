import { plants, quiz, site } from '../content';
import { answerIcons, linkIcon } from '../icons/icons';
import { plantIllustration } from '../illustrations/plants';
import type { PartialAnswers, QuizQuestion } from '../types/content';
import { isCareHabit, isLightLevel, isPetsAnswer } from '../types/content';
import { escapeHtml } from '../utils/html';

export function renderQuizSection(): string {
  const copy = site.sections.quiz;
  const questions = quiz.questions
    .map((question, index) => renderQuestion(question, index))
    .join('');
  const bench = plants
    .map(
      (plant) =>
        `<span class="bench-mini" title="${escapeHtml(plant.name)}">${plantIllustration(plant.id)}</span>`,
    )
    .join('');
  return `
    <div class="section-inner quiz-inner">
      <div class="quiz-intro">
        <p class="kicker">${escapeHtml(copy.kicker)}</p>
        <h1 class="quiz-title" id="quiz-title">${escapeHtml(copy.title)}</h1>
        <p class="lede">${escapeHtml(copy.lede)}</p>
        <p class="quiz-url-note">${linkIcon}<span>${escapeHtml(copy.urlNote)}</span></p>
        <div class="quiz-bench" aria-hidden="true">${bench}</div>
        <p class="quiz-bench-line">${escapeHtml(copy.benchLine)}</p>
      </div>
      <form class="quiz-form" id="quiz-form">${questions}</form>
    </div>`;
}

function renderQuestion(question: QuizQuestion, index: number): string {
  const options = question.options
    .map(
      (option) => `
      <label class="answer-card">
        <input class="visually-hidden" type="radio" name="${escapeHtml(question.id)}" value="${escapeHtml(option.value)}" />
        <span class="answer-icon">${answerIcons[option.icon] ?? ''}</span>
        <span class="answer-copy">
          <span class="answer-label">${escapeHtml(option.label)}</span>
          <span class="answer-desc">${escapeHtml(option.description)}</span>
        </span>
      </label>`,
    )
    .join('');
  return `
    <fieldset class="quiz-question">
      <legend><span class="question-number" aria-hidden="true">${index + 1}</span><span>${escapeHtml(question.legend)}</span></legend>
      <p class="question-hint">${escapeHtml(question.hint)}</p>
      <div class="answer-options answer-options-${question.options.length}">${options}</div>
    </fieldset>`;
}

export function initQuiz(
  initial: PartialAnswers,
  onChange: (answers: PartialAnswers) => void,
): void {
  const form = document.getElementById('quiz-form');
  if (!(form instanceof HTMLFormElement)) {
    throw new Error('Quiz form failed to render');
  }
  applyAnswers(form, initial);
  form.addEventListener('change', () => {
    onChange(readAnswers(form));
  });
}

function applyAnswers(form: HTMLFormElement, answers: PartialAnswers): void {
  for (const [name, value] of Object.entries(answers)) {
    if (value === undefined) {
      continue;
    }
    const input = form.querySelector(`input[name="${name}"][value="${value}"]`);
    if (input instanceof HTMLInputElement) {
      input.checked = true;
    }
  }
}

function readAnswers(form: HTMLFormElement): PartialAnswers {
  const data = new FormData(form);
  const answers: PartialAnswers = {};
  const light = data.get('light');
  if (typeof light === 'string' && isLightLevel(light)) {
    answers.light = light;
  }
  const care = data.get('care');
  if (typeof care === 'string' && isCareHabit(care)) {
    answers.care = care;
  }
  const pets = data.get('pets');
  if (typeof pets === 'string' && isPetsAnswer(pets)) {
    answers.pets = pets;
  }
  return answers;
}
