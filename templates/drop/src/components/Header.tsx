import { dropNumberLabel, site } from "~/utils/content";
import type { DropStatus } from "~/utils/drop";

interface HeaderProps {
  status: DropStatus;
}

export function Header({ status }: HeaderProps) {
  return (
    <header className="site-header">
      <p className="site-brand">
        {site.shopName}
        <span className="site-city">{site.city}</span>
      </p>
      <p className="site-drop-label">Drop {dropNumberLabel} / one of one</p>
      <div className="site-header-end">
        <span
          className={`status-chip${status === "live" ? " is-live" : ""}`}
        >
          {status === "live" ? "Live now" : "Upcoming"}
        </span>
        <a className="site-email" href={`mailto:${site.email}`}>
          {site.email}
        </a>
      </div>
    </header>
  );
}
