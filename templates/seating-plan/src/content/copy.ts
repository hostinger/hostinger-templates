import type { HowToEntry } from '../types';

/** All on-screen copy lives here. Edit freely. */
export const SITE = {
  eyebrow: 'Drawing № 001 — Floor plan',
  title: 'Reception Seating Plan',
  tagline: 'Drag guests onto seats, or tap a name and then tap a seat.',
  footnote:
    'The whole arrangement is stored in this page’s address — share the link and the plan travels with it. Nothing is saved on a server.',
} as const;

/** The technical-drawing corner stamp in the header. */
export const TITLE_BLOCK = {
  heading: 'Title block',
  rows: [
    { label: 'Project', value: 'Reception — Rev A' },
    { label: 'Scale', value: 'Not to scale' },
    { label: 'Drawn by', value: 'The hosts' },
    { label: 'Sheet', value: '1 of 1' },
  ],
} as const;

export const LABELS = {
  rosterTitle: 'Guest manifest',
  rosterHint: 'Drag a name onto a dashed seat — or tap the name, then tap the seat.',
  rosterEmpty: 'All guests are seated.',
  rosterDropHint: 'Drop a guest here to unseat them.',
  floorTitle: 'Floor plan',
  seatedCounter: 'Seated',
  emptySeat: 'empty',
  freeSeatsOne: 'seat free',
  freeSeatsMany: 'seats free',
  copyLink: 'Copy share link',
  copied: 'Link copied ✓',
  copyFallbackPrompt: 'Copy this link to share the plan:',
  print: 'Print plan',
  clear: 'Clear plan',
  clearConfirm: 'Remove every guest from the plan?',
} as const;

export const HOW_TO_TITLE = 'Field notes — how to use this sheet';

export const HOW_TO: HowToEntry[] = [
  {
    question: 'How do I seat a guest?',
    answer:
      'Drag a name from the guest manifest onto any dashed seat. On a phone, tap the name (it turns coral), then tap the seat. Tap the × on a seated guest to send them back to the list.',
  },
  {
    question: 'How do I share the plan?',
    answer:
      'The full arrangement is encoded in the page address as you work. Press “Copy share link” and send the link — whoever opens it sees exactly the same layout.',
  },
  {
    question: 'How do I print it?',
    answer:
      'Press “Print plan” or use your browser’s print command. The controls disappear and the plan prints ink-on-white with every table, name, and empty seat.',
  },
];
