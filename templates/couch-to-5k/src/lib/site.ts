import siteData from '$lib/data/site.json';
import type { SiteContent } from '$lib/types';

/** Coach and business details, typed. Edit content in `src/lib/data/site.json`. */
export const site: SiteContent = siteData;

/** "Train with me" target, built from the same email shown on screen. */
export const mailtoHref = `mailto:${site.email}?subject=${encodeURIComponent(site.emailSubject)}`;
