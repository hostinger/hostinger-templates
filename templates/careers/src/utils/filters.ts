import type { RemotePolicy, Role } from "~/types/content";
import { REMOTE_POLICIES } from "~/types/content";

/**
 * Active board filters. Values inside one dimension are OR-ed together;
 * the three dimensions are AND-ed, so filters combine.
 */
export interface FilterSelection {
  teams: string[];
  locations: string[];
  policies: RemotePolicy[];
}

export const EMPTY_SELECTION: FilterSelection = {
  teams: [],
  locations: [],
  policies: [],
};

export function hasActiveFilters(selection: FilterSelection): boolean {
  return (
    selection.teams.length > 0 ||
    selection.locations.length > 0 ||
    selection.policies.length > 0
  );
}

export function matchesSelection(
  role: Role,
  selection: FilterSelection,
): boolean {
  const teamOk =
    selection.teams.length === 0 || selection.teams.includes(role.team);
  const locationOk =
    selection.locations.length === 0 ||
    selection.locations.includes(role.location);
  const policyOk =
    selection.policies.length === 0 ||
    selection.policies.includes(role.remotePolicy);
  return teamOk && locationOk && policyOk;
}

export function filterRoles(
  roles: Role[],
  selection: FilterSelection,
): Role[] {
  return roles.filter((role) => matchesSelection(role, selection));
}

/** Adds `value` to the list when absent, removes it when present. */
export function toggleValue<T>(values: readonly T[], value: T): T[] {
  return values.includes(value)
    ? values.filter((existing) => existing !== value)
    : [...values, value];
}

/** Distinct role locations, in first-appearance order. */
export function uniqueLocations(roles: Role[]): string[] {
  return roles
    .map((role) => role.location)
    .filter((location, index, all) => all.indexOf(location) === index);
}

/** Remote policies that at least one role uses, in canonical order. */
export function presentPolicies(roles: Role[]): RemotePolicy[] {
  return REMOTE_POLICIES.filter((policy) =>
    roles.some((role) => role.remotePolicy === policy),
  );
}

/**
 * Live option counts: how many roles would show if `team` were the only
 * team filter, keeping the other dimensions' current selections.
 */
export function countRolesForTeam(
  roles: Role[],
  selection: FilterSelection,
  team: string,
): number {
  return filterRoles(roles, { ...selection, teams: [team] }).length;
}

export function countRolesForLocation(
  roles: Role[],
  selection: FilterSelection,
  location: string,
): number {
  return filterRoles(roles, { ...selection, locations: [location] }).length;
}

export function countRolesForPolicy(
  roles: Role[],
  selection: FilterSelection,
  policy: RemotePolicy,
): number {
  return filterRoles(roles, { ...selection, policies: [policy] }).length;
}
