import flashJson from '../data/flash.json';
import siteJson from '../data/site.json';
import type { FlashDesign, SiteContent } from '../types/content';

export const flashDesigns = flashJson as FlashDesign[];
export const site = siteJson as SiteContent;
export const motifs = ['all', ...new Set(flashDesigns.map(({ motif }) => motif))];

export const makeEnquiryUrl = (design: FlashDesign) => {
  const subject = `Flash enquiry — ${design.name}`;
  const body = `Hello ${site.studioName},\n\n${site.enquiryIntro} ${design.name} (${design.number}).\n\nSize: ${design.size}\nSuggested placement: ${design.placement}\nGuide price: ${design.price}\n\nMy preferred placement and any questions:\n`;
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
