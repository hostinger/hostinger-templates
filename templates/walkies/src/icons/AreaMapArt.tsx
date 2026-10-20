const HOUSE_BLOCKS = [
  { x: 420, y: 210, width: 34, height: 24 },
  { x: 462, y: 214, width: 26, height: 20 },
  { x: 560, y: 250, width: 30, height: 26 },
  { x: 560, y: 340, width: 38, height: 22 },
  { x: 380, y: 360, width: 28, height: 24 },
  { x: 610, y: 410, width: 30, height: 22 },
  { x: 330, y: 470, width: 34, height: 22 },
  { x: 470, y: 470, width: 28, height: 26 },
  { x: 650, y: 300, width: 26, height: 22 },
];

const WOODLAND_TREES = [
  { cx: 760, cy: 400 },
  { cx: 800, cy: 380 },
  { cx: 842, cy: 404 },
  { cx: 780, cy: 446 },
  { cx: 826, cy: 452 },
  { cx: 868, cy: 440 },
  { cx: 744, cy: 470 },
  { cx: 806, cy: 496 },
  { cx: 852, cy: 492 },
];

export function AreaMapArt() {
  return (
    <svg className="area-map__art" viewBox="0 0 1000 700" aria-hidden="true" focusable="false">
      <rect width="1000" height="700" fill="var(--map-land)" />
      <path d="M40 90 Q160 40 280 110 T300 250 Q190 300 80 250 T40 90 Z" fill="var(--terrain-meadow)" opacity="0.55" />
      <path d="M560 60 Q700 20 800 90 T780 240 Q660 270 580 210 T560 60 Z" fill="var(--terrain-heath)" opacity="0.55" />
      <rect x="400" y="250" width="150" height="110" rx="28" fill="var(--terrain-park)" opacity="0.6" />
      <path d="M700 360 Q820 330 900 390 T880 530 Q760 560 710 500 T700 360 Z" fill="var(--terrain-woodland)" opacity="0.45" />
      <g stroke="var(--map-road)" strokeWidth="10" fill="none" strokeLinecap="round">
        <path d="M0 330 C200 320 400 380 1000 320" />
        <path d="M520 0 C510 200 540 420 500 700" />
        <path d="M0 160 C240 190 380 150 520 190" />
        <path d="M640 700 C680 560 860 560 1000 600" />
      </g>
      <g fill="var(--map-house)">
        {HOUSE_BLOCKS.map((block) => (
          <rect key={`${block.x}-${block.y}`} x={block.x} y={block.y} width={block.width} height={block.height} rx="4" />
        ))}
      </g>
      <path
        d="M380 0 C340 120 170 220 230 350 S300 540 170 700"
        fill="none"
        stroke="var(--terrain-riverside)"
        strokeWidth="26"
        strokeLinecap="round"
      />
      <path d="M0 574 H600 Q650 574 680 610 L740 700" fill="none" stroke="var(--terrain-canal)" strokeWidth="14" />
      <g fill="var(--terrain-woodland)">
        {WOODLAND_TREES.map((tree) => (
          <circle key={`${tree.cx}-${tree.cy}`} cx={tree.cx} cy={tree.cy} r="18" />
        ))}
      </g>
      <path
        d="M120 640 C260 600 300 520 420 520 S600 420 640 300 S700 200 760 160"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="4"
        strokeDasharray="2 18"
        strokeLinecap="round"
        opacity="0.35"
      />
      <g transform="translate(930 70)" fill="var(--color-ink)" opacity="0.7">
        <path d="M0 -34 L10 0 L0 -6 L-10 0 Z" />
        <text y="22" textAnchor="middle" fontSize="20" fontFamily="var(--font-body)" fontWeight="700">
          N
        </text>
      </g>
    </svg>
  );
}
