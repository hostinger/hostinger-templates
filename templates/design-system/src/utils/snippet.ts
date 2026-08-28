import type {
  ComponentDoc,
  PlaygroundConfig,
  PropMeta,
  PropValue,
} from '../types/content';

/** Single-line snippets longer than this wrap one attribute per line. */
const MAX_LINE = 72;

const escapeAttr = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;');

/**
 * Renders one prop as template markup, or `null` when it should be omitted.
 * Optional props are omitted while they sit at the component's default;
 * required props always appear.
 */
const attrFor = (prop: PropMeta, value: PropValue): string | null => {
  if (!prop.required && value === prop.default) {
    return null;
  }
  if (typeof value === 'boolean') {
    return value ? prop.name : `:${prop.name}="false"`;
  }
  return `${prop.name}="${escapeAttr(value)}"`;
};

/**
 * Builds the exact template markup that reproduces the current preview.
 * Deterministic: attributes follow the documented prop order, defaults are
 * omitted, and lines wrap only when the single-line form exceeds 72 chars.
 */
export const buildSnippet = (
  doc: ComponentDoc,
  config: PlaygroundConfig,
): string => {
  const attrs = doc.props
    .map((prop) => attrFor(prop, config[prop.name] ?? prop.initial))
    .filter((attr): attr is string => attr !== null);

  const inlineOpen = `<${doc.tag}${attrs.length > 0 ? ` ${attrs.join(' ')}` : ''}`;
  const wrappedOpen = `<${doc.tag}\n${attrs.map((attr) => `  ${attr}`).join('\n')}\n`;

  // Self-closing components (no slot).
  if (doc.slotText === undefined && doc.slotPlaceholder === undefined) {
    const single = `${inlineOpen} />`;
    return single.length <= MAX_LINE || attrs.length === 0
      ? single
      : `${wrappedOpen}/>`;
  }

  const inner = doc.slotText ?? doc.slotPlaceholder ?? '';
  const single = `${inlineOpen}>${inner}</${doc.tag}>`;

  // Text slots stay on one line while they fit.
  if (doc.slotText !== undefined && single.length <= MAX_LINE) {
    return single;
  }

  const open =
    `${inlineOpen}>`.length <= MAX_LINE || attrs.length === 0
      ? `${inlineOpen}>`
      : `${wrappedOpen}>`;
  return `${open}\n  ${inner}\n</${doc.tag}>`;
};
