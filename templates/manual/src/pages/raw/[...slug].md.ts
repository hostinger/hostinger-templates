import { readFile } from 'node:fs/promises';

import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from 'astro';
import { getCollection } from 'astro:content';

/**
 * Serves the raw Markdown source of every docs page at `/raw/<page>.md`,
 * e.g. `/raw/reference/cli.md`. The "Copy page as Markdown" button reads
 * from these routes, and they double as clean context for AI assistants.
 */
export const getStaticPaths = (async () => {
  const docs = await getCollection('docs');
  return docs.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<Props> = async ({ props }) => {
  const { entry } = props;
  const source = entry.filePath
    ? await readFile(entry.filePath, 'utf8')
    : (entry.body ?? '');

  return new Response(source, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
