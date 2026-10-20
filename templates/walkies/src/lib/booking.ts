import {
  BOOKING_REFERENCE_LENGTH,
  BOOKING_REFERENCE_PREFIX,
  EMAIL_PATTERN,
  NOTES_MAX_LENGTH,
  VALIDATION_MESSAGES,
} from '../constants/booking';
import type { BookingDetails, BookingFieldErrors } from '../types/content';
import { hashText } from './hash';

export const EMPTY_BOOKING_DETAILS: BookingDetails = {
  ownerName: '',
  email: '',
  dogName: '',
  notes: '',
};

export function validateBookingDetails(details: BookingDetails): BookingFieldErrors {
  const errors: BookingFieldErrors = {};
  const email = details.email.trim();

  if (!details.ownerName.trim()) {
    errors.ownerName = VALIDATION_MESSAGES.ownerNameRequired;
  }

  if (!email) {
    errors.email = VALIDATION_MESSAGES.emailRequired;
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = VALIDATION_MESSAGES.emailInvalid;
  }

  if (!details.dogName.trim()) {
    errors.dogName = VALIDATION_MESSAGES.dogNameRequired;
  }

  if (details.notes.length > NOTES_MAX_LENGTH) {
    errors.notes = VALIDATION_MESSAGES.notesTooLong;
  }

  return errors;
}

export function hasErrors(errors: BookingFieldErrors): boolean {
  const errorCount = Object.keys(errors).length;

  return errorCount > 0;
}

export function createBookingReference(parts: string[]): string {
  const code = hashText(parts.join('|'))
    .toString(36)
    .toUpperCase()
    .padStart(BOOKING_REFERENCE_LENGTH, '0')
    .slice(-BOOKING_REFERENCE_LENGTH);
  const reference = `${BOOKING_REFERENCE_PREFIX}-${code}`;

  return reference;
}

export function buildMailtoLink(email: string, subject: string): string {
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

  return mailtoLink;
}
