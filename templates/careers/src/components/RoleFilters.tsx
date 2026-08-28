import type { RemotePolicy } from "~/types/content";
import { hiringTeams, roles, site } from "~/utils/content";
import type { FilterSelection } from "~/utils/filters";
import {
  countRolesForLocation,
  countRolesForPolicy,
  countRolesForTeam,
  hasActiveFilters,
  presentPolicies,
  uniqueLocations,
} from "~/utils/filters";

const locations = uniqueLocations(roles);
const policies = presentPolicies(roles);

interface FilterChipProps {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
  dotHue?: string;
}

function FilterChip({ label, count, checked, onChange, dotHue }: FilterChipProps) {
  return (
    <label className="filter-chip">
      <input
        type="checkbox"
        className="filter-chip-input"
        checked={checked}
        onChange={onChange}
      />
      <span className="filter-chip-face">
        {dotHue && (
          <span className={`chip-dot chip-dot--${dotHue}`} aria-hidden="true" />
        )}
        {label}
        <span className="filter-chip-count">{count}</span>
      </span>
    </label>
  );
}

interface RoleFiltersProps {
  selection: FilterSelection;
  onToggleTeam: (team: string) => void;
  onToggleLocation: (location: string) => void;
  onTogglePolicy: (policy: RemotePolicy) => void;
  onClear: () => void;
}

export function RoleFilters({
  selection,
  onToggleTeam,
  onToggleLocation,
  onTogglePolicy,
  onClear,
}: RoleFiltersProps) {
  return (
    <form
      className="role-filters"
      aria-label={site.board.filtersLabel}
      onSubmit={(event) => event.preventDefault()}
    >
      <fieldset className="filter-group">
        <legend className="filter-legend">{site.board.teamLegend}</legend>
        <div className="filter-options">
          {hiringTeams.map((team) => (
            <FilterChip
              key={team.name}
              label={team.name}
              dotHue={team.hue}
              count={countRolesForTeam(roles, selection, team.name)}
              checked={selection.teams.includes(team.name)}
              onChange={() => onToggleTeam(team.name)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="filter-group">
        <legend className="filter-legend">{site.board.locationLegend}</legend>
        <div className="filter-options">
          {locations.map((location) => (
            <FilterChip
              key={location}
              label={location}
              count={countRolesForLocation(roles, selection, location)}
              checked={selection.locations.includes(location)}
              onChange={() => onToggleLocation(location)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="filter-group">
        <legend className="filter-legend">{site.board.policyLegend}</legend>
        <div className="filter-options">
          {policies.map((policy) => (
            <FilterChip
              key={policy}
              label={site.policyLabels[policy]}
              count={countRolesForPolicy(roles, selection, policy)}
              checked={selection.policies.includes(policy)}
              onChange={() => onTogglePolicy(policy)}
            />
          ))}
        </div>
      </fieldset>

      {hasActiveFilters(selection) && (
        <button type="button" className="filter-clear" onClick={onClear}>
          {site.board.clearLabel}
        </button>
      )}
    </form>
  );
}
