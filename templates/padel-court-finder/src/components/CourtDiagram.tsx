type CourtDiagramProps = {
  labelled?: boolean;
  className?: string;
  title?: string;
};

const SERVICE_LINE = 3.05;

export function CourtDiagram({ labelled = false, className, title }: CourtDiagramProps) {
  const pad = labelled ? 2.4 : 0.6;
  const viewBox = `${-pad} ${-pad} ${20 + pad * 2} ${10 + pad * 2}`;

  return (
    <svg
      className={['court', labelled && 'court--labelled', className].filter(Boolean).join(' ')}
      viewBox={viewBox}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <rect className="court__turf" x="0" y="0" width="20" height="10" />
      <rect className="court__turf-alt" x={SERVICE_LINE} y="0" width={20 - SERVICE_LINE * 2} height="10" />
      <g className="court__lines">
        <rect x="0" y="0" width="20" height="10" />
        <line x1={SERVICE_LINE} y1="0" x2={SERVICE_LINE} y2="10" />
        <line x1={20 - SERVICE_LINE} y1="0" x2={20 - SERVICE_LINE} y2="10" />
        <line x1={SERVICE_LINE} y1="5" x2={20 - SERVICE_LINE} y2="5" />
      </g>
      <line className="court__net" x1="10" y1="-0.3" x2="10" y2="10.3" />
      <g className="court__glass">
        <path d="M4 0H0V10H4M16 0H20V10H16" />
      </g>
      <g className="court__mesh">
        <line x1="4" y1="0" x2="16" y2="0" />
        <line x1="4" y1="10" x2="16" y2="10" />
      </g>
      {labelled && (
        <g className="court__labels">
          <text x="10" y="-1.1" textAnchor="middle">20 m</text>
          <text x="-1.1" y="5" textAnchor="middle" transform="rotate(-90 -1.1 5)">10 m</text>
          <text x="10" y="11.8" textAnchor="middle">Net</text>
          <text x={SERVICE_LINE} y="11.8" textAnchor="middle">Service line</text>
          <text x={20 - SERVICE_LINE} y="11.8" textAnchor="middle">Service line</text>
          <text x="2" y="-1.1" textAnchor="middle">Glass</text>
          <text x="18" y="-1.1" textAnchor="middle">Glass</text>
          <text x="6.5" y="-1.1" textAnchor="middle">Mesh</text>
          <text x="13.5" y="-1.1" textAnchor="middle">Mesh</text>
        </g>
      )}
    </svg>
  );
}
