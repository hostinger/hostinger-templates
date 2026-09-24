import { neighbourhoodsById, settingsById, site } from '../constants/content';
import { mailtoHref } from './contact';

export type ListingForm = {
  clubName: string;
  contactName: string;
  email: string;
  phone: string;
  neighbourhood: string;
  courts: string;
  setting: string;
  message: string;
};

export type ListingErrors = Partial<Record<keyof ListingForm, string>>;

export const EMPTY_LISTING: ListingForm = {
  clubName: '',
  contactName: '',
  email: '',
  phone: '',
  neighbourhood: '',
  courts: '',
  setting: '',
  message: '',
};

export const LISTING_LIMITS = {
  text: 80,
  phone: 24,
  message: 600,
  minCourts: 1,
  maxCourts: 40,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+\d][\d\s().-]{5,}$/;

export const validateListing = (form: ListingForm): ListingErrors => {
  const errors: ListingErrors = {};
  const courts = Number(form.courts);

  if (!form.clubName.trim()) errors.clubName = 'Enter the club name.';
  if (!form.contactName.trim()) errors.contactName = 'Enter a contact name.';
  if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = 'Enter an email address like name@club.com.';
  if (form.phone.trim() && !PHONE_PATTERN.test(form.phone.trim())) errors.phone = 'Enter a phone number using digits only.';
  if (!neighbourhoodsById.has(form.neighbourhood)) errors.neighbourhood = 'Choose the area your club is in.';
  if (!Number.isInteger(courts) || courts < LISTING_LIMITS.minCourts || courts > LISTING_LIMITS.maxCourts) {
    errors.courts = `Enter a whole number between ${LISTING_LIMITS.minCourts} and ${LISTING_LIMITS.maxCourts}.`;
  }
  if (!settingsById.has(form.setting)) errors.setting = 'Choose indoor, covered, or outdoor.';

  return errors;
};

export const listingMailto = (form: ListingForm) => {
  const lines = [
    `Club: ${form.clubName.trim()}`,
    `Contact: ${form.contactName.trim()}`,
    `Email: ${form.email.trim()}`,
    `Phone: ${form.phone.trim() || 'Not given'}`,
    `Area: ${neighbourhoodsById.get(form.neighbourhood)?.name ?? ''}`,
    `Courts: ${form.courts}`,
    `Setting: ${settingsById.get(form.setting)?.label ?? ''}`,
    '',
    form.message.trim() || 'No extra notes.',
  ];

  return mailtoHref(site.contact.email, `${site.listing.emailSubject}: ${form.clubName.trim()}`, lines.join('\n'));
};
