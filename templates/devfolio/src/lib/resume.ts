import resumeData from '$lib/data/resume.json';
import faqData from '$lib/data/faq.json';
import type { Faq, ResumeContent } from '$lib/types';

/** The single source of truth for every word on the page and in the terminal. */
export const resume: ResumeContent = resumeData;

/** FAQ copy, rendered in the FAQ section and its FAQPage JSON-LD. */
export const faqs: Faq[] = faqData;

/** "Say hello" target, built from the same email address shown on screen. */
export const mailtoHref = `mailto:${resume.email}?subject=${encodeURIComponent(resume.emailSubject)}`;

/** Shell prompt shown in the status bar, the terminal, and echoed commands. */
export const prompt = `${resume.meta.username}@${resume.meta.hostname}:~$`;

/** man-page reference shown in the manual header, e.g. `JUNE-PARK(1)`. */
export const manualRef = `${resume.name.toUpperCase().replace(/\s+/g, '-')}(1)`;
