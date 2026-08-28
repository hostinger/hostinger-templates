import type { SelfCheckContent, Service, SiteContent } from '~/types/content'
import selfCheckJson from './self-check.json'
import servicesJson from './services.json'
import siteJson from './site.json'

/** Practice-wide copy: names, contact details, section copy, FAQs, legal notes. */
export const site: SiteContent = siteJson

/** The three services. Order controls the homepage list and tie-breaking. */
export const services: Service[] = servicesJson

/** The four self-check questions and their routing weights. */
export const selfCheck: SelfCheckContent = selfCheckJson

export function getService(slug: string): Service | undefined {
  return services.find(service => service.slug === slug)
}
