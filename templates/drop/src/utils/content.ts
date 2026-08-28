import dropsJson from "~/data/drops.json";
import siteJson from "~/data/site.json";
import type { DropContent, SiteContent } from "~/types/content";

export const site: SiteContent = siteJson;
export const drop: DropContent = dropsJson;

export const availableItems = drop.items.filter((item) => !item.sold);
export const soldCount = drop.items.length - availableItems.length;

/** Drop number padded for display, e.g. 8 -> "08". */
export const dropNumberLabel = String(drop.dropNumber).padStart(2, "0");
