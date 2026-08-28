import plantsJson from './data/plants.json';
import quizJson from './data/quiz.json';
import siteJson from './data/site.json';
import type { Plant, QuizContent, SiteContent } from './types/content';

export const site: SiteContent = siteJson as SiteContent;
export const plants: Plant[] = plantsJson as Plant[];
export const quiz: QuizContent = quizJson as QuizContent;
