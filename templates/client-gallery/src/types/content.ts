export interface AlbumPhoto {
  /** File name inside static/images/ — also the identifier sent back to the photographer. */
  filename: string;
  alt: string;
  caption?: string;
  /** Pixel dimensions of the source image, used to reserve layout space. */
  width: number;
  height: number;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface AlbumContent {
  /** Stable slug — keys the favourites saved on this device and names the exported file. */
  id: string;
  eyebrow: string;
  title: string;
  eventDate: string;
  venue: string;
  photographerCredit: string;
  studio: string;
  deliveredLabel: string;
  intro: string;
  howTo: string;
  usageNote: string;
  photos: AlbumPhoto[];
  faqs: Faq[];
}
