/**
 * The terminal renders typed lines, not HTML strings, so command output stays
 * plain data derived from `resume.json` and the component decides presentation.
 */

export type LineTone = 'default' | 'muted' | 'accent' | 'error';

export interface TerminalLink {
	label: string;
	href: string;
}

export type TerminalLine =
	| { type: 'blank' }
	| { type: 'heading'; text: string }
	| { type: 'text'; text: string; tone: LineTone; indent: number }
	| { type: 'pair'; key: string; value: string }
	| { type: 'links'; links: TerminalLink[]; indent: number };

export const blank = (): TerminalLine => ({ type: 'blank' });

export const heading = (text: string): TerminalLine => ({ type: 'heading', text });

export const text = (value: string, tone: LineTone = 'default', indent = 0): TerminalLine => ({
	type: 'text',
	text: value,
	tone,
	indent
});

export const pair = (key: string, value: string): TerminalLine => ({ type: 'pair', key, value });

export const links = (items: TerminalLink[], indent = 0): TerminalLine => ({
	type: 'links',
	links: items,
	indent
});
