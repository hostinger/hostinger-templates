/**
 * Pure functions that assemble a curl command as a list of typed tokens.
 *
 * The token list is the single source of truth: joining the token texts
 * yields the exact copyable command, and the same tokens drive the
 * syntax-highlighted rendering. The browser enhancement in
 * `public/js/try-it.js` mirrors this module one-to-one — change them
 * together.
 */

import type { Endpoint, EndpointParam, JsonValue } from '../types/content.js';
import { escapeHtml } from './html.js';

export type CurlTokenType =
  | 'plain'
  | 'cmd'
  | 'flag'
  | 'method'
  | 'quote'
  | 'url'
  | 'pval'
  | 'qkey'
  | 'qval'
  | 'hname'
  | 'hval'
  | 'jkey'
  | 'jstr'
  | 'jnum'
  | 'jconst'
  | 'punct';

export interface CurlToken {
  text: string;
  type: CurlTokenType;
}

export interface CurlAuth {
  headerName: string;
  scheme: string;
  tokenPlaceholder: string;
}

export interface CurlInput {
  baseUrl: string;
  auth: CurlAuth;
  endpoint: Endpoint;
  /** Raw form input strings keyed by param name. */
  values: Record<string, string>;
}

/** Line continuation between curl arguments. */
const NEWLINE = ' \\\n  ';

/** Escape text placed inside a single-quoted shell string. */
export function escapeSingleQuoted(value: string): string {
  return value.replaceAll("'", "'\\''");
}

/**
 * Escape text placed inside a double-quoted shell string. `$` is left
 * alone on purpose so the auth token placeholder stays a shell variable.
 */
export function escapeDoubleQuoted(value: string): string {
  return value
    .replaceAll('\\', '\\\\')
    .replaceAll('"', '\\"')
    .replaceAll('`', '\\`');
}

/** Convert a param's committed example into the string shown in its input. */
export function exampleToInputValue(param: EndpointParam): string {
  if (Array.isArray(param.example)) {
    return param.example.join(', ');
  }
  return String(param.example);
}

/** Split a comma-separated array input into trimmed, non-empty items. */
export function parseArrayInput(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

/** A param is part of the command when it has a value or is required. */
function isIncluded(param: EndpointParam, raw: string): boolean {
  return param.required || raw.trim() !== '';
}

/** Convert one raw input string into the JSON value for a body field. */
function toBodyValue(param: EndpointParam, raw: string): JsonValue | undefined {
  if (param.type === 'array') {
    return parseArrayInput(raw);
  }
  if (param.type === 'boolean') {
    if (raw === 'true') return true;
    if (raw === 'false') return false;
    return undefined;
  }
  if (param.type === 'integer') {
    const numeric = Number(raw);
    if (raw.trim() !== '' && Number.isFinite(numeric)) return numeric;
    return raw;
  }
  return raw;
}

/** Build the JSON body object, or null when the command has no body. */
export function buildBodyObject(
  endpoint: Endpoint,
  values: Record<string, string>,
): Record<string, JsonValue> | null {
  const body: Record<string, JsonValue> = {};
  let hasEntries = false;
  for (const param of endpoint.params) {
    if (param.in !== 'body') continue;
    const raw = values[param.name] ?? '';
    if (!isIncluded(param, raw)) continue;
    const value = toBodyValue(param, raw);
    if (value === undefined) continue;
    body[param.name] = value;
    hasEntries = true;
  }
  return hasEntries ? body : null;
}

/**
 * Emit syntax tokens for a JSON value, pretty-printed exactly like
 * `JSON.stringify(value, null, 2)`. When `shellEscape` is set, string
 * tokens are also escaped for a surrounding single-quoted shell argument.
 */
export function emitJsonTokens(
  value: JsonValue,
  indent: number,
  shellEscape: boolean,
  out: CurlToken[],
): void {
  const pad = ' '.repeat(indent);
  const childPad = ' '.repeat(indent + 2);

  if (value === null) {
    out.push({ text: 'null', type: 'jconst' });
    return;
  }
  if (typeof value === 'boolean') {
    out.push({ text: String(value), type: 'jconst' });
    return;
  }
  if (typeof value === 'number') {
    out.push({ text: JSON.stringify(value), type: 'jnum' });
    return;
  }
  if (typeof value === 'string') {
    const literal = JSON.stringify(value);
    out.push({
      text: shellEscape ? escapeSingleQuoted(literal) : literal,
      type: 'jstr',
    });
    return;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      out.push({ text: '[]', type: 'punct' });
      return;
    }
    out.push({ text: '[\n', type: 'punct' });
    value.forEach((item, index) => {
      out.push({ text: childPad, type: 'plain' });
      emitJsonTokens(item, indent + 2, shellEscape, out);
      out.push({ text: index < value.length - 1 ? ',\n' : '\n', type: 'punct' });
    });
    out.push({ text: pad, type: 'plain' });
    out.push({ text: ']', type: 'punct' });
    return;
  }

  const entries = Object.entries(value);
  if (entries.length === 0) {
    out.push({ text: '{}', type: 'punct' });
    return;
  }
  out.push({ text: '{\n', type: 'punct' });
  entries.forEach(([key, entry], index) => {
    const keyLiteral = JSON.stringify(key);
    out.push({ text: childPad, type: 'plain' });
    out.push({
      text: shellEscape ? escapeSingleQuoted(keyLiteral) : keyLiteral,
      type: 'jkey',
    });
    out.push({ text: ': ', type: 'punct' });
    emitJsonTokens(entry, indent + 2, shellEscape, out);
    out.push({ text: index < entries.length - 1 ? ',\n' : '\n', type: 'punct' });
  });
  out.push({ text: pad, type: 'plain' });
  out.push({ text: '}', type: 'punct' });
}

/** The query params that currently belong in the command. */
function includedQueryParams(
  endpoint: Endpoint,
  values: Record<string, string>,
): EndpointParam[] {
  return endpoint.params.filter(
    (param) =>
      param.in === 'query' && isIncluded(param, values[param.name] ?? ''),
  );
}

/**
 * Emit the single-quoted URL: base and path with substituted params.
 * When `withQuery` is set (endpoints that also send a JSON body), the
 * query string is percent-encoded into the URL; otherwise the query is
 * emitted later as readable `--data-urlencode` lines.
 */
function emitUrlTokens(
  input: CurlInput,
  withQuery: boolean,
  out: CurlToken[],
): void {
  const { baseUrl, endpoint, values } = input;
  out.push({ text: "'", type: 'quote' });
  out.push({ text: escapeSingleQuoted(baseUrl), type: 'url' });

  for (const piece of endpoint.path.split(/(\{[^}]+\})/)) {
    if (piece === '') continue;
    const match = /^\{([^}]+)\}$/.exec(piece);
    if (!match) {
      out.push({ text: escapeSingleQuoted(piece), type: 'url' });
      continue;
    }
    const raw = (values[match[1]] ?? '').trim();
    out.push({
      text: raw === '' ? piece : escapeSingleQuoted(encodeURIComponent(raw)),
      type: 'pval',
    });
  }

  if (withQuery) {
    includedQueryParams(endpoint, values).forEach((param, index) => {
      const raw = (values[param.name] ?? '').trim();
      out.push({ text: index === 0 ? '?' : '&', type: 'punct' });
      out.push({
        text: escapeSingleQuoted(encodeURIComponent(param.name)),
        type: 'qkey',
      });
      out.push({ text: '=', type: 'punct' });
      out.push({
        text: escapeSingleQuoted(encodeURIComponent(raw)),
        type: 'qval',
      });
    });
  }

  out.push({ text: "'", type: 'quote' });
}

/**
 * Assemble the full curl command for an endpoint and its form values.
 *
 * Endpoints without body params get their query string as readable
 * `-G --data-urlencode 'key=value'` lines (curl handles the encoding);
 * endpoints that send a JSON body keep the query percent-encoded in the
 * URL, since `-G` would move `-d` data into the query string.
 */
export function buildCurlTokens(input: CurlInput): CurlToken[] {
  const { auth, endpoint, values } = input;
  const hasBodyParams = endpoint.params.some((param) => param.in === 'body');
  const out: CurlToken[] = [];

  out.push({ text: 'curl', type: 'cmd' });
  out.push({ text: ' ', type: 'plain' });
  out.push({ text: '-X', type: 'flag' });
  out.push({ text: ' ', type: 'plain' });
  out.push({ text: endpoint.method, type: 'method' });
  out.push({ text: NEWLINE, type: 'plain' });

  emitUrlTokens(input, hasBodyParams, out);

  if (!hasBodyParams) {
    const queryParams = includedQueryParams(endpoint, values);
    if (queryParams.length > 0) {
      out.push({ text: NEWLINE, type: 'plain' });
      out.push({ text: '-G', type: 'flag' });
      for (const param of queryParams) {
        const raw = (values[param.name] ?? '').trim();
        out.push({ text: NEWLINE, type: 'plain' });
        out.push({ text: '--data-urlencode', type: 'flag' });
        out.push({ text: ' ', type: 'plain' });
        out.push({ text: "'", type: 'quote' });
        out.push({ text: escapeSingleQuoted(param.name), type: 'qkey' });
        out.push({ text: '=', type: 'punct' });
        out.push({ text: escapeSingleQuoted(raw), type: 'qval' });
        out.push({ text: "'", type: 'quote' });
      }
    }
  }

  out.push({ text: NEWLINE, type: 'plain' });
  out.push({ text: '-H', type: 'flag' });
  out.push({ text: ' ', type: 'plain' });
  out.push({ text: '"', type: 'quote' });
  out.push({ text: escapeDoubleQuoted(auth.headerName), type: 'hname' });
  out.push({ text: ': ', type: 'punct' });
  const authValue = auth.scheme
    ? `${auth.scheme} ${auth.tokenPlaceholder}`
    : auth.tokenPlaceholder;
  out.push({ text: escapeDoubleQuoted(authValue), type: 'hval' });
  out.push({ text: '"', type: 'quote' });

  const body = buildBodyObject(endpoint, input.values);
  if (body !== null) {
    out.push({ text: NEWLINE, type: 'plain' });
    out.push({ text: '-H', type: 'flag' });
    out.push({ text: ' ', type: 'plain' });
    out.push({ text: "'", type: 'quote' });
    out.push({ text: 'Content-Type', type: 'hname' });
    out.push({ text: ': ', type: 'punct' });
    out.push({ text: 'application/json', type: 'hval' });
    out.push({ text: "'", type: 'quote' });

    out.push({ text: NEWLINE, type: 'plain' });
    out.push({ text: '-d', type: 'flag' });
    out.push({ text: ' ', type: 'plain' });
    out.push({ text: "'", type: 'quote' });
    emitJsonTokens(body, 2, true, out);
    out.push({ text: "'", type: 'quote' });
  }

  return out;
}

/** The exact copyable command text for a token list. */
export function renderTokensText(tokens: CurlToken[]): string {
  return tokens.map((token) => token.text).join('');
}

/** Escaped, syntax-highlighted HTML for a token list. */
export function renderTokensHtml(tokens: CurlToken[]): string {
  return tokens
    .map((token) => {
      if (token.type === 'plain') return escapeHtml(token.text);
      const methodClass =
        token.type === 'method'
          ? ` tok-method-${token.text.toLowerCase()}`
          : '';
      return `<span class="tok tok-${token.type}${methodClass}">${escapeHtml(token.text)}</span>`;
    })
    .join('');
}

/** Highlighted HTML for a committed JSON example (no shell escaping). */
export function renderJsonHtml(value: JsonValue): string {
  const tokens: CurlToken[] = [];
  emitJsonTokens(value, 0, false, tokens);
  return renderTokensHtml(tokens);
}
