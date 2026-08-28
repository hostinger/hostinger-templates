import type { AlbumPhoto } from '../types/content';
import { StarIcon } from '../icons/StarIcon';

interface PhotoCardProps {
  photo: AlbumPhoto;
  index: number;
  isFavourite: boolean;
  onToggle: (filename: string) => void;
}

export function PhotoCard({ photo, index, isFavourite, onToggle }: PhotoCardProps) {
  const number = String(index + 1).padStart(2, '0');
  const toggleLabel = isFavourite
    ? `Remove photo ${number} from favourites`
    : `Mark photo ${number} as a favourite`;

  return (
    <figure className={`photo-card${isFavourite ? ' is-favourite' : ''}`}>
      <div className="photo-media">
        <img
          src={`/images/${photo.filename}`}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          decoding="sync"
        />
        <button
          type="button"
          className="star-button"
          aria-pressed={isFavourite}
          aria-label={toggleLabel}
          onClick={() => onToggle(photo.filename)}
        >
          <StarIcon filled={isFavourite} />
        </button>
      </div>
      <figcaption className="photo-meta">
        <span className="photo-caption">
          <span className="photo-number">{number}</span>
          {photo.caption ?? photo.alt}
        </span>
        <span className="photo-filename">{photo.filename}</span>
      </figcaption>
    </figure>
  );
}
