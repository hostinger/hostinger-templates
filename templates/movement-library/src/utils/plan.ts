const STORAGE_KEY = 'movement-library-plan';

/**
 * Reads the saved plan from localStorage, keeping only ids that still
 * exist in the exercise library.
 */
export const loadPlan = (validIds: ReadonlySet<string>): string[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (id): id is string => typeof id === 'string' && validIds.has(id),
    );
  } catch {
    // Storage unavailable or unreadable — start with an empty plan.
    return [];
  }
};

/** Persists the plan so it survives reloads on this device. */
export const savePlan = (planIds: string[]): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(planIds));
  } catch {
    // Storage unavailable (private mode, quota) — the plan still works in memory.
  }
};

/** Adds the id when absent, removes it when present. */
export const togglePlanId = (planIds: string[], id: string): string[] =>
  planIds.includes(id)
    ? planIds.filter((planId) => planId !== id)
    : [...planIds, id];
