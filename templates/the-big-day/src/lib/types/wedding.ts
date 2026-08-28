export type Attendance = 'yes' | 'no' | '';

export interface WeddingContent {
	couple: { first: string; second: string; monogram: string };
	date: { display: string; short: string };
	venue: { name: string; location: string; address: string; mapUrl: string };
	rsvp: { deadline: string; email: string };
	navigation: { label: string; href: string }[];
	hero: { eyebrow: string; title: string; note: string };
	story: { kicker: string; title: string; paragraphs: string[] };
	schedule: { time: string; title: string; detail: string }[];
	travel: {
		intro: string;
		hotels: { name: string; distance: string; detail: string; url: string }[];
	};
	faq: { question: string; answer: string }[];
	footer: { signoff: string; note: string };
}

export interface RsvpValues {
	name: string;
	attendance: Attendance;
	hasPlusOne: boolean;
	plusOneName: string;
	dietaryNeeds: string;
	message: string;
}
