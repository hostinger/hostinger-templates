/**
 * Resolves the try-it form state for an endpoint page request.
 *
 * Rule (mirrored by `public/js/try-it.js` when it writes the URL): if the
 * query string names at least one known param, the URL is the complete
 * form state — params absent from it are empty. Otherwise the form starts
 * from the committed example values.
 */

import type { Endpoint } from '../types/content.js';
import { exampleToInputValue } from './curl.js';

export interface ResolvedFormState {
  /** Raw input strings keyed by param name. */
  values: Record<string, string>;
  /** True when the state was restored from the page URL. */
  fromUrl: boolean;
}

/** Express query values can be strings or arrays; take the first string. */
function firstString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
  return '';
}

export function resolveParamValues(
  endpoint: Endpoint,
  query: Record<string, unknown>,
): ResolvedFormState {
  const fromUrl = endpoint.params.some((param) =>
    Object.hasOwn(query, param.name),
  );
  const values: Record<string, string> = {};
  for (const param of endpoint.params) {
    values[param.name] = fromUrl
      ? firstString(query[param.name])
      : exampleToInputValue(param);
  }
  return { values, fromUrl };
}
