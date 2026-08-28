/**
 * All user-facing copy lives here. Edit text in this file to personalize the
 * app without touching component logic.
 */

export const SITE = {
  name: 'Overlap',
  tagline: 'Find the hours that actually work for everyone.',
  intro:
    'Add the cities your people live in and watch a shared day light up. The glowing column marks the hours when every city is inside working hours — copy the link and everyone sees the same lineup.',
  footer:
    'Times come straight from your browser via the Intl API — no accounts, no backend, no tracking.',
}

export const PICKER = {
  label: 'Add a city',
  placeholder: 'Search cities…',
  noMatch: 'No city matches',
  allAdded: 'Every city in the catalog is already on the board.',
}

export const HOURS_CONTROL = {
  legend: 'Working hours',
  fromLabel: 'From',
  toLabel: 'To',
}

export const SHARE = {
  button: 'Copy share link',
  copied: 'Link copied!',
  failed: 'Copy failed — grab the URL from the address bar.',
  hint: 'Cities and hours are stored in the URL.',
}

export const BOARD = {
  referenceNote: 'Hours aligned to your local day',
  nowLabel: 'now',
  removeCity: 'Remove',
  loading: 'Reading your local clock…',
  noCities: 'No cities on the board yet — search above to add one.',
  bandPrefix: 'Overlap band:',
  bandYourTime: 'your time',
  bandHourSingular: 'hour',
  bandHourPlural: 'hours',
  noOverlap: 'No common working hours',
  closestPrefix: 'closest is',
  closestSuffix: (working: number, total: number) =>
    `when ${working} of ${total} cities are working`,
}

export const LEGEND = {
  title: 'Local time of day',
  night: 'Night',
  early: 'Early',
  work: 'Work',
  evening: 'Evening',
  overlap: 'Everyone working',
}

export const HOW_TO = {
  title: 'How it works',
  items: [
    {
      question: 'How do I add or remove cities?',
      answer:
        'Type in the search box and pick a city from the list — arrow keys and Enter work too. Remove a city with the × on its name plate. The board and the link in your address bar update instantly.',
    },
    {
      question: 'What does the glowing column mean?',
      answer:
        'It spotlights the hours when every city on the board is inside working hours. Adjust the From and To controls to match your team’s real schedule and the band recalculates.',
    },
    {
      question: 'How do I share my setup?',
      answer:
        'Press “Copy share link”. Your cities and working hours travel in the URL, so anyone who opens it sees the same lineup mapped onto their own local day.',
    },
  ],
}
