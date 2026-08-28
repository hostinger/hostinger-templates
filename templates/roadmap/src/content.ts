import roadmapJson from './data/roadmap.json';
import siteJson from './data/site.json';
import type { RoadmapContent, SiteContent } from './types/content';

export const site: SiteContent = siteJson as SiteContent;
export const roadmap: RoadmapContent = roadmapJson as RoadmapContent;
