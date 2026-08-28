import { Link } from "react-router";

import { TeamChip } from "~/components/TeamChip";
import { ArrowRight } from "~/icons/ArrowRight";
import type { Role } from "~/types/content";
import { site } from "~/utils/content";

export function RoleCard({ role }: { role: Role }) {
  return (
    <li>
      <article className="role-card">
        <div className="role-card-chips">
          <TeamChip team={role.team} />
          <span className="policy-chip">
            {site.policyLabels[role.remotePolicy]}
          </span>
        </div>
        <h3 className="role-card-title">
          <Link className="role-card-link" to={`/roles/${role.slug}`}>
            {role.title}
          </Link>
        </h3>
        <p className="role-card-liner">{role.oneLiner}</p>
        <p className="role-card-meta">
          <span>{role.location}</span>
          {role.salaryRange && <span>{role.salaryRange}</span>}
        </p>
        <span className="role-card-cta" aria-hidden="true">
          {site.board.cardCta}
          <ArrowRight />
        </span>
      </article>
    </li>
  );
}
