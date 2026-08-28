import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Artwork } from '../components/Artwork';
import { ClaimDialog } from '../components/ClaimDialog';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { flashDesigns } from '../constants/content';

export function DesignPage() {
  const { id } = useParams();
  const design = flashDesigns.find((item) => item.id === id);
  const [isClaiming, setIsClaiming] = useState(false);

  if (!design) return <Navigate to="/" replace />;

  return (
    <>
      <Header />
      <main className="detail-page section-shell">
        <Link className="back-link" to="/">← Back to the wall</Link>
        <div className="detail-layout">
          <div className="detail-art">
            <span className="edition">No. {design.number} / one of one</span>
            <Artwork design={design} eager />
          </div>
          <div className="detail-copy">
            <p className="kicker">{design.motif} flash</p>
            <h1>{design.name}</h1>
            <p className="detail-description">{design.description}</p>
            <dl className="spec-list">
              <div><dt>Size</dt><dd>{design.size}</dd></div>
              <div><dt>Suggested placement</dt><dd>{design.placement}</dd></div>
              <div><dt>Guide price</dt><dd>{design.price}</dd></div>
              <div><dt>Status</dt><dd><span className="status-dot" />{design.availability}</dd></div>
            </dl>
            <button className="primary-button" type="button" onClick={() => setIsClaiming(true)}>
              Claim this one ↗
            </button>
            <p className="fine-print">An enquiry, not a checkout. We confirm availability and final details by email.</p>
          </div>
        </div>
      </main>
      <Footer />
      <ClaimDialog design={isClaiming ? design : null} onClose={() => setIsClaiming(false)} />
    </>
  );
}
