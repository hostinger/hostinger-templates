/** Shapes for the committed content files in `src/lib/data/`. */

export interface PlanSession {
	/** Short coach-style name for the session. */
	title: string;
	/** Interval instructions, e.g. "Run 1 min / walk 90 sec — repeat × 8". */
	workout: string;
	/** Approximate total time including warm-up and cool-down walks. */
	minutes: number;
}

export interface PlanWeek {
	week: number;
	title: string;
	/** Short label for the week's headline effort, shown as a chip. */
	focus: string;
	coachNote: string;
	sessions: PlanSession[];
}

export interface Plan {
	/** One sentence explaining the warm-up / cool-down convention. */
	sessionFrame: string;
	weeks: PlanWeek[];
}

export interface SocialLink {
	label: string;
	href: string;
}

export interface Faq {
	question: string;
	answer: string;
}

export interface SiteContent {
	planName: string;
	clubName: string;
	coachName: string;
	coachFirstName: string;
	credential: string;
	tagline: string;
	heroEyebrow: string;
	heroTitle: string;
	heroLede: string;
	privacyNote: string;
	planIntro: string;
	email: string;
	emailSubject: string;
	phoneDisplay: string;
	phoneHref: string;
	location: string;
	meetup: string;
	coachBio: string[];
	socials: SocialLink[];
	faqs: Faq[];
}
