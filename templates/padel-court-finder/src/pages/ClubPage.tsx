import { Link, useParams } from 'react-router-dom';
import { BookingCard } from '../components/BookingCard';
import { CityMap } from '../components/CityMap';
import { ClubCard } from '../components/ClubCard';
import { CourtDiagram } from '../components/CourtDiagram';
import { HoursTable } from '../components/HoursTable';
import { PriceTable } from '../components/PriceTable';
import { StatusPill } from '../components/StatusPill';
import { amenitiesById, clubs, clubsById, neighbourhoodsById, settingsById } from '../constants/content';
import { ROUTES } from '../constants/routes';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useNow } from '../hooks/useNow';
import { AmenityIcon, ArrowLeftIcon, CheckIcon } from '../icons';
import { distanceKm } from '../utils/distance';
import { getOpenStatus } from '../utils/hours';
import { pluralise } from '../utils/format';
import { NotFoundPage } from './NotFoundPage';

const NEARBY_COUNT = 3;

export function ClubPage() {
  const { id = '' } = useParams();
  const club = clubsById.get(id);
  const now = useNow();
  useDocumentTitle(club?.name ?? 'Club not found');

  if (!club) return <NotFoundPage />;

  const area = neighbourhoodsById.get(club.neighbourhood);
  const setting = settingsById.get(club.setting);
  const status = getOpenStatus(club.hours, now);
  const nearby = clubs
    .filter((other) => other.id !== club.id)
    .map((other) => ({ club: other, distance: distanceKm(club.location, other.location), status: getOpenStatus(other.hours, now) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, NEARBY_COUNT);

  return (
    <article className="club-page">
      <header className={`club-hero club-hero--${club.setting}`}>
        <div className="club-hero__inner">
          <Link to={ROUTES.home} className="back-link">
            <ArrowLeftIcon width={18} height={18} />
            All courts
          </Link>
          <p className="eyebrow eyebrow--on-dark">
            {area?.name} · {setting?.label}
          </p>
          <h1 className="club-hero__title">{club.name}</h1>
          <p className="club-hero__summary">{club.summary}</p>
          <StatusPill status={status} large />
        </div>
      </header>

      <div className="club-page__body">
        <div className="club-page__main">
          <section className="detail-section" aria-labelledby="about-title">
            <h2 id="about-title" className="detail-title">
              About the club
            </h2>
            <p className="detail-lede">{club.description}</p>
            <ul className="tag-list" aria-label="Good for">
              {club.goodFor.map((item) => (
                <li key={item}>
                  <CheckIcon width={16} height={16} />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="detail-section" aria-labelledby="courts-title">
            <h2 id="courts-title" className="detail-title">
              {pluralise(club.courts, 'court')}
              <span className="detail-title__meta">{club.courtType}</span>
            </h2>
            <ol className="court-grid">
              {Array.from({ length: club.courts }, (_, index) => (
                <li key={index} className="court-grid__item">
                  <CourtDiagram />
                  <span className="court-grid__label">Court {index + 1}</span>
                </li>
              ))}
            </ol>
          </section>

          <div className="detail-columns">
            <section className="detail-section" aria-labelledby="hours-title">
              <h2 id="hours-title" className="detail-title">
                Opening hours
              </h2>
              <HoursTable hours={club.hours} now={now} />
            </section>
            <section className="detail-section" aria-labelledby="prices-title">
              <h2 id="prices-title" className="detail-title">
                Prices
              </h2>
              <PriceTable prices={club.prices} />
            </section>
          </div>

          <section className="detail-section" aria-labelledby="facilities-title">
            <h2 id="facilities-title" className="detail-title">
              Facilities
            </h2>
            <ul className="facility-list">
              {club.amenities.map((amenityId) => {
                const amenity = amenitiesById.get(amenityId);
                return (
                  <li key={amenityId}>
                    <AmenityIcon id={amenityId} width={22} height={22} />
                    <span>
                      <strong>{amenity?.label}</strong>
                      {amenity?.description}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <aside className="club-page__aside">
          <BookingCard club={club} />
          <CityMap clubs={[club]} activeId={club.id} compact label={`Location of ${club.name}`} />
        </aside>
      </div>

      <section className="nearby" aria-labelledby="nearby-title">
        <h2 id="nearby-title" className="section-title">
          Other clubs nearby
        </h2>
        <ul className="club-list club-list--three">
          {nearby.map((result) => (
            <li key={result.club.id}>
              <ClubCard result={result} showDistance={false} />
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
