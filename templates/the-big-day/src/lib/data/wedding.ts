import content from './wedding.json';
import type { WeddingContent } from '$lib/types/wedding';

export const wedding = content satisfies WeddingContent;

export const faqJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'FAQPage',
	mainEntity: wedding.faq.map((item) => ({
		'@type': 'Question',
		name: item.question,
		acceptedAnswer: {
			'@type': 'Answer',
			text: item.answer
		}
	}))
};
