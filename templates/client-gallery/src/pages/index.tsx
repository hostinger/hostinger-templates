import { useEffect, useState } from 'react';
import type { HeadFC } from 'gatsby';

import { AlbumHeader } from '../components/AlbumHeader';
import { GalleryGrid } from '../components/GalleryGrid';
import { SelectionTray } from '../components/SelectionTray';
import { FaqSection } from '../components/FaqSection';
import { PageFooter } from '../components/PageFooter';
import albumData from '../data/album.json';
import type { AlbumContent } from '../types/content';
import { loadFavourites, saveFavourites, toggleFavourite } from '../utils/favourites';
import { downloadFavouritesList } from '../utils/exportFavourites';
import '../styles/global.css';

const album = albumData as AlbumContent;
const albumFilenames = album.photos.map((photo) => photo.filename);

export default function GalleryPage() {
  const [favourites, setFavourites] = useState<string[]>([]);

  useEffect(() => {
    setFavourites(loadFavourites(album.id, albumFilenames));
  }, []);

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

export const Head: HeadFC = () => (
  <>
    <html lang="en" />
    <title>{`${album.title} — ${album.eyebrow}`}</title>
    <meta
      name="description"
      content={`${album.eventDate}, ${album.venue}. ${album.howTo}`}
    />
    <meta name="theme-color" content="#151310" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
  </>
);
