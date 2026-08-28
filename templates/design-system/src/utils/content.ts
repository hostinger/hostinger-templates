import siteData from '../data/site.json';
import { components } from '../data/components';
import type { ComponentDoc, SiteContent } from '../types/content';

export const site = siteData as SiteContent;

export { components };

export const componentsById: ReadonlyMap<string, ComponentDoc> = new Map(
  components.map((doc) => [doc.id, doc]),
);

/** Preview slot content for a component, or `undefined` when it self-closes. */
export const stageSlotFor = (doc: ComponentDoc): string | undefined =>
  doc.slotText ?? doc.stageBody;
