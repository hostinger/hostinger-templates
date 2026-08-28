import type { SplitResult } from '../types';
import { APP_COPY } from '../constants/copy';
import { WINDOW_LABELS } from '../constants/weights';
import { formatMultiplier, formatPence, formatPenceDelta, formatShare } from '../lib/format';

interface BreakdownPanelProps {
  result: SplitResult | null;
}

export function BreakdownPanel({ result }: BreakdownPanelProps) {
  return (
    <section className="receipt" aria-labelledby="receipt-heading">
      <header className="receipt__header">
        <h2 id="receipt-heading">{APP_COPY.receipt.heading}</h2>
        <p>{APP_COPY.receipt.subheading}</p>
      </header>

      {result === null ? (
        <p className="receipt__empty">{APP_COPY.receipt.emptyState}</p>
      ) : (
        <>
          <ul className="receipt__rooms">
            {result.shares.map((share) => (
              <li key={share.roomId} className="receipt__room">
                <h3 className="receipt__room-name">
                  <span>{share.name}</span>
                  <span className="receipt__room-final">{formatPence(share.finalAmountPence)}</span>
                </h3>
                <dl className="receipt__lines">
                  <div className="receipt__line">
                    <dt>
                      {APP_COPY.receipt.baseLine}
                      <small>
                        {share.sizeM2} m² = {formatShare(share.sizeShare)}{' '}
                        {APP_COPY.receipt.ofTotalSize}
                      </small>
                    </dt>
                    <dd>{formatPence(share.baseAmountPence)}</dd>
                  </div>
                  <div className="receipt__line">
                    <dt>
                      {APP_COPY.receipt.windowLine}
                      <small>{WINDOW_LABELS[share.window].toLowerCase()}</small>
                    </dt>
                    <dd>{formatMultiplier(share.windowMultiplier)}</dd>
                  </div>
                  <div className="receipt__line">
                    <dt>
                      {APP_COPY.receipt.ensuiteLine}
                      {!share.ensuite && <small>{APP_COPY.receipt.noEnsuite}</small>}
                    </dt>
                    <dd>{formatMultiplier(share.ensuiteMultiplier)}</dd>
                  </div>
                  <div className="receipt__line">
                    <dt>
                      {APP_COPY.receipt.weightedLine}
                      <small>{formatShare(share.weightShare)} of the rent</small>
                    </dt>
                    <dd>{formatPence(share.exactAmountPence)}</dd>
                  </div>
                  <div className="receipt__line">
                    <dt>{APP_COPY.receipt.roundingLine}</dt>
                    <dd>{formatPenceDelta(share.roundingPence)}</dd>
                  </div>
                  <div className="receipt__line receipt__line--final">
                    <dt>{APP_COPY.receipt.finalLine}</dt>
                    <dd>{formatPence(share.finalAmountPence)}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>

          <footer className="receipt__total">
            <p className="receipt__total-row">
              <span>{APP_COPY.receipt.totalLabel}</span>
              <span>{formatPence(result.totalPence)}</span>
            </p>
            <p className="receipt__total-check">
              <span aria-hidden="true">✓</span> {APP_COPY.receipt.totalMatches}
            </p>
            <p className="receipt__note">{APP_COPY.receipt.roundingNote}</p>
          </footer>
        </>
      )}
    </section>
  );
}
