/**
 * Original flat-vector potted-plant illustrations, one per plant id in
 * src/data/plants.json. Every drawing shares the same backdrop circle,
 * terracotta pot, and palette so the set reads as one hand.
 */

const POT = '#c9683f';
const POT_DARK = '#a94f2c';
const POT_LIGHT = '#e08b5e';
const BACKDROP = '#f6ead2';
const GREEN_DEEP = '#2c5e3a';
const GREEN_MID = '#4c8f5c';
const GREEN_LIGHT = '#8fc49a';
const SUN_EDGE = '#e9b24c';
const GOLD_FLECK = '#e8d493';
const PLUM = '#7c4a5e';
const PLUM_STRIPE = '#c9a0b0';
const STOLON = '#c9a45f';
const SHADOW = 'rgba(43, 58, 46, 0.12)';

type Point = [number, number];

function pot(): string {
  return `
    <ellipse cx="80" cy="152" rx="33" ry="4.5" fill="${SHADOW}"/>
    <path d="M52 114 L108 114 L102.5 146 Q101.8 152 95.5 152 L64.5 152 Q58.2 152 57.5 146 Z" fill="${POT}"/>
    <rect x="63" y="119" width="6" height="25" rx="3" fill="${POT_LIGHT}" opacity="0.55"/>
    <rect x="44" y="100" width="72" height="14" rx="7" fill="${POT_DARK}"/>`;
}

function wrap(foliage: string, overlay = ''): string {
  return `<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><circle cx="80" cy="82" r="74" fill="${BACKDROP}"/>${foliage}${pot()}${overlay}</svg>`;
}

function ellipseLeaf(
  x: number,
  y: number,
  angle: number,
  rx: number,
  ry: number,
  fill: string,
): string {
  return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" transform="rotate(${angle} ${x} ${y})"/>`;
}

function quadPoint(p0: Point, p1: Point, p2: Point, t: number): Point {
  const inv = 1 - t;
  return [
    inv * inv * p0[0] + 2 * inv * t * p1[0] + t * t * p2[0],
    inv * inv * p0[1] + 2 * inv * t * p1[1] + t * t * p2[1],
  ];
}

function quadNormal(p0: Point, p1: Point, p2: Point, t: number): Point {
  const inv = 1 - t;
  const dx = 2 * inv * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
  const dy = 2 * inv * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
  const length = Math.hypot(dx, dy) || 1;
  return [-dy / length, dx / length];
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

/* --- Snake plant: upright sword leaves with pale stripes and gold margins. */
function snakePlant(): string {
  const leaves = [
    { d: 'M70 102 C66 72 68 44 74 30 C77 44 77 74 79 102 Z', edge: false },
    { d: 'M80 102 C79 62 82 32 87 22 C91 40 89 72 90 102 Z', edge: true },
    { d: 'M60 102 C56 84 58 62 65 50 C68 64 66 86 68 102 Z', edge: false },
    { d: 'M91 102 C92 76 96 52 103 42 C105 58 100 84 98 102 Z', edge: true },
    { d: 'M102 102 C103 90 107 76 112 70 C113 80 110 94 107 102 Z', edge: false },
  ];
  const stripes = [
    'M73 96 C71 72 72 50 75 38',
    'M84 96 C83 64 84 40 86 30',
    'M96 96 C97 74 99 56 101 48',
    'M63 96 C61 80 62 64 65 56',
  ];
  const shapes = leaves
    .map(
      (leaf) =>
        `<path d="${leaf.d}" fill="${GREEN_DEEP}"${leaf.edge ? ` stroke="${SUN_EDGE}" stroke-width="1.8"` : ''}/>`,
    )
    .join('');
  const details = stripes
    .map((d) => `<path d="${d}" fill="none" stroke="${GREEN_LIGHT}" stroke-width="2.2" stroke-linecap="round"/>`)
    .join('');
  return wrap(shapes + details);
}

/* --- Golden pothos: mound of heart leaves plus two trailing vines. */
const HEART =
  'M0 -4 C -8 -16 -24 -10 -22 2 C -20 12 -9 15 0 24 C 9 15 20 12 22 2 C 24 -10 8 -16 0 -4 Z';

function heartLeaf(
  x: number,
  y: number,
  angle: number,
  scale: number,
  fill: string,
  fleck = false,
): string {
  const flecks = fleck
    ? `<ellipse cx="-5" cy="5" rx="4" ry="2" fill="${GOLD_FLECK}" transform="rotate(-24 -5 5)"/><ellipse cx="6" cy="9" rx="2.6" ry="1.4" fill="${GOLD_FLECK}" transform="rotate(14 6 9)"/>`
    : '';
  return `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})"><path d="${HEART}" fill="${fill}"/>${flecks}</g>`;
}

function goldenPothos(): string {
  const mound = [
    heartLeaf(58, 80, -30, 1, GREEN_DEEP),
    heartLeaf(102, 80, 24, 1, GREEN_DEEP, true),
    heartLeaf(70, 62, -18, 0.72, GREEN_LIGHT),
    heartLeaf(80, 70, -5, 1.05, GREEN_MID, true),
    heartLeaf(68, 92, -55, 0.75, GREEN_MID),
    heartLeaf(96, 92, 48, 0.78, GREEN_MID),
  ].join('');
  const vines = `
    <path d="M58 104 C 42 112 32 126 40 144" fill="none" stroke="${GREEN_DEEP}" stroke-width="2.6" stroke-linecap="round"/>
    ${heartLeaf(43, 128, -18, 0.5, GREEN_MID)}
    ${heartLeaf(40, 144, 8, 0.42, GREEN_DEEP)}
    <path d="M102 104 C 120 112 128 128 120 146" fill="none" stroke="${GREEN_DEEP}" stroke-width="2.6" stroke-linecap="round"/>
    ${heartLeaf(118, 130, 20, 0.5, GREEN_DEEP, true)}
    ${heartLeaf(120, 146, -6, 0.42, GREEN_MID)}`;
  return wrap(mound, vines);
}

/* --- ZZ plant: arched stems lined with glossy oval leaflets. */
function zzPlant(): string {
  const stems = [
    'M70 102 C 62 76 64 46 76 30',
    'M84 102 C 84 72 90 48 98 36',
    'M60 102 C 52 86 50 68 56 54',
  ]
    .map((d) => `<path d="${d}" fill="none" stroke="${GREEN_DEEP}" stroke-width="3.4" stroke-linecap="round"/>`)
    .join('');
  const leaflets: Array<[number, number, number, string]> = [
    [61, 84, -40, GREEN_MID],
    [72, 78, -12, GREEN_LIGHT],
    [60, 66, -40, GREEN_MID],
    [71, 58, -12, GREEN_MID],
    [63, 46, -35, GREEN_LIGHT],
    [74, 38, -8, GREEN_MID],
    [76, 28, -20, GREEN_MID],
    [79, 86, -18, GREEN_MID],
    [91, 78, 25, GREEN_MID],
    [82, 68, -12, GREEN_LIGHT],
    [94, 60, 28, GREEN_MID],
    [86, 50, -8, GREEN_MID],
    [99, 44, 30, GREEN_LIGHT],
    [99, 33, 12, GREEN_MID],
    [50, 84, -42, GREEN_MID],
    [61, 76, -6, GREEN_LIGHT],
    [49, 66, -42, GREEN_MID],
    [59, 58, -8, GREEN_MID],
    [55, 50, -25, GREEN_LIGHT],
  ];
  const foliage = leaflets
    .map(([x, y, angle, fill]) => ellipseLeaf(x, y, angle, 4.2, 7.5, fill))
    .join('');
  return wrap(stems + foliage);
}

/* --- Spider plant: fountain of thin arching blades and one dangling pup. */
function spiderPlant(): string {
  const blades: Array<{ c: Point; t: Point; color: string }> = [
    { c: [48, 64], t: [24, 74], color: GREEN_MID },
    { c: [56, 60], t: [34, 52], color: GREEN_LIGHT },
    { c: [64, 56], t: [48, 34], color: GREEN_MID },
    { c: [74, 50], t: [66, 24], color: GREEN_LIGHT },
    { c: [82, 48], t: [84, 22], color: GREEN_MID },
    { c: [88, 52], t: [100, 30], color: GREEN_LIGHT },
    { c: [94, 58], t: [116, 44], color: GREEN_MID },
    { c: [100, 66], t: [130, 62], color: GREEN_LIGHT },
    { c: [70, 72], t: [60, 48], color: GREEN_DEEP },
    { c: [88, 72], t: [98, 50], color: GREEN_DEEP },
  ];
  const foliage = blades
    .map(
      (blade) =>
        `<path d="M80 101 Q ${blade.c[0]} ${blade.c[1]} ${blade.t[0]} ${blade.t[1]}" fill="none" stroke="${blade.color}" stroke-width="3" stroke-linecap="round"/>`,
    )
    .join('');
  const pup = `
    <path d="M86 100 C 112 90 128 100 132 122" fill="none" stroke="${STOLON}" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M132 122 L 124 134 M132 122 L 130 138 M132 122 L 138 136 M132 122 L 142 130" stroke="${GREEN_MID}" stroke-width="2.4" stroke-linecap="round" fill="none"/>
    <circle cx="117" cy="94" r="2.4" fill="#fffdf7" stroke="${SUN_EDGE}" stroke-width="1.4"/>`;
  return wrap(foliage, pup);
}

/* --- Boston fern: computed fishbone fronds spilling in every direction. */
function bostonFern(): string {
  const base: Point = [80, 102];
  const fronds: Array<{ c: Point; t: Point }> = [
    { c: [50, 72], t: [26, 62] },
    { c: [58, 54], t: [38, 34] },
    { c: [72, 46], t: [62, 22] },
    { c: [88, 46], t: [96, 20] },
    { c: [100, 56], t: [122, 34] },
    { c: [108, 74], t: [134, 64] },
  ];
  const parts: string[] = [];
  fronds.forEach((frond, index) => {
    const color = index % 2 === 0 ? GREEN_MID : GREEN_LIGHT;
    parts.push(
      `<path d="M${base[0]} ${base[1]} Q ${frond.c[0]} ${frond.c[1]} ${frond.t[0]} ${frond.t[1]}" fill="none" stroke="${GREEN_DEEP}" stroke-width="2.6" stroke-linecap="round"/>`,
    );
    for (let t = 0.2; t <= 0.94; t += 0.105) {
      const [x, y] = quadPoint(base, frond.c, frond.t, t);
      const [nx, ny] = quadNormal(base, frond.c, frond.t, t);
      const length = 8.5 * (1 - t) + 2.5;
      parts.push(
        `<path d="M${round(x - nx * length)} ${round(y - ny * length)} L${round(x + nx * length)} ${round(y + ny * length)}" stroke="${color}" stroke-width="2.4" stroke-linecap="round"/>`,
      );
    }
  });
  return wrap(parts.join(''));
}

/* --- Calathea orbifolia: broad round leaves with banded stripes. */
function calatheaLeaf(
  x: number,
  y: number,
  angle: number,
  scale: number,
  fill: string,
  stripe: string,
): string {
  return `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})">
    <ellipse cx="0" cy="0" rx="19" ry="25" fill="${fill}"/>
    <path d="M-13 -10 Q0 -18 13 -10 M-15 0 Q0 -8 15 0 M-13 10 Q0 2 13 10" fill="none" stroke="${stripe}" stroke-width="2.4" stroke-linecap="round" opacity="0.85"/>
    <path d="M0 -23 L0 23" stroke="${stripe}" stroke-width="1.6" opacity="0.5"/>
  </g>`;
}

function calathea(): string {
  const stems = [
    'M74 102 C 66 88 60 74 57 62',
    'M82 102 C 84 82 86 62 88 48',
    'M88 102 C 98 92 104 82 108 74',
    'M78 102 C 74 94 72 88 72 84',
  ]
    .map((d) => `<path d="${d}" fill="none" stroke="${GREEN_DEEP}" stroke-width="2.6" stroke-linecap="round"/>`)
    .join('');
  const leaves = [
    calatheaLeaf(56, 56, -18, 1, GREEN_MID, '#dcefdf'),
    calatheaLeaf(72, 80, -4, 0.8, PLUM, PLUM_STRIPE),
    calatheaLeaf(88, 42, 6, 1.05, GREEN_DEEP, GREEN_LIGHT),
    calatheaLeaf(110, 68, 24, 0.92, GREEN_MID, '#dcefdf'),
  ].join('');
  return wrap(stems + leaves);
}

/* --- Parlour palm: slim canes crowned with computed blade fans. */
function palmFan(tip: Point, direction: number, size: number, color: string): string {
  const blades: string[] = [];
  const count = 7;
  for (let i = 0; i < count; i += 1) {
    const rel = i / (count - 1) - 0.5;
    const angle = direction + rel * 150;
    const radians = (angle * Math.PI) / 180;
    const length = size - Math.abs(rel) * 6;
    const droop = 2 + Math.abs(rel) * 6;
    const endX = tip[0] + Math.cos(radians) * length;
    const endY = tip[1] + Math.sin(radians) * length + droop;
    blades.push(
      `<path d="M${tip[0]} ${tip[1]} Q ${round((tip[0] + endX) / 2)} ${round((tip[1] + endY) / 2 - 4)} ${round(endX)} ${round(endY)}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round"/>`,
    );
  }
  return blades.join('');
}

function parlourPalm(): string {
  const stems = [
    'M68 104 Q 60 78 52 48',
    'M82 104 Q 82 68 84 32',
    'M96 104 Q 104 80 110 54',
  ]
    .map((d) => `<path d="${d}" fill="none" stroke="${GREEN_DEEP}" stroke-width="2.8" stroke-linecap="round"/>`)
    .join('');
  const sideLeaves = [
    'M64 92 L 52 86',
    'M70 78 L 60 70',
    'M82 86 L 72 80',
    'M82 66 L 92 58',
    'M94 90 L 104 84',
    'M100 74 L 110 70',
  ]
    .map((d) => `<path d="${d}" stroke="${GREEN_MID}" stroke-width="2.2" stroke-linecap="round"/>`)
    .join('');
  const fans =
    palmFan([52, 48], -101, 23, GREEN_MID) +
    palmFan([84, 32], -88, 25, GREEN_DEEP) +
    palmFan([110, 54], -74, 22, GREEN_MID);
  return wrap(stems + sideLeaves + fans);
}

/* --- Aloe vera: plump speckled rosette. */
function aloeVera(): string {
  const leaves = [
    { d: 'M64 102 C50 92 40 74 44 58 C56 66 68 84 73 102 Z', fill: GREEN_DEEP },
    { d: 'M92 102 C102 90 112 76 116 62 C119 78 108 94 99 102 Z', fill: GREEN_DEEP },
    { d: 'M71 102 C64 82 63 60 69 46 C76 60 78 82 80 102 Z', fill: GREEN_MID },
    { d: 'M86 102 C90 80 94 60 100 48 C104 62 98 86 93 102 Z', fill: GREEN_MID },
    { d: 'M79 102 C77 72 79 46 83 34 C88 48 89 76 88 102 Z', fill: GREEN_MID },
  ];
  const speckles: Point[] = [
    [70, 70],
    [74, 58],
    [82, 54],
    [84, 72],
    [96, 66],
    [100, 56],
    [66, 82],
    [90, 86],
    [83, 42],
  ];
  const shapes = leaves.map((leaf) => `<path d="${leaf.d}" fill="${leaf.fill}"/>`).join('');
  const dots = speckles
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.5" fill="#ffffff" opacity="0.42"/>`)
    .join('');
  return wrap(shapes + dots);
}

/* --- Fallback sprout for plant ids without a bespoke drawing. */
function sprout(): string {
  return wrap(`
    <path d="M80 102 C 79 86 80 72 80 58" fill="none" stroke="${GREEN_DEEP}" stroke-width="3" stroke-linecap="round"/>
    <path d="M80 76 C 70 72 62 62 62 50 C 74 52 80 64 80 74 Z" fill="${GREEN_MID}"/>
    <path d="M80 68 C 82 56 90 47 101 45 C 101 57 90 66 81 68 Z" fill="${GREEN_DEEP}"/>
    <path d="M80 58 C 76 52 76 46 79 41 C 83 46 83 54 80 58 Z" fill="${GREEN_LIGHT}"/>`);
}

const illustrationsById: Record<string, () => string> = {
  'snake-plant': snakePlant,
  'golden-pothos': goldenPothos,
  'zz-plant': zzPlant,
  'spider-plant': spiderPlant,
  'boston-fern': bostonFern,
  calathea,
  'parlour-palm': parlourPalm,
  'aloe-vera': aloeVera,
};

export function plantIllustration(plantId: string): string {
  const draw = illustrationsById[plantId] ?? sprout;
  return draw();
}

/** Decorative leafy sprig, tinted to sit on the dark visit panel. */
export function sprig(flip = false): string {
  const leafShape = 'M0 0 C -5 -10 -4 -20 3 -27 C 10 -19 8 -7 0 0 Z';
  const leaves = [
    { x: 30, y: 76, a: -54, s: 1.05, fill: GREEN_LIGHT },
    { x: 60, y: 66, a: 24, s: 0.95, fill: '#cde6c8' },
    { x: 90, y: 54, a: -46, s: 1.15, fill: SUN_EDGE },
    { x: 120, y: 42, a: 32, s: 0.95, fill: GREEN_LIGHT },
    { x: 148, y: 30, a: -38, s: 1.05, fill: '#cde6c8' },
    { x: 174, y: 18, a: 26, s: 0.85, fill: GREEN_LIGHT },
  ]
    .map(
      (leaf) =>
        `<g transform="translate(${leaf.x} ${leaf.y}) rotate(${leaf.a}) scale(${leaf.s})"><path d="${leafShape}" fill="${leaf.fill}"/></g>`,
    )
    .join('');
  const transform = flip ? ' transform="scale(-1 1) translate(-200 0)"' : '';
  return `<svg viewBox="0 0 200 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><g${transform}><path d="M6 88 C 58 76 128 60 192 10" fill="none" stroke="#9fca9b" stroke-width="3" stroke-linecap="round"/>${leaves}</g></svg>`;
}
