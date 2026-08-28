import { useState } from "react";

import { EmptyState } from "~/components/EmptyState";
import { RoleCard } from "~/components/RoleCard";
import { RoleFilters } from "~/components/RoleFilters";
import type { RemotePolicy } from "~/types/content";
import { roles, site } from "~/utils/content";
import type { FilterSelection } from "~/utils/filters";
import { EMPTY_SELECTION, filterRoles, toggleValue } from "~/utils/filters";
import { fillTemplate } from "~/utils/text";

export function FilterBoard() {
  const [selection, setSelection] = useState<FilterSelection>(EMPTY_SELECTION);
  const visibleRoles = filterRoles(roles, selection);

  const toggleTeam = (team: string) =>
    setSelection((current) => ({
      ...current,
      teams: toggleValue(current.teams, team),
    }));

  const toggleLocation = (location: string) =>
    setSelection((current) => ({
      ...current,
      locations: toggleValue(current.locations, location),
    }));

  const togglePolicy = (policy: RemotePolicy) =>
    setSelection((current) => ({
      ...current,
      policies: toggleValue(current.policies, policy),
    }));

  const clear = () => setSelection(EMPTY_SELECTION);

  return (
    <section id="roles" className="board" aria-labelledby="board-title">
      <div className="shell">
        <header className="board-head">
          <p className="kicker">{site.board.kicker}</p>
          <h2 id="board-title" className="section-title">
            {site.board.title}
          </h2>
          <p className="board-note">{site.board.note}</p>
        </header>
        <div className="board-layout">
          <RoleFilters
            selection={selection}
            onToggleTeam={toggleTeam}
            onToggleLocation={toggleLocation}
            onTogglePolicy={togglePolicy}
            onClear={clear}
          />
          <div className="board-results">
            <p className="results-count" role="status">
              {fillTemplate(site.board.resultsTemplate, {
                shown: visibleRoles.length,
                total: roles.length,
              })}
            </p>
            {visibleRoles.length > 0 ? (
              <ul className="role-list">
                {visibleRoles.map((role) => (
                  <RoleCard key={role.slug} role={role} />
                ))}
              </ul>
            ) : (
              <EmptyState onClear={clear} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
