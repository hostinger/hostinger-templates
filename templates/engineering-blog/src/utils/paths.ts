export const WRITING_PATH_PREFIX = '/writing';

export function postPath(slug: string): string {
  return `${WRITING_PATH_PREFIX}/${slug}/`;
}
