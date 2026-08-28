/**
 * All user-facing copy in one place. Edit text here — components only
 * reference these constants.
 */

export const APP_COPY = {
  brand: 'Split the Rent',
  tagline: 'Fair shares for unequal rooms',
  intro:
    'Type your total rent, describe each room, and watch the shares update live. The working-out is printed in full on the fairness receipt — so nobody argues.',

  rent: {
    label: 'Total monthly rent',
    hint: 'The whole number the landlord charges, before splitting.',
  },

  rooms: {
    heading: 'The rooms',
    nameLabel: 'Room name',
    sizeLabel: 'Size (m²)',
    windowLabel: 'Window',
    ensuiteLabel: 'En-suite bathroom',
    addRoom: '+ Add a room',
    removeRoom: 'Remove',
    maxRoomsNote: 'Up to 6 rooms.',
    minRoomsNote: 'A flat-share needs at least 2 rooms.',
  },

  receipt: {
    heading: 'Fairness receipt',
    subheading: 'The maths, line by line',
    baseLine: 'Base share (size)',
    windowLine: 'Window adjustment',
    ensuiteLine: 'En-suite adjustment',
    weightedLine: 'Weighted share',
    roundingLine: 'Rounding',
    finalLine: 'Pays per month',
    ofTotalSize: 'of floor area',
    totalLabel: 'Total',
    totalMatches: 'matches the rent exactly',
    roundingNote:
      'Shares are rounded to the nearest penny using largest-remainder rounding, so they always add up to the rent — to the penny.',
    emptyState:
      'Enter a rent above £0 and give every room a size to see the split.',
    noEnsuite: 'no en-suite',
  },

  share: {
    heading: 'Send it to the group chat',
    body: 'The whole scenario lives in the link — rent, rooms, everything. Anyone who opens it sees exactly this split.',
    button: 'Copy share link',
    copied: 'Link copied!',
  },

  faq: {
    heading: 'How it works',
    items: [
      {
        question: 'How is my share calculated?',
        answer:
          'Every room gets a weight: its size in m², nudged up or down by its window quality and whether it has an en-suite. Your share of the rent is your room’s weight divided by the total weight of all rooms. The receipt shows every step.',
      },
      {
        question: 'Why do the shares always add up exactly?',
        answer:
          'Plain rounding can lose or gain a penny or two. We round every share down, then hand the leftover pennies to the rooms whose shares were closest to rounding up — largest-remainder rounding. The total always equals the rent.',
      },
      {
        question: 'How do I share this with my flatmates?',
        answer:
          'Press “Copy share link”. The rent and every room are encoded in the URL, so the link reopens this exact scenario on any device. No accounts, nothing stored anywhere.',
      },
    ],
  },

  footer: 'Made for flat-shares with one loft, one box room, and one argument to avoid.',
} as const;

/** Currency formatting used everywhere money is shown. */
export const CURRENCY_LOCALE = 'en-GB';
export const CURRENCY_CODE = 'GBP';
