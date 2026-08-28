import type {
  ComponentDoc,
  PlaygroundConfig,
  PropMeta,
  PropValue,
} from '../types/content';

/** Longest accepted stored string, mirroring the text controls' maxlength. */
const MAX_TEXT_LENGTH = 60;

const storageKeyFor = (id: string): string => `vitrine-playground:${id}`;

/** The playground's documented starting configuration. */
export const initialConfig = (doc: ComponentDoc): PlaygroundConfig =>
  Object.fromEntries(doc.props.map((prop) => [prop.name, prop.initial]));

const isValidValue = (prop: PropMeta, value: unknown): value is PropValue => {
  if (prop.control === 'toggle') {
    return typeof value === 'boolean';
  }
  if (typeof value !== 'string') {
    return false;
  }
  if (prop.control === 'select') {
    return (prop.options ?? []).includes(value);
  }
  return value.length <= MAX_TEXT_LENGTH;
};

/**
 * Restores the last configuration saved on this device, prop by prop.
 * Anything missing, malformed, or no longer documented falls back to the
 * playground's initial value.
 */
export const loadConfig = (doc: ComponentDoc): PlaygroundConfig => {
  const config = initialConfig(doc);
  try {
    const raw = window.localStorage.getItem(storageKeyFor(doc.id));
    if (raw === null) {
      return config;
    }
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      return config;
    }
    for (const prop of doc.props) {
      const stored = (parsed as Record<string, unknown>)[prop.name];
      if (stored !== undefined && isValidValue(prop, stored)) {
        config[prop.name] = stored;
      }
    }
  } catch {
    // Storage unavailable or unreadable — start from the documented config.
  }
  return config;
};

/** Persists the configuration so it survives reloads on this device. */
export const saveConfig = (doc: ComponentDoc, config: PlaygroundConfig): void => {
  try {
    window.localStorage.setItem(storageKeyFor(doc.id), JSON.stringify(config));
  } catch {
    // Storage unavailable (private mode, quota) — the playground still works.
  }
};

/** Forgets the saved configuration for one component. */
export const clearConfig = (doc: ComponentDoc): void => {
  try {
    window.localStorage.removeItem(storageKeyFor(doc.id));
  } catch {
    // Nothing to clear when storage is unavailable.
  }
};
