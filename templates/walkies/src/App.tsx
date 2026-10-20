import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ROUTES } from './constants/routes';
import { AreasPage } from './pages/AreasPage';
import { BookingPage } from './pages/BookingPage';
import { HomePage } from './pages/HomePage';
import type { Booking } from './types/content';

export default function App() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  function addBooking(booking: Booking) {
    setBookings((currentBookings) => [...currentBookings, booking]);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path={ROUTES.home} element={<HomePage />} />
          <Route path={ROUTES.areas} element={<AreasPage />} />
          <Route path={ROUTES.booking} element={<BookingPage bookings={bookings} onConfirmBooking={addBooking} />} />
          <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
