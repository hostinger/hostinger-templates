import { Link } from 'react-router-dom';
import { Artwork } from './Artwork';
import type { FlashDesign } from '../types/content';

type FlashCardProps = {
  design: FlashDesign;
  onClaim: (design: FlashDesign) => void;
};

export function FlashCard({ design, onClaim }: FlashCardProps) {
  return (
    <article className="flash-card">
      <Link className="art-frame" to={`/flash/${design.id}`} aria-label={`View ${design.name}`}>
        <span className="edition">No. {design.number}</span>
        <Artwork design={design} eager={Number(design.number) <= 4} />
        <span className="view-note">View piece ↗</span>
      </Link>
      <div className="card-copy">
        <div>
          <p className="kicker">{design.motif} · {design.size}</p>
          <h3>{design.name}</h3>
          <p>{design.placement}</p>
        </div>
        <div className="card-action">
          <strong>{design.price}</strong>
          <button type="button" onClick={() => onClaim(design)}>Claim this one</button>
        </div>
      </div>
    </article>
  );
}
