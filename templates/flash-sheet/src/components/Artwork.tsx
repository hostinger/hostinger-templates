import { artworkByFile } from '../constants/artwork';
import type { FlashDesign } from '../types/content';

type ArtworkProps = {
  design: FlashDesign;
  eager?: boolean;
};

export function Artwork({ design, eager = false }: ArtworkProps) {
  return (
    <img
      className="artwork"
      src={artworkByFile[design.artwork]}
      alt={`${design.name} original tattoo flash artwork`}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
