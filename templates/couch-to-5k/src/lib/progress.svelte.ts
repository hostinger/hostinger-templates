import { browser } from '$app/environment';
import { SvelteSet } from 'svelte/reactivity';
import { allSessionIds } from '$lib/plan';

/**
 * Session progress lives in `localStorage` on the visitor's own device.
 * There is no account and no sync — clearing site data resets the plan.
 */
const STORAGE_KEY = 'couch-to-5k.progress.v1';

const KNOWN_IDS = new Set(allSessionIds);

function readStoredIds(): string[] {
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed: unknown = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.filter((id): id is string => typeof id === 'string' && KNOWN_IDS.has(id));
	} catch {
		return [];
	}
}

class ProgressStore {
	/** Ids of completed sessions, reactive. */
	readonly done = new SvelteSet<string>();

	constructor() {
		if (!browser) return;
		for (const id of readStoredIds()) this.done.add(id);
	}

	isDone(id: string): boolean {
		return this.done.has(id);
	}

	toggle(id: string): void {
		if (this.done.has(id)) {
			this.done.delete(id);
		} else {
			this.done.add(id);
		}
		this.#persist();
	}

	reset(): void {
		this.done.clear();
		this.#persist();
	}

	/** How many of the given session ids are done. */
	countOf(ids: string[]): number {
		return ids.reduce((count, id) => count + (this.done.has(id) ? 1 : 0), 0);
	}

	get totalDone(): number {
		return this.done.size;
	}

	#persist(): void {
		if (!browser) return;
		try {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...this.done]));
		} catch {
			// Storage can be unavailable (private mode, quota). Ticks then last for this visit only.
		}
	}
}

export const progress = new ProgressStore();
