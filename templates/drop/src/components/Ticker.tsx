interface TickerProps {
  segments: string[];
}

/**
 * Full-bleed marquee strip. The content is decorative repetition of facts
 * shown in the masthead, so the whole strip is hidden from screen readers.
 * The track holds two identical runs; the animation shifts it by exactly one
 * run's width for a seamless loop.
 */
export function Ticker({ segments }: TickerProps) {
  const run = (
    <span className="ticker-run">
      {segments.map((segment, index) => (
        <span className="ticker-item" key={index}>
          {segment}
          <span className="ticker-box" />
        </span>
      ))}
    </span>
  );

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {run}
        {run}
      </div>
    </div>
  );
}
