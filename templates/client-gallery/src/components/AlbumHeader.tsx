import type { AlbumContent } from '../types/content';
import { StarIcon } from '../icons/StarIcon';

interface AlbumHeaderProps {
  album: AlbumContent;
}

export function AlbumHeader({ album }: AlbumHeaderProps) {
  return (
    <header className="album-header">
      <div className="topbar">
        <p className="topbar-credit">{album.studio}</p>
        <p className="topbar-eyebrow">{album.eyebrow}</p>
      </div>

      <div className="masthead">
        <h1 className="masthead-title">{album.title}</h1>
        <p className="masthead-meta">
          <span>{album.eventDate}</span>
          <span aria-hidden="true">·</span>
          <span>{album.venue}</span>
          <span aria-hidden="true">·</span>
          <span>{album.photos.length} photographs</span>
        </p>
        <p className="masthead-credit">
          {album.photographerCredit} — {album.deliveredLabel.toLowerCase()}
        </p>

        <div className="masthead-columns">
          <p className="masthead-intro">{album.intro}</p>
          <div className="how-to" aria-label="How this gallery works">
            <span className="how-to-icon">
              <StarIcon filled size={16} />
            </span>
            <p>{album.howTo}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
