interface EpisodeArtProps {
  episodeNumber: number;
  className?: string;
}

const PANEL = "#160f2b";
const VIOLET_DEEP = "#2c1b5e";
const VIOLET = "#6d3ae8";
const VIOLET_SOFT = "#9a7bf7";
const VIOLET_FAINT = "#3d2f6b";
const LIME = "#c8f636";

function SignalRings() {
  const rings = [
    { r: 34, width: 10, color: VIOLET_DEEP, dash: "none" },
    { r: 62, width: 3, color: VIOLET, dash: "none" },
    { r: 88, width: 2, color: VIOLET_SOFT, dash: "4 10" },
    { r: 114, width: 6, color: VIOLET_FAINT, dash: "none" },
    { r: 138, width: 2, color: VIOLET, dash: "2 14" },
  ];
  return (
    <>
      {rings.map((ring) => (
        <circle
          key={ring.r}
          cx="160"
          cy="160"
          r={ring.r}
          fill="none"
          stroke={ring.color}
          strokeWidth={ring.width}
          strokeDasharray={ring.dash === "none" ? undefined : ring.dash}
        />
      ))}
      <circle cx="160" cy="160" r="12" fill={LIME} />
      <circle cx="222" cy="98" r="8" fill={LIME} />
      <circle cx="86" cy="234" r="5" fill={VIOLET_SOFT} />
    </>
  );
}

function AuroraColumns() {
  const columns = [
    { x: 28, h: 118, color: VIOLET_DEEP },
    { x: 60, h: 176, color: VIOLET },
    { x: 92, h: 138, color: VIOLET_FAINT },
    { x: 124, h: 212, color: VIOLET_SOFT },
    { x: 156, h: 160, color: VIOLET },
    { x: 188, h: 228, color: LIME },
    { x: 220, h: 150, color: VIOLET_DEEP },
    { x: 252, h: 190, color: VIOLET },
    { x: 284, h: 126, color: VIOLET_FAINT },
  ];
  return (
    <>
      {columns.map((column) => (
        <rect
          key={column.x}
          x={column.x - 9}
          y={262 - column.h}
          width="18"
          height={column.h}
          rx="9"
          fill={column.color}
          opacity={column.color === LIME ? 1 : 0.9}
        />
      ))}
      <rect x="16" y="270" width="288" height="3" rx="1.5" fill={VIOLET_FAINT} />
    </>
  );
}

function RadiatingArcs() {
  const arcs = [
    { r: 48, width: 12, color: VIOLET_DEEP },
    { r: 86, width: 8, color: VIOLET },
    { r: 124, width: 5, color: VIOLET_FAINT },
    { r: 162, width: 3, color: VIOLET_SOFT },
    { r: 200, width: 2, color: VIOLET },
  ];
  return (
    <>
      {arcs.map((arc) => (
        <path
          key={arc.r}
          d={`M ${160 - arc.r} 268 A ${arc.r} ${arc.r} 0 0 1 ${160 + arc.r} 268`}
          fill="none"
          stroke={arc.color}
          strokeWidth={arc.width}
          strokeLinecap="round"
        />
      ))}
      <circle cx="160" cy="268" r="14" fill={LIME} />
      <circle cx="238" cy="160" r="6" fill={LIME} />
    </>
  );
}

function TapeReels() {
  return (
    <>
      <path
        d="M 88 214 Q 160 250 232 214"
        fill="none"
        stroke={VIOLET_SOFT}
        strokeWidth="4"
      />
      <circle cx="88" cy="140" r="62" fill="none" stroke={VIOLET} strokeWidth="10" />
      <circle cx="88" cy="140" r="34" fill="none" stroke={VIOLET_FAINT} strokeWidth="4" strokeDasharray="6 8" />
      <circle cx="88" cy="140" r="12" fill={LIME} />
      <circle cx="232" cy="140" r="46" fill="none" stroke={VIOLET_DEEP} strokeWidth="18" />
      <circle cx="232" cy="140" r="12" fill={LIME} />
      <rect x="64" y="252" width="192" height="10" rx="5" fill={VIOLET_FAINT} />
    </>
  );
}

function RouteGrid() {
  const dots: { x: number; y: number }[] = [];
  for (let row = 0; row < 6; row += 1) {
    for (let col = 0; col < 6; col += 1) {
      dots.push({ x: 45 + col * 46, y: 45 + row * 46 });
    }
  }
  const stations = [
    { x: 45, y: 275 },
    { x: 137, y: 183 },
    { x: 229, y: 183 },
    { x: 275, y: 45 },
  ];
  return (
    <>
      {dots.map((dot) => (
        <circle key={`${dot.x}-${dot.y}`} cx={dot.x} cy={dot.y} r="4" fill={VIOLET_FAINT} />
      ))}
      <path
        d="M 45 275 L 91 275 L 137 229 L 137 183 L 229 183 L 275 137 L 275 45"
        fill="none"
        stroke={LIME}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {stations.map((station) => (
        <rect
          key={`${station.x}-${station.y}`}
          x={station.x - 9}
          y={station.y - 9}
          width="18"
          height="18"
          rx="4"
          fill={PANEL}
          stroke={VIOLET_SOFT}
          strokeWidth="4"
        />
      ))}
    </>
  );
}

const VARIANTS = [SignalRings, AuroraColumns, RadiatingArcs, TapeReels, RouteGrid];

/**
 * Original vector cover art. The episode number picks one of five
 * compositions, so art stays stable per episode across the whole site.
 */
export function EpisodeArt({ episodeNumber, className }: EpisodeArtProps) {
  const Variant = VARIANTS[episodeNumber % VARIANTS.length];
  return (
    <svg
      className={className}
      viewBox="0 0 320 320"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="320" height="320" fill={PANEL} />
      <Variant />
    </svg>
  );
}
