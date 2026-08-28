interface WaveformBarsProps {
  /** Bar heights in the 0–1 range, from lib/waveform. */
  bars: number[];
  /** 0–1 fraction rendered in the "played" color. Defaults to 0. */
  progress?: number;
  className?: string;
}

const BAR_STEP = 3;
const BAR_WIDTH = 2;

/**
 * Presentational waveform. Colors come from the CSS custom properties
 * `--wave-rest` and `--wave-played`, set by the surrounding component.
 */
export function WaveformBars({ bars, progress = 0, className }: WaveformBarsProps) {
  const playedCount = Math.round(progress * bars.length);
  const width = bars.length * BAR_STEP - (BAR_STEP - BAR_WIDTH);

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} 100`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {bars.map((height, index) => {
        const barHeight = Math.max(4, height * 96);
        return (
          <rect
            key={index}
            x={index * BAR_STEP}
            y={(100 - barHeight) / 2}
            width={BAR_WIDTH}
            height={barHeight}
            rx={1}
            style={{
              fill:
                index < playedCount
                  ? "var(--wave-played, #c8f636)"
                  : "var(--wave-rest, #3d2f6b)",
            }}
          />
        );
      })}
    </svg>
  );
}
