interface CalibrationPlotProps {
  confidence: number;
}

export function CalibrationPlot({ confidence }: CalibrationPlotProps) {
  const markerX = 38 + confidence * 2.55;

  return (
    <figure className="plot">
      <figcaption>Confidence calibration / local ruleset</figcaption>
      <svg viewBox="0 0 330 128" role="img" aria-label={`Confidence calibration plot showing ${confidence} percent`}>
        <g className="plot-grid">
          <path d="M38 14V104H310" />
          <path d="M38 82H310M38 59H310M38 36H310" />
        </g>
        <path className="plot-reference" d="M38 104L310 14" />
        <path className="plot-line" d="M38 99C84 88 111 80 145 66S215 45 310 18" />
        <circle className="plot-marker" cx={markerX} cy={108 - confidence * 0.88} r="5" />
        <g className="plot-labels">
          <text x="38" y="122">0</text>
          <text x="166" y="122">.5</text>
          <text x="298" y="122">1.0</text>
          <text x="4" y="18">observed</text>
        </g>
      </svg>
    </figure>
  );
}
