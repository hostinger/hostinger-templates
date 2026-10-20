/** How many upcoming days the booking calendar offers, starting tomorrow. */
export const BOOKING_WINDOW_DAYS = 10;

/** Same-day bookings are not offered so walkers can plan their routes the evening before. */
export const FIRST_BOOKABLE_DAY_OFFSET = 1;

export const NOTES_MAX_LENGTH = 300;

export const BOOKING_REFERENCE_PREFIX = 'WLK';

/** Number of base-36 characters kept from the booking hash; six is short enough to read out on the phone. */
export const BOOKING_REFERENCE_LENGTH = 6;

/** Loose format check only; a real deployment confirms the address by sending an email. */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const BOOKING_PAGE_COPY = {
  eyebrow: 'Book a walk',
  title: 'Reserve a spot in the pack',
  body: 'Choose a walk area, a day, and a pick-up slot. Spots are shared with up to six dogs, so popular slots fill up.',
  sampleNotice: 'Demo availability: slots and spaces are sample data generated in your browser, not a live diary.',
  areaStepTitle: 'Walk area',
  dateStepTitle: 'Day',
  slotStepTitle: 'Pick-up slot',
  detailsStepTitle: 'Your details',
  notRunningLabel: 'No walk',
  chooseAreaFirst: 'Choose a walk area to see its days.',
  chooseDateFirst: 'Choose a day to see pick-up slots.',
  noSlotsOnDate: 'This area does not run on the chosen day. Try another day.',
  fullLabel: 'Full',
  yoursLabel: 'Booked',
  spotsLeftSuffix: 'left',
  ownerNameLabel: 'Your name',
  emailLabel: 'Email',
  dogNameLabel: "Dog's name",
  notesLabel: 'Notes for your walker (optional)',
  notesHint: 'Recall, reactivity, key safe code location — anything that helps.',
  summaryTitle: 'Your walk',
  summaryEmpty: 'Pick an area, day, and slot to see your booking summary.',
  summaryArea: 'Area',
  summaryDate: 'Day',
  summaryTime: 'Pick-up',
  summaryPrice: 'Price',
  confirmButton: 'Confirm booking',
  incompleteSelection: 'Choose a walk area, a day, and a pick-up slot before confirming.',
  confirmationEyebrow: 'Booking request received',
  confirmationTitlePrefix: 'See you soon,',
  confirmationBody: 'This demo keeps the booking in this browser tab only, so it clears when you reload. On a live site, your walker would confirm by email within a few hours.',
  confirmationReference: 'Reference',
  bookAnother: 'Book another walk',
  enquiryPrompt: 'Need a slot that is not listed?',
  enquiryAction: 'Email us',
  enquirySubject: 'Walk enquiry',
};

export const VALIDATION_MESSAGES = {
  ownerNameRequired: 'Please tell us your name.',
  emailRequired: 'Please add an email so we can confirm the walk.',
  emailInvalid: 'That email address does not look right.',
  dogNameRequired: "Please add your dog's name.",
  notesTooLong: `Please keep notes under ${NOTES_MAX_LENGTH} characters.`,
};
