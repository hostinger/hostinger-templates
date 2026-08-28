import { site } from '../content';
import type { Plant } from '../types/content';
import { fillTemplate } from './html';

/** Builds the pre-filled "reserve one" mailto link from the displayed shop data. */
export function reserveMailto(plant: Plant): string {
  const values = {
    plant: plant.name,
    botanical: plant.botanical,
    shop: site.name,
  };
  const subject = encodeURIComponent(fillTemplate(site.reserve.subject, values));
  const body = encodeURIComponent(fillTemplate(site.reserve.body, values));
  return `mailto:${site.email}?subject=${subject}&body=${body}`;
}
