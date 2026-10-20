import { BOOKING_PAGE_COPY } from '../../constants/booking';
import { CONTACT } from '../../constants/site';
import { MailIcon } from '../../icons';
import { buildMailtoLink } from '../../lib/booking';
import { formatLongDate, formatPrice } from '../../lib/format';
import type { WalkArea } from '../../types/content';

interface BookingSummaryProps {
  area: WalkArea | undefined;
  date: Date | undefined;
  time: string | null;
}

export function BookingSummary({ area, date, time }: BookingSummaryProps) {
  const rows = [
    { label: BOOKING_PAGE_COPY.summaryArea, value: area?.name },
    { label: BOOKING_PAGE_COPY.summaryDate, value: date ? formatLongDate(date) : undefined },
    { label: BOOKING_PAGE_COPY.summaryTime, value: time ?? undefined },
    { label: BOOKING_PAGE_COPY.summaryPrice, value: area ? formatPrice(area.price) : undefined },
  ];
  const hasSelection = Boolean(area);

  return (
    <aside className="booking-summary" aria-labelledby="booking-summary-title">
      <h2 id="booking-summary-title" className="booking-summary__title">
        {BOOKING_PAGE_COPY.summaryTitle}
      </h2>
      {hasSelection ? (
        <dl className="booking-summary__rows">
          {rows.map((row) => (
            <div key={row.label} className="booking-summary__row">
              <dt>{row.label}</dt>
              <dd>{row.value ?? '—'}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="booking-summary__empty">{BOOKING_PAGE_COPY.summaryEmpty}</p>
      )}
      <p className="booking-summary__enquiry">
        {BOOKING_PAGE_COPY.enquiryPrompt}{' '}
        <a href={buildMailtoLink(CONTACT.email, BOOKING_PAGE_COPY.enquirySubject)}>
          <MailIcon width={16} height={16} />
          {BOOKING_PAGE_COPY.enquiryAction}
        </a>
      </p>
    </aside>
  );
}
