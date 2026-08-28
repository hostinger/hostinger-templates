import { getTeamHue } from "~/utils/content";

/** Colored team tag; each team's hue is declared in src/data/roles.json. */
export function TeamChip({ team }: { team: string }) {
  return <span className={`chip chip--${getTeamHue(team)}`}>{team}</span>;
}
