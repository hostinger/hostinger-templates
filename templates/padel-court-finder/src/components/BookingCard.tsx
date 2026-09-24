import { site } from '../constants/content';
import { MailIcon, PhoneIcon, PinIcon } from '../icons';
import type { Club } from '../types/content';
import { mailtoHref, telHref } from '../utils/contact';
import { fillTemplate } from '../utils/format';

type BookingCardProps = {
  club: Club;
};

export function BookingCard({ club }: BookingCardProps) {
  const subject = `${site.booking.emailSubject} — ${club.name}`;
  const body = fillTemplate(site.booking.emailBody, { club: club.name });

  return (
    <section className="booking-card" aria-labelledby="booking-title">
      <h2 id="booking-title" className="booking-card__title">
        {site.booking.title}
      </h2>
      <a className="button button--ball button--block" href={telHref(club.phone)}>
        <PhoneIcon width={18} height={18} />
        Call {club.phone}
      </a>
      <a className="button button--outline button--block" href={mailtoHref(club.email, subject, body)}>
        <MailIcon width={18} height={18} />
        Email {club.email}
      </a>
      <p className="booking-card__address">
        <PinIcon width={18} height={18} />
        {club.address}
      </p>
      <p className="booking-card__note">{site.booking.note}</p>
    </section>
  );
}
