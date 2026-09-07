import { useState } from 'react';

import { AlbumHeader } from './components/AlbumHeader';
import { FaqSection } from './components/FaqSection';
import { GalleryGrid } from './components/GalleryGrid';
import { PageFooter } from './components/PageFooter';
import { SelectionTray } from './components/SelectionTray';
import albumData from './data/album.json';
import type { AlbumContent } from './types/content';
import { downloadFavouritesList } from './utils/exportFavourites';
import { loadFavourites, saveFavourites, toggleFavourite } from './utils/favourites';

const album = albumData as AlbumContent;
const albumFilenames = album.photos.map((photo) => photo.filename);

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: album.faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export default function App() {
  const [favourites, setFavourites] = useState<string[]>(() =>
    loadFavourites(album.id, albumFilenames),
  );

  const handleToggle = (filename: string) => {
    setFavourites((current) => {
      const next = toggleFavourite(current, filename);
      saveFavourites(album.id, next);
      return next;
    });
  };

  const handleClear = () => {
    setFavourites([]);
    saveFavourites(album.id, []);
  };

  const handleExport = () => {
    downloadFavouritesList(album, favourites);
  };

  return (
    <div className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <a className="skip-link" href="#gallery">
        Skip to the gallery
      </a>
      <AlbumHeader album={album} />
      <main id="main-content">
        <GalleryGrid
          photos={album.photos}
          favourites={favourites}
          onToggle={handleToggle}
        />
        <FaqSection faqs={album.faqs} />
      </main>
      <PageFooter album={album} />
      <SelectionTray
        favouriteCount={favourites.length}
        totalCount={album.photos.length}
        onExport={handleExport}
        onClear={handleClear}
      />
    </div>
  );
}
