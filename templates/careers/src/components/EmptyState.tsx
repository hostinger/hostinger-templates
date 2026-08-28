import { buildHelloMailto } from "~/utils/apply";
import { site } from "~/utils/content";

export function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="empty-state">
      <svg
        viewBox="0 0 120 44"
        className="empty-shapes"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="16" cy="26" r="12" fill="#ff5c45" />
        <path d="M58 12l14 26H44Z" fill="#5257e5" />
        <rect x="88" y="14" width="24" height="24" rx="7" fill="#16a085" />
      </svg>
      <h3 className="empty-title">{site.board.emptyTitle}</h3>
      <p className="empty-body">{site.board.emptyBody}</p>
      <div className="empty-actions">
        <button type="button" className="button button-secondary" onClick={onClear}>
          {site.board.clearLabel}
        </button>
        <a className="button button-ghost" href={buildHelloMailto(site.email)}>
          {site.board.emptyCtaLabel}
        </a>
      </div>
    </div>
  );
}
