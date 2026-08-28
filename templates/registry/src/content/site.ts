import type { SiteContent } from '../types';

export const site: SiteContent = {
  coupleNames: 'Amelia & Tom',
  eventLine: 'Saturday 20 June 2026 · Wildhaven Barn, Somerset',
  eyebrow: 'are getting married',
  intro:
    'Your company is the real present — but if you would like to bring a gift, ' +
    'this is the little list we put together. Claim something below so nobody ' +
    'else buys the same thing, then bring it along or have it sent to the cottage.',
  deviceNote:
    'Claims are saved on this device only — there is no account and no live sync ' +
    'between guests. If you are choosing together, claim from one phone.',
  summaryHeading: 'The list',
  faqHeading: 'Questions, answered',
  faqIntro: 'Everything guests usually ask about how this list works.',
  faq: [
    {
      question: 'How does claiming a gift work?',
      answer:
        'Press “Claim this gift” on anything still available. The claim is saved ' +
        'in your browser on this device, the gift is marked as taken here, and ' +
        'you simply buy it wherever you like.',
    },
    {
      question: 'Can I change my mind after claiming?',
      answer:
        'Yes. Gifts you claimed on this device show a small “release it” link — ' +
        'use it and the gift goes straight back on the list.',
    },
    {
      question: 'Will Amelia & Tom see who claimed what?',
      answer:
        'No. We never ask for your name, so the list stays a complete surprise ' +
        'until the wrapping paper comes off.',
    },
    {
      question: 'Could two people still buy the same gift?',
      answer:
        'It is possible — claims live on each guest’s own device rather than on a ' +
        'shared server, so a claim made on one phone is not visible on another. ' +
        'If it happens, we promise to be delighted twice.',
    },
    {
      question: 'Do I have to buy from a particular shop?',
      answer:
        'Not at all. A few gifts include a suggestion link, but any version you ' +
        'choose will be perfect.',
    },
  ],
  footerSignoff: 'With love, A & T',
  footerNote:
    'No accounts, no tracking — gift claims live only in your browser on this device.',
};
