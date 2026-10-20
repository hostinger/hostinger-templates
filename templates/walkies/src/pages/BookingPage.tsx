import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AreaPicker } from '../components/booking/AreaPicker';
import { BookingConfirmation } from '../components/booking/BookingConfirmation';
import { BookingSummary } from '../components/booking/BookingSummary';
import { DatePicker } from '../components/booking/DatePicker';
import { DetailsFields } from '../components/booking/DetailsFields';
import { SlotPicker } from '../components/booking/SlotPicker';
import { SectionHeading } from '../components/SectionHeading';
import { WALK_AREAS } from '../constants/areas';
import { BOOKING_PAGE_COPY } from '../constants/booking';
import { AREA_QUERY_PARAM } from '../constants/routes';
import { findAreaById } from '../lib/areas';
import { createBookingReference, EMPTY_BOOKING_DETAILS, hasErrors, validateBookingDetails } from '../lib/booking';
import { getBookableDates, getTimeSlots, isAreaRunningOn } from '../lib/schedule';
import type { Booking, BookingDetails, BookingFieldErrors } from '../types/content';

interface BookingPageProps {
  bookings: Booking[];
  onConfirmBooking: (booking: Booking) => void;
}

export function BookingPage({ bookings, onConfirmBooking }: BookingPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [bookableDates] = useState(() => getBookableDates(new Date()));
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [details, setDetails] = useState<BookingDetails>(EMPTY_BOOKING_DETAILS);
  const [errors, setErrors] = useState<BookingFieldErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const selectedArea = findAreaById(searchParams.get(AREA_QUERY_PARAM));
  const selectedDate = bookableDates.find((bookableDate) => bookableDate.dateKey === selectedDateKey);
  const timeSlots = selectedArea && selectedDate ? getTimeSlots(selectedArea, selectedDate, bookings) : [];
  const isSelectionComplete = Boolean(selectedArea && selectedDate && selectedTime);
  const showSelectionError = hasSubmitted && !isSelectionComplete;

  function selectArea(areaId: string) {
    const area = findAreaById(areaId);
    setSearchParams({ [AREA_QUERY_PARAM]: areaId }, { replace: true });
    setSelectedTime(null);

    if (area && selectedDate && !isAreaRunningOn(area, selectedDate.date)) {
      setSelectedDateKey(null);
    }
  }

  function selectDate(dateKey: string) {
    setSelectedDateKey(dateKey);
    setSelectedTime(null);
  }

  function changeDetail(field: keyof BookingDetails, value: string) {
    const nextDetails = { ...details, [field]: value };
    setDetails(nextDetails);

    if (hasSubmitted) {
      setErrors(validateBookingDetails(nextDetails));
    }
  }

  function confirmBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);

    const detailErrors = validateBookingDetails(details);
    setErrors(detailErrors);

    if (!selectedArea || !selectedDate || !selectedTime || hasErrors(detailErrors)) {
      return;
    }

    const booking: Booking = {
      ...details,
      ownerName: details.ownerName.trim(),
      email: details.email.trim(),
      dogName: details.dogName.trim(),
      areaId: selectedArea.id,
      dateKey: selectedDate.dateKey,
      time: selectedTime,
      reference: createBookingReference([
        selectedArea.id,
        selectedDate.dateKey,
        selectedTime,
        details.email.trim(),
        String(bookings.length),
      ]),
    };
    onConfirmBooking(booking);
    setConfirmedBooking(booking);
    window.scrollTo({ top: 0 });
  }

  function startAnotherBooking() {
    setConfirmedBooking(null);
    setSelectedTime(null);
    setDetails(EMPTY_BOOKING_DETAILS);
    setErrors({});
    setHasSubmitted(false);
  }

  return (
    <section className="section page-intro booking-page" aria-labelledby="booking-title">
      <div className="container">
        <SectionHeading eyebrow={BOOKING_PAGE_COPY.eyebrow} title={BOOKING_PAGE_COPY.title} id="booking-title" as="h1">
          <p className="section-heading__body">{BOOKING_PAGE_COPY.body}</p>
        </SectionHeading>
        <p className="sample-notice">{BOOKING_PAGE_COPY.sampleNotice}</p>
        {confirmedBooking ? (
          <BookingConfirmation booking={confirmedBooking} onBookAnother={startAnotherBooking} />
        ) : (
          <div className="booking-page__layout">
            <form className="booking-form" onSubmit={confirmBooking} noValidate>
              <AreaPicker areas={WALK_AREAS} selectedAreaId={selectedArea?.id ?? null} onSelect={selectArea} />
              <DatePicker
                area={selectedArea}
                dates={bookableDates}
                selectedDateKey={selectedDateKey}
                onSelect={selectDate}
              />
              <SlotPicker
                hasDate={Boolean(selectedArea && selectedDate)}
                slots={timeSlots}
                selectedTime={selectedTime}
                onSelect={setSelectedTime}
              />
              <DetailsFields details={details} errors={errors} onChange={changeDetail} />
              {showSelectionError && (
                <p className="form-alert" role="alert">
                  {BOOKING_PAGE_COPY.incompleteSelection}
                </p>
              )}
              <button type="submit" className="button button--primary booking-form__submit">
                {BOOKING_PAGE_COPY.confirmButton}
              </button>
            </form>
            <BookingSummary area={selectedArea} date={selectedDate?.date} time={selectedTime} />
          </div>
        )}
      </div>
    </section>
  );
}
