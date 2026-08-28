import type { AlbumContent } from '../types/content';

interface PageFooterProps {
  album: AlbumContent;
}

export function PageFooter({ album }: PageFooterProps) {
  return (
    <footer className="page-footer">
      <p className="footer-credit">{album.photographerCredit}</p>
      <p className="footer-note">{album.usageNote}</p>
      <p className="footer-studio">
        {album.studio} — {album.eyebrow.toLowerCase()}
      </p>
    </footer>
  );
}
