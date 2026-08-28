import rolesJson from "~/data/roles.json";
import siteJson from "~/data/site.json";
import type {
  ChipHue,
  Role,
  RoleSeed,
  SiteContent,
  Team,
  TeamSeed,
} from "~/types/content";
import { isChipHue, isRemotePolicy } from "~/types/content";

export const site: SiteContent = siteJson;

const FALLBACK_HUE: ChipHue = "slate";

function parseTeam(seed: TeamSeed): Team {
  return {
    name: seed.name,
    hue: isChipHue(seed.hue) ? seed.hue : FALLBACK_HUE,
  };
}

function parseRole(seed: RoleSeed): Role {
  if (!isRemotePolicy(seed.remotePolicy)) {
    throw new Error(
      `Role "${seed.slug}" has an unknown remotePolicy "${seed.remotePolicy}". ` +
        `Use "remote", "hybrid", or "on-site" in src/data/roles.json.`,
    );
  }
  return { ...seed, remotePolicy: seed.remotePolicy };
}

export const teams: Team[] = rolesJson.teams.map(parseTeam);
export const roles: Role[] = rolesJson.roles.map(parseRole);

/**
 * Teams shown as filter options: declared teams that have at least one open
 * role, in declaration order, plus any team referenced by a role but missing
 * from the teams list (rendered with the neutral fallback hue).
 */
export const hiringTeams: Team[] = [
  ...teams.filter((team) => roles.some((role) => role.team === team.name)),
  ...roles
    .map((role) => role.team)
    .filter(
      (name, index, all) =>
        all.indexOf(name) === index &&
        !teams.some((team) => team.name === name),
    )
    .map((name) => ({ name, hue: FALLBACK_HUE })),
];

export function getRoleBySlug(slug: string): Role | undefined {
  return roles.find((role) => role.slug === slug);
}

export function getTeamHue(teamName: string): ChipHue {
  return teams.find((team) => team.name === teamName)?.hue ?? FALLBACK_HUE;
}
