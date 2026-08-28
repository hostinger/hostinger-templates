import { availableItems, drop, dropNumberLabel, site } from "~/utils/content";
import type { DropStatus } from "~/utils/drop";
import {
  formatDropDate,
  formatDropTime,
  getCountdownParts,
  padUnit,
} from "~/utils/drop";

interface CountdownMastheadProps {
  now: Date | null;
  status: DropStatus;
}

const CELL_LABELS = ["days", "hours", "minutes", "seconds"] as const;

export function CountdownMasthead({ now, status }: CountdownMastheadProps) {
  const parts = now ? getCountdownParts(drop.dropDatetime, now) : null;
  const values = parts
    ? [
        padUnit(parts.days),
        padUnit(parts.hours),
        padUnit(parts.minutes),
        padUnit(parts.seconds),
      ]
    : ["--", "--", "--", "--"];

  const dateLine = `${formatDropDate(drop.dropDatetime, drop.timezone)} · ${formatDropTime(drop.dropDatetime, drop.timezone)} ${drop.timezoneLabel}`;

  return (
    <section className="masthead" aria-labelledby="drop-title">
      <div className="masthead-top">
        <div>
          <p className="masthead-kicker">
            Drop {dropNumberLabel} — {site.tagline}
          </p>
          <h1 id="drop-title" className="masthead-title">
            {drop.dropName}
          </h1>
        </div>
        <p className="masthead-intro">{site.intro}</p>
      </div>

      {status === "upcoming" ? (
        <div className="countdown">
          <p className="countdown-heading">Claims open in</p>
          <p className="sr-only">Claims open {dateLine}.</p>
          <div className="countdown-cells" aria-hidden="true">
            {values.map((value, index) => (
              <span key={CELL_LABELS[index]} className="countdown-group">
                <span className="countdown-cell">
                  <span className="countdown-value">{value}</span>
                  <span className="countdown-label">{CELL_LABELS[index]}</span>
                </span>
                {index < values.length - 1 && (
                  <span className="countdown-colon">:</span>
                )}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="drop-live">
          <p className="drop-live-title">Live now</p>
          <p className="drop-live-sub">
            Claims opened {dateLine}. First email wins —{" "}
            {availableItems.length} of {drop.items.length} pieces still
            unclaimed.
          </p>
        </div>
      )}

      <div className="masthead-meta">
        <p className="masthead-meta-strong">{dateLine}</p>
        <p>
          {drop.items.length} pieces · one of each · claims by email
        </p>
        <p className="masthead-meta-accent">
          {availableItems.length} still unclaimed
        </p>
      </div>
    </section>
  );
}
