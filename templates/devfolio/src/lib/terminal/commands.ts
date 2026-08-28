/**
 * Command registry for the interactive terminal.
 *
 * Every command renders from the same `resume` object the HTML sections use,
 * so the terminal and the page can never drift apart. To add a command, append
 * an entry to `commands` — `help`, tab completion, and "did you mean"
 * suggestions pick it up automatically.
 */

import { mailtoHref, resume } from '$lib/resume';
import { blank, heading, links, pair, text, type TerminalLine } from './output';

export type CommandOutcome = { kind: 'lines'; lines: TerminalLine[] } | { kind: 'clear' };

export interface TerminalCommand {
	name: string;
	aliases: string[];
	/** One-line description shown by `help`. */
	summary: string;
	run: () => CommandOutcome;
}

const lines = (...items: TerminalLine[]): CommandOutcome => ({ kind: 'lines', lines: items });

export const commands: TerminalCommand[] = [
	{
		name: 'help',
		aliases: [],
		summary: 'list every command with a one-line summary',
		run: () =>
			lines(
				heading('AVAILABLE COMMANDS'),
				...commands.map((command) =>
					pair(
						[command.name, ...command.aliases].join(' | '),
						command.summary
					)
				),
				blank(),
				text('tip: the up and down arrows walk your command history; tab completes a name.', 'muted')
			)
	},
	{
		name: 'about',
		aliases: [],
		summary: 'summary, role, and location',
		run: () =>
			lines(
				heading('ABOUT'),
				pair('name', resume.name),
				pair('role', resume.role),
				pair('location', resume.location),
				blank(),
				text(resume.summary),
				...resume.about.flatMap((paragraph) => [blank(), text(paragraph)])
			)
	},
	{
		name: 'experience',
		aliases: ['work'],
		summary: 'three roles with impact bullets',
		run: () =>
			lines(
				heading('EXPERIENCE'),
				...resume.experience.flatMap((job, index) => [
					...(index > 0 ? [blank()] : []),
					text(`${job.title} · ${job.company}`, 'accent'),
					text(`${job.start} – ${job.end} · ${job.location}`, 'muted', 1),
					...job.bullets.map((bullet) => text(`- ${bullet}`, 'default', 1))
				])
			)
	},
	{
		name: 'projects',
		aliases: [],
		summary: 'four side projects with stack and links',
		run: () =>
			lines(
				heading('PROJECTS'),
				...resume.projects.flatMap((project, index) => [
					...(index > 0 ? [blank()] : []),
					text(project.name, 'accent'),
					text(project.description, 'default', 1),
					text(`stack: ${project.stack.join(' · ')}`, 'muted', 1),
					links(project.links, 1)
				])
			)
	},
	{
		name: 'skills',
		aliases: [],
		summary: 'grouped languages and tools',
		run: () =>
			lines(
				heading('SKILLS'),
				...resume.skills.map((group) => pair(group.group, group.items.join(' · ')))
			)
	},
	{
		name: 'education',
		aliases: [],
		summary: 'degrees and detours',
		run: () =>
			lines(
				heading('EDUCATION'),
				...resume.education.flatMap((entry, index) => [
					...(index > 0 ? [blank()] : []),
					text(`${entry.program} · ${entry.school}`, 'accent'),
					text(entry.years, 'muted', 1),
					...(entry.note ? [text(entry.note, 'default', 1)] : [])
				])
			)
	},
	{
		name: 'contact',
		aliases: [],
		summary: 'email and social links',
		run: () =>
			lines(
				heading('CONTACT'),
				text(resume.contactLede),
				links([{ label: resume.email, href: mailtoHref }], 1),
				links(resume.socials, 1),
				blank(),
				text(`based in ${resume.location}`, 'muted')
			)
	},
	{
		name: 'whoami',
		aliases: [],
		summary: 'the short version',
		run: () =>
			lines(
				text(resume.meta.username),
				text(`(${resume.name} — ${resume.role}, ${resume.location})`, 'muted')
			)
	},
	{
		name: 'clear',
		aliases: [],
		summary: 'wipe the terminal output',
		run: () => ({ kind: 'clear' })
	}
];

function findCommand(name: string): TerminalCommand | undefined {
	return commands.find(
		(command) => command.name === name || command.aliases.includes(name)
	);
}

function allNames(): string[] {
	return commands.flatMap((command) => [command.name, ...command.aliases]);
}

/** Classic dynamic-programming edit distance, small enough for command names. */
function editDistance(a: string, b: string): number {
	const rows = a.length + 1;
	const cols = b.length + 1;
	const distance = Array.from({ length: rows }, (_, row) => {
		const line = new Array<number>(cols).fill(0);
		line[0] = row;
		return line;
	});
	for (let col = 0; col < cols; col += 1) distance[0][col] = col;
	for (let row = 1; row < rows; row += 1) {
		for (let col = 1; col < cols; col += 1) {
			const substitution = a[row - 1] === b[col - 1] ? 0 : 1;
			distance[row][col] = Math.min(
				distance[row - 1][col] + 1,
				distance[row][col - 1] + 1,
				distance[row - 1][col - 1] + substitution
			);
		}
	}
	return distance[rows - 1][cols - 1];
}

/** Closest known command within two edits, used for "did you mean". */
export function suggestCommand(input: string): string | null {
	let best: string | null = null;
	let bestDistance = 3;
	for (const name of allNames()) {
		const distance = editDistance(input, name);
		if (distance < bestDistance) {
			best = name;
			bestDistance = distance;
		}
	}
	return best;
}

/** Parse a raw input line and run the matching command. */
export function executeCommand(rawInput: string): CommandOutcome {
	const input = rawInput.trim().toLowerCase();
	if (!input) return { kind: 'lines', lines: [] };

	const [name] = input.split(/\s+/);
	const command = findCommand(name);
	if (command) return command.run();

	const suggestion = suggestCommand(name);
	return {
		kind: 'lines',
		lines: [
			text(`command not found: ${name}`, 'error'),
			...(suggestion ? [text(`did you mean '${suggestion}'?`)] : []),
			text(`type 'help' to list available commands.`, 'muted')
		]
	};
}

export interface Completion {
	/** Full replacement for the input when completion is possible. */
	completed: string | null;
	/** Every command name matching the typed prefix. */
	candidates: string[];
}

function longestCommonPrefix(values: string[]): string {
	if (values.length === 0) return '';
	let prefix = values[0];
	for (const value of values.slice(1)) {
		while (!value.startsWith(prefix)) prefix = prefix.slice(0, -1);
	}
	return prefix;
}

/** Bash-style tab completion over command names and aliases. */
export function completeCommand(input: string): Completion {
	const token = input.trimStart().toLowerCase();
	if (!token || /\s/.test(token)) return { completed: null, candidates: [] };

	const candidates = allNames().filter((name) => name.startsWith(token)).sort();
	if (candidates.length === 0) return { completed: null, candidates: [] };
	if (candidates.length === 1) return { completed: candidates[0], candidates };

	const prefix = longestCommonPrefix(candidates);
	return { completed: prefix.length > token.length ? prefix : null, candidates };
}
