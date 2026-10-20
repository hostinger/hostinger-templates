import { useEffect, useRef } from 'react';
import { BOOKING_PAGE_COPY } from '../../constants/booking';
import { CheckIcon } from '../../icons';
import { findAreaById } from '../../lib/areas';
import { formatLongDate, fromDateKey } from '../../lib/format';
import type { Booking } from '../../types/content';

interface BookingConfirmationProps {
  booking: Booking;
  onBookAnother: () => void;
}

export function BookingConfirmation({ booking, onBookAnother }: BookingConfirmationProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const area = findAreaById(booking.areaId);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section className="booking-confirmation" aria-labelledby="booking-confirmation-title">
      <span className="booking-confirmation__icon">
        <CheckIcon width={28} height={28} />
      </span>
      <p className="eyebrow">{BOOKING_PAGE_COPY.confirmationEyebrow}</p>
      <h2 id="booking-confirmation-title" ref={headingRef} tabIndex={-1} className="booking-confirmation__title">
        {BOOKING_PAGE_COPY.confirmationTitlePrefix} {booking.dogName}
      </h2>
      <p className="booking-confirmation__walk">
        {area?.name} · {formatLongDate(fromDateKey(booking.dateKey))} · {booking.time}
      </p>
      <p className="booking-confirmation__reference">
        {BOOKING_PAGE_COPY.confirmationReference} <strong>{booking.reference}</strong>
      </p>
      <p className="booking-confirmation__body">{BOOKING_PAGE_COPY.confirmationBody}</p>
      <button type="button" className="button button--primary" onClick={onBookAnother}>
        {BOOKING_PAGE_COPY.bookAnother}
      </button>
    </section>
  );
}
