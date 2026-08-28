/** Shapes for the committed JSON content in `src/data/`. */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type ParamLocation = 'path' | 'query' | 'body';

/**
 * `array` params are edited as a comma-separated list and serialized as a
 * JSON array of strings. `integer` params fall back to a JSON string when
 * the typed value is not a valid number, so the command always shows
 * exactly what was entered.
 */
export type ParamType = 'string' | 'integer' | 'boolean' | 'array';

export interface EndpointParam {
  name: string;
  in: ParamLocation;
  type: ParamType;
  required: boolean;
  description: string;
  example: string | number | boolean | string[];
  /** Allowed values; rendered as a select when present. */
  enum?: string[];
}

/** Any JSON value, used for committed response examples. */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface Endpoint {
  slug: string;
  method: HttpMethod;
  /** Path with `{placeholders}` for path params, e.g. `/v1/things/{id}`. */
  path: string;
  /** Section heading used to group endpoints in the index and nav. */
  group: string;
  summary: string;
  description: string;
  params: EndpointParam[];
  responseDescription: string;
  responseExample: JsonValue;
}

export interface SiteAuth {
  headerName: string;
  scheme: string;
  /** Shown verbatim in commands; keep it a shell variable, never a real key. */
  tokenPlaceholder: string;
  intro: string;
  note: string;
  /** Shell line shown in the authentication section. */
  exportHint: string;
}

export interface SiteStep {
  title: string;
  text: string;
}

export interface SiteSections {
  quickstart: { title: string; caption: string };
  endpoints: { title: string; lead: string };
  authentication: { title: string };
  howItWorks: { title: string; steps: SiteStep[] };
  faq: { title: string; lead: string };
  contact: { title: string };
}

export interface SiteNavLink {
  label: string;
  href: string;
}

export interface SiteTryIt {
  title: string;
  note: string;
  shareHint: string;
}

export interface SiteContact {
  teamName: string;
  email: string;
  note: string;
}

export interface SiteFaq {
  question: string;
  answer: string;
}

export interface SiteContent {
  apiName: string;
  productTagline: string;
  heading: string;
  intro: string;
  metaDescription: string;
  baseUrl: string;
  apiVersion: string;
  auth: SiteAuth;
  sections: SiteSections;
  tryIt: SiteTryIt;
  navigation: SiteNavLink[];
  contact: SiteContact;
  footerLinks: SiteNavLink[];
  footerNote: string;
  faqs: SiteFaq[];
}
