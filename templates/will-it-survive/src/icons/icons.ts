const INK = '#2b3a2e';
const SUN = '#e9b24c';
const CLOUD = '#c8d4cd';
const WATER = '#7fb3c8';
const TERRACOTTA = '#c9683f';
const LEAF = '#4c8f5c';
const AMBER = '#b97f24';

function svg(body: string, viewBox = '0 0 48 48'): string {
  return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${body}</svg>`;
}

/** Big friendly icons used on the quiz answer cards, keyed by `icon` in quiz.json. */
export const answerIcons: Record<string, string> = {
  cloud: svg(
    `<path d="M14 34 a8 8 0 0 1 -1 -15.9 a10.5 10.5 0 0 1 20.4 -1.4 A8.5 8.5 0 0 1 33 34 Z" fill="${CLOUD}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
     <path d="M12 41 h6 M22 41 h6 M32 41 h4" stroke="${INK}" stroke-width="2.5" stroke-linecap="round" opacity="0.45"/>`,
  ),
  'sun-cloud': svg(
    `<circle cx="31" cy="17" r="7.5" fill="${SUN}" stroke="${INK}" stroke-width="2.5"/>
     <path d="M31 4.5 v4 M40 8.5 l-2.8 2.8 M43.5 17 h-4" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
     <path d="M10 38 a7 7 0 0 1 -0.8 -13.9 a9 9 0 0 1 17.6 -1.2 A7.3 7.3 0 0 1 26.5 38 Z" fill="${CLOUD}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
  ),
  sun: svg(
    `<circle cx="24" cy="24" r="9.5" fill="${SUN}" stroke="${INK}" stroke-width="2.5"/>
     <path d="M24 5 v5 M24 38 v5 M5 24 h5 M38 24 h5 M10.6 10.6 l3.5 3.5 M33.9 33.9 l3.5 3.5 M37.4 10.6 l-3.5 3.5 M14.1 33.9 l-3.5 3.5" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`,
  ),
  'droplet-sleep': svg(
    `<path d="M20 8 C25 16 31 22 31 30 a11 11 0 0 1 -22 0 C9 22 15 16 20 8 Z" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
     <path d="M33 10 h7 l-7 7 h7" stroke="${AMBER}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
     <path d="M36 26 h5 l-5 5 h5" stroke="${AMBER}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.8"/>`,
  ),
  'watering-can': svg(
    `<rect x="14" y="18" width="18" height="16" rx="4" fill="${LEAF}" stroke="${INK}" stroke-width="2.5"/>
     <path d="M32 22 l9 -6 M41 16 l-1.5 5" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
     <path d="M32 24 l8 -5.4 a2.6 2.6 0 0 1 2 4.6 l-4 3" fill="${LEAF}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
     <path d="M14 24 h-3 a5 5 0 0 0 0 10 h3" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
     <path d="M20 14 a4 4 0 0 1 8 0" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
     <path d="M40 28 c0 2 -1.6 3.4 -1.6 5 a1.8 1.8 0 0 0 3.6 0 c0 -1.6 -2 -3 -2 -5 Z" fill="${WATER}"/>`,
  ),
  mister: svg(
    `<path d="M17 20 h10 l-1.5 20 a3 3 0 0 1 -3 2.8 h-4 a3 3 0 0 1 -3 -2.8 Z" fill="${LEAF}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
     <path d="M19 20 v-5 a3 3 0 0 1 3 -3 h7" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
     <path d="M29 9 h5 a2.5 2.5 0 0 1 0 6 h-3" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="40" cy="9" r="1.7" fill="${WATER}"/>
     <circle cx="43" cy="14" r="1.7" fill="${WATER}"/>
     <circle cx="40" cy="19" r="1.7" fill="${WATER}"/>`,
  ),
  paw: svg(
    `<ellipse cx="14" cy="16" rx="4.4" ry="5.6" fill="${TERRACOTTA}" stroke="${INK}" stroke-width="2.2"/>
     <ellipse cx="24" cy="12.5" rx="4.4" ry="5.6" fill="${TERRACOTTA}" stroke="${INK}" stroke-width="2.2"/>
     <ellipse cx="34" cy="16" rx="4.4" ry="5.6" fill="${TERRACOTTA}" stroke="${INK}" stroke-width="2.2"/>
     <path d="M24 24 c6.5 0 12 4.6 12 10.2 c0 4 -3.2 6.3 -6.6 5.3 c-2.3 -0.7 -3.4 -1 -5.4 -1 s-3.1 0.3 -5.4 1 c-3.4 1 -6.6 -1.3 -6.6 -5.3 C12 28.6 17.5 24 24 24 Z" fill="${TERRACOTTA}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>`,
  ),
  house: svg(
    `<path d="M8 22 L24 8 L40 22" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M12 20 v18 a2 2 0 0 0 2 2 h20 a2 2 0 0 0 2 -2 V20" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
     <path d="M20 40 v-9 a2 2 0 0 1 2 -2 h4 a2 2 0 0 1 2 2 v9" fill="${TERRACOTTA}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>`,
  ),
};

/** Small leaf-check used before each survival reason. */
export const reasonIcon = svg(
  `<path d="M9 1.5 C4 3 1.5 6.5 2 11 c0.2 1.8 0.8 3 2 4.5 C6 13 8 12 11 11.5 C8.5 12.8 6.8 14 5.5 16.5 c1.5 0.8 3 1 4.5 0.8 c4.5 -0.7 6.5 -5 5.5 -10 C14.8 4 12.5 2 9 1.5 Z" fill="#4c8f5c"/>`,
  '0 0 18 18',
);

/** Small alert used before each honest caveat on close-call cards. */
export const caveatIcon = svg(
  `<path d="M9 2 a2.2 2.2 0 0 1 1.9 1.1 l6 10.4 A2.2 2.2 0 0 1 15 16.8 H3 a2.2 2.2 0 0 1 -1.9 -3.3 l6 -10.4 A2.2 2.2 0 0 1 9 2 Z" fill="#e9b24c"/>
   <path d="M9 6.5 v4.2" stroke="#2b3a2e" stroke-width="1.8" stroke-linecap="round"/>
   <circle cx="9" cy="13.6" r="1.1" fill="#2b3a2e"/>`,
  '0 0 18 18',
);

export const mailIcon = svg(
  `<rect x="2" y="4" width="16" height="12" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/>
   <path d="M3.5 6.5 L10 11.5 L16.5 6.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
  '0 0 20 20',
);

export const linkIcon = svg(
  `<path d="M8.5 11.5 a4 4 0 0 1 0 -5.6 l3 -3 a4 4 0 0 1 5.6 5.6 l-1.8 1.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
   <path d="M11.5 8.5 a4 4 0 0 1 0 5.6 l-3 3 a4 4 0 0 1 -5.6 -5.6 l1.8 -1.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`,
  '0 0 20 20',
);

export const arrowIcon = svg(
  `<path d="M3 10 h13 M11 5 l5 5 -5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  '0 0 20 20',
);

/** Shop mark: a sprouting pot, used in the header and footer. */
export const logoIcon = svg(
  `<circle cx="24" cy="24" r="22" fill="#f6ead2"/>
   <path d="M24 25 C22.5 18 17 15 11.5 16.5 C13 22 18 25.5 23.5 25.6 Z" fill="#4c8f5c"/>
   <path d="M24 25 C25.5 17 31 12.5 37.5 14.5 C36 21.5 30 25.6 24.5 25.6 Z" fill="#2c5e3a"/>
   <path d="M23.3 15 h1.6 v11 h-1.6 Z" fill="#2c5e3a"/>
   <rect x="13" y="26" width="22" height="5" rx="2.5" fill="#a94f2c"/>
   <path d="M16 31 h16 l-2.2 9.5 a2.4 2.4 0 0 1 -2.3 1.9 h-7 a2.4 2.4 0 0 1 -2.3 -1.9 Z" fill="#c9683f"/>`,
);
