/** Shapes for the committed content files in `src/lib/data/`. */

export interface SiteMeta {
	/** Used in the page <title> and the terminal welcome banner caption. */
	siteTitle: string;
	/** Shell identity shown in the prompt, e.g. `june@devfolio:~$`. */
	username: string;
	hostname: string;
	/** One-sentence lede used in the hero and as the meta description. */
	tagline: string;
	/** Playful man-page usage line shown in the ABOUT section. */
	synopsis: string;
}

export interface LinkItem {
	label: string;
	href: string;
}

export interface ExperienceEntry {
	company: string;
	title: string;
	start: string;
	/** Use "present" for a current role. */
	end: string;
	location: string;
	/** Impact bullets — lead with the outcome. */
	bullets: string[];
}

export interface Project {
	name: string;
	description: string;
	stack: string[];
	links: LinkItem[];
}

export interface SkillGroup {
	group: string;
	items: string[];
}

export interface EducationEntry {
	school: string;
	program: string;
	years: string;
	note?: string;
}

export interface ResumeContent {
	meta: SiteMeta;
	name: string;
	role: string;
	location: string;
	/** Short first-person pitch — opens the ABOUT section and the `about` command. */
	summary: string;
	/** Additional ABOUT paragraphs. */
	about: string[];
	email: string;
	emailSubject: string;
	/** One line above the email address in the CONTACT section and command. */
	contactLede: string;
	socials: LinkItem[];
	experience: ExperienceEntry[];
	projects: Project[];
	skills: SkillGroup[];
	education: EducationEntry[];
}

export interface Faq {
	question: string;
	answer: string;
}
