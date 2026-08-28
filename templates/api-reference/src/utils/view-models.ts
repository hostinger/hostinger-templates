/** Pure mappers from content types to the shapes the views render. */

import type {
  Endpoint,
  EndpointParam,
  ParamLocation,
  SiteContent,
} from '../types/content.js';
import {
  escapeSingleQuoted,
  exampleToInputValue,
  renderJsonHtml,
  renderTokensHtml,
  type CurlToken,
} from './curl.js';
import { escapeHtml } from './html.js';

export interface EndpointCardView {
  slug: string;
  method: string;
  methodClass: string;
  path: string;
  summary: string;
  href: string;
}

export function toEndpointCard(endpoint: Endpoint): EndpointCardView {
  return {
    slug: endpoint.slug,
    method: endpoint.method,
    methodClass: `method-${endpoint.method.toLowerCase()}`,
    path: endpoint.path,
    summary: endpoint.summary,
    href: `/endpoints/${endpoint.slug}`,
  };
}

export interface EndpointGroupView {
  name: string;
  endpoints: EndpointCardView[];
}

/** Group endpoints by their `group` label, preserving data order. */
export function groupEndpoints(endpoints: Endpoint[]): EndpointGroupView[] {
  const groups: EndpointGroupView[] = [];
  for (const endpoint of endpoints) {
    let group = groups.find((entry) => entry.name === endpoint.group);
    if (!group) {
      group = { name: endpoint.group, endpoints: [] };
      groups.push(group);
    }
    group.endpoints.push(toEndpointCard(endpoint));
  }
  return groups;
}

/** Escaped path HTML with `{placeholders}` wrapped for highlighting. */
export function renderPathHtml(endpointPath: string): string {
  return endpointPath
    .split(/(\{[^}]+\})/)
    .filter((piece) => piece !== '')
    .map((piece) =>
      /^\{[^}]+\}$/.test(piece)
        ? `<span class="path-param">${escapeHtml(piece)}</span>`
        : escapeHtml(piece),
    )
    .join('');
}

const LOCATION_LEGENDS: Record<ParamLocation, string> = {
  path: 'Path parameters',
  query: 'Query parameters',
  body: 'Body parameters',
};

const TYPE_LABELS: Record<EndpointParam['type'], string> = {
  string: 'string',
  integer: 'integer',
  boolean: 'boolean',
  array: 'array of strings',
};

export interface ParamDocView {
  name: string;
  required: boolean;
  typeLabel: string;
  description: string;
  exampleLabel: string;
  enumValues: string[];
}

export interface ParamDocGroupView {
  legend: string;
  params: ParamDocView[];
}

/** Parameter reference rows, grouped as path → query → body. */
export function buildParamDocGroups(endpoint: Endpoint): ParamDocGroupView[] {
  const order: ParamLocation[] = ['path', 'query', 'body'];
  return order
    .map((location) => ({
      legend: LOCATION_LEGENDS[location],
      params: endpoint.params
        .filter((param) => param.in === location)
        .map((param) => ({
          name: param.name,
          required: param.required,
          typeLabel: TYPE_LABELS[param.type],
          description: param.description,
          exampleLabel: exampleToInputValue(param),
          enumValues: param.enum ?? [],
        })),
    }))
    .filter((group) => group.params.length > 0);
}

export interface FormOptionView {
  value: string;
  label: string;
  selected: boolean;
}

export interface FormFieldView {
  id: string;
  name: string;
  required: boolean;
  isSelect: boolean;
  isInteger: boolean;
  value: string;
  placeholder: string;
  options: FormOptionView[];
}

export interface FormGroupView {
  legend: string;
  fields: FormFieldView[];
}

/** Try-it form controls, grouped as path → query → body. */
export function buildFormGroups(
  endpoint: Endpoint,
  values: Record<string, string>,
): FormGroupView[] {
  const order: ParamLocation[] = ['path', 'query', 'body'];
  return order
    .map((location) => ({
      legend: LOCATION_LEGENDS[location],
      fields: endpoint.params
        .filter((param) => param.in === location)
        .map((param) => toFormField(param, values[param.name] ?? '')),
    }))
    .filter((group) => group.fields.length > 0);
}

function toFormField(param: EndpointParam, value: string): FormFieldView {
  const selectValues =
    param.enum ?? (param.type === 'boolean' ? ['true', 'false'] : undefined);
  const options: FormOptionView[] = selectValues
    ? [
        {
          value: '',
          label: param.required ? 'Choose…' : 'Not set',
          selected: value === '',
        },
        ...selectValues.map((option) => ({
          value: option,
          label: option,
          selected: value === option,
        })),
      ]
    : [];
  return {
    id: `param-${param.name}`,
    name: param.name,
    required: param.required,
    isSelect: selectValues !== undefined,
    isInteger: param.type === 'integer',
    value,
    placeholder: exampleToInputValue(param),
    options,
  };
}

export interface NotFoundView {
  commandHtml: string;
  responseHtml: string;
  endpoints: EndpointCardView[];
}

/** Terminal-styled 404 view: the echoed request and a JSON error body. */
export function buildNotFoundView(
  site: SiteContent,
  endpoints: Endpoint[],
  requestPath: string,
): NotFoundView {
  const shownPath =
    requestPath.length > 64 ? `${requestPath.slice(0, 64)}…` : requestPath;
  const commandTokens: CurlToken[] = [
    { text: 'curl', type: 'cmd' },
    { text: ' ', type: 'plain' },
    { text: '-X', type: 'flag' },
    { text: ' ', type: 'plain' },
    { text: 'GET', type: 'method' },
    { text: ' ', type: 'plain' },
    { text: "'", type: 'quote' },
    { text: escapeSingleQuoted(site.baseUrl), type: 'url' },
    { text: escapeSingleQuoted(shownPath), type: 'pval' },
    { text: "'", type: 'quote' },
  ];
  return {
    commandHtml: renderTokensHtml(commandTokens),
    responseHtml: renderJsonHtml({
      error: {
        type: 'not_found',
        message: `This page is not part of the ${site.apiName} ${site.apiVersion} reference.`,
        hint: 'Pick one of the documented endpoints below.',
      },
    }),
    endpoints: endpoints.map(toEndpointCard),
  };
}
