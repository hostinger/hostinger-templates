import planData from '$lib/data/plan.json';
import type { Plan, PlanWeek } from '$lib/types';

/** The full nine-week plan, typed. Edit content in `src/lib/data/plan.json`. */
export const plan: Plan = planData;

export const weeks: PlanWeek[] = plan.weeks;

/** Stable id for one session, used for checkbox ids and stored progress. */
export function sessionId(weekNumber: number, sessionIndex: number): string {
	return `w${weekNumber}s${sessionIndex + 1}`;
}

export function weekSessionIds(week: PlanWeek): string[] {
	return week.sessions.map((_, index) => sessionId(week.week, index));
}

export const allSessionIds: string[] = weeks.flatMap(weekSessionIds);

export const totalSessions: number = allSessionIds.length;

export const totalWeeks: number = weeks.length;
