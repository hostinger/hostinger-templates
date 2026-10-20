import type { FaqItem, NavigationLink, Step, Testimonial } from '../types/content';
import { ROUTES } from './routes';

export const BRAND = {
  name: 'Walkies',
  tagline: 'Small-group dog walks around Ashdown',
  town: 'Ashdown',
};

export const CONTACT = {
  email: 'hello@walkies.example',
  phoneDisplay: '020 7946 0321',
  phoneDial: '+442079460321',
  hours: 'Walks run 7am–6pm, Monday to Sunday',
  serviceArea: 'Ashdown and the surrounding villages',
};

/** Locale and currency used for every price and date on the site. */
export const LOCALE = {
  language: 'en-GB',
  currency: 'GBP',
};

export const NAVIGATION_LINKS: NavigationLink[] = [
  { label: 'Home', path: ROUTES.home },
  { label: 'Walk areas', path: ROUTES.areas },
  { label: 'Book a walk', path: ROUTES.booking },
];

export const HEADER_COPY = {
  homeLabel: 'Walkies home',
  navigationLabel: 'Main',
  bookButton: 'Book a walk',
};

export const HERO_COPY = {
  eyebrow: 'Insured · DBS-checked · Max six dogs',
  title: 'Proper walks for dogs who live for the lead coming off the hook.',
  body: 'Pick one of our six favourite walk areas, choose a day and a time slot, and a familiar walker collects your dog from the door. GPS photos of every walk, muddy paws towelled off before drop-off.',
  primaryAction: 'Book a walk',
  secondaryAction: 'See walk areas',
  ticketLabel: 'Next group walk',
  ticketWalk: 'Beacon Heath · 08:00',
  ticketDetail: '75 min · off-lead · 2 spots left',
  illustrationLabel: 'Illustration of a happy dog on a lead walking along a trail',
};

export const STATS = [
  { value: '6', label: 'walk areas across Ashdown' },
  { value: '4.9★', label: 'average from 310 owner reviews' },
  { value: '1:6', label: 'walker-to-dog ratio, never more' },
];

export const HOW_IT_WORKS_COPY = {
  eyebrow: 'How it works',
  title: 'From sofa to stile in three steps',
};

export const HOW_IT_WORKS_STEPS: Step[] = [
  {
    title: 'Choose a walk area',
    body: 'Riverside strolls for seniors, off-lead heath runs for collies — every area lists its pace, length, and lead rules.',
  },
  {
    title: 'Pick a day and slot',
    body: 'Each area runs on set days with fixed pick-up slots, so your dog walks with the same small pack every week.',
  },
  {
    title: 'We collect, walk, return',
    body: 'Door-to-door pick-up, a photo update mid-walk, and a towel-down before your dog is home again.',
  },
];

export const FEATURED_AREAS_COPY = {
  eyebrow: 'Favourite routes',
  title: 'Walk areas our regulars rebook',
  viewAll: 'View all walk areas',
  bookArea: 'Book this walk',
};

export const FEATURED_AREA_IDS = ['beacon-heath', 'riverside-loop', 'old-orchard-woods'];

export const TESTIMONIALS_COPY = {
  eyebrow: 'Owner notes',
  title: 'Tired dogs, happy humans',
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'Pip comes back from Beacon Heath so happily wrecked she skips her evening zoomies. The mid-walk photos make my workday.',
    author: 'Hannah R.',
    dog: 'Pip, border collie',
  },
  {
    quote: 'Booking the same Tuesday slot every week means Otis knows his walker by name. He waits at the door at 9:55.',
    author: 'Marcus T.',
    dog: 'Otis, beagle',
  },
  {
    quote: 'The canal walk is perfect for our nervous rescue — only three dogs, always on lead, and a walker who actually reads the notes.',
    author: 'Priya S.',
    dog: 'Biscuit, greyhound',
  },
];

export const FAQ_COPY = {
  eyebrow: 'Good questions',
  title: 'Before your first walk',
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Do you meet my dog before the first walk?',
    answer: 'Yes. Every new dog gets a free 20-minute meet-and-greet at home so we can check recall, lead manners, and how they get on with others.',
  },
  {
    question: 'What happens if it pours with rain?',
    answer: 'We walk in most weather. In storms or extreme heat we swap to a shorter sheltered route and let you know before pick-up.',
  },
  {
    question: 'Can I cancel or move a booking?',
    answer: 'Move or cancel for free up to 24 hours before the slot. Later changes are charged at half price so walkers are not left out of pocket.',
  },
  {
    question: 'Are walkers insured and checked?',
    answer: 'Every walker holds public liability insurance, a canine first-aid certificate, and an enhanced DBS check.',
  },
];

export const CALL_TO_ACTION_COPY = {
  title: 'Leads on. Tails up.',
  body: 'Grab a slot this week — first-time walks include a free meet-and-greet.',
  action: 'Book a walk',
};

export const FOOTER_COPY = {
  aboutTitle: 'Walkies',
  about: 'Independent, small-group dog walking around Ashdown since 2019.',
  contactTitle: 'Get in touch',
  hoursTitle: 'Walking hours',
  demoNote: 'Demo template: walk areas, availability, and bookings use sample data.',
};
