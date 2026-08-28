/** Centralized progress and duration wording, so copy changes happen in one place. */

export function formatSessionsDone(done: number, total: number): string {
	return `${done} of ${total} sessions done`;
}

export function formatWeekProgress(done: number, total: number): string {
	return `${done} of ${total} done`;
}

export function percentDone(done: number, total: number): number {
	if (total === 0) return 0;
	return Math.round((done / total) * 100);
}

export function formatMinutes(minutes: number): string {
	return `≈ ${minutes} min`;
}
