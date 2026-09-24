import { Link } from 'react-router-dom';
import { CourtDiagram } from '../components/CourtDiagram';
import { ROUTES } from '../constants/routes';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function NotFoundPage() {
  useDocumentTitle('Page not found');

  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <CourtDiagram className="not-found__court" />
      <p className="eyebrow">Out of bounds</p>
      <h1 id="not-found-title" className="section-title">
        That page hit the fence.
      </h1>
      <p>The club or page you were looking for isn't listed. It may have moved or been renamed.</p>
      <Link to={ROUTES.home} className="button button--court">
        Back to all courts
      </Link>
    </section>
  );
}
