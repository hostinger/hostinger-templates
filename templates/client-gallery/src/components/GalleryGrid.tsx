import type { AlbumPhoto } from '../types/content';
import { PhotoCard } from './PhotoCard';

interface GalleryGridProps {
  photos: AlbumPhoto[];
  favourites: string[];
  onToggle: (filename: string) => void;
}

export function GalleryGrid({ photos, favourites, onToggle }: GalleryGridProps) {
  return (
    <section className="gallery" id="gallery" aria-label="Wedding photographs">
      <div className="gallery-heading">
        <p className="eyebrow">The album</p>
        <p className="gallery-hint">Star the frames you want in the conversation</p>
      </div>
      <div className="gallery-grid">
        {photos.map((photo, index) => (
          <PhotoCard
            key={photo.filename}
            photo={photo}
            index={index}
            isFavourite={favourites.includes(photo.filename)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </section>
  );
}
