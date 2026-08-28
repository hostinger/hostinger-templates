import { readFileSync } from 'node:fs';
import path from 'node:path';
import { Injectable } from '@nestjs/common';
import { projectRoot } from './paths.js';
import type { Endpoint, SiteContent } from './types/content.js';

/** Loads the committed JSON content once and serves it to the app. */
@Injectable()
export class ContentService {
  readonly site: SiteContent;
  readonly endpoints: Endpoint[];
  private readonly bySlug: Map<string, Endpoint>;

  constructor() {
    this.site = readJson<SiteContent>('site.json');
    this.endpoints = readJson<Endpoint[]>('endpoints.json');
    this.bySlug = new Map(
      this.endpoints.map((endpoint) => [endpoint.slug, endpoint]),
    );
  }

  getEndpoint(slug: string): Endpoint | undefined {
    return this.bySlug.get(slug);
  }
}

function readJson<T>(fileName: string): T {
  const filePath = path.join(projectRoot, 'data', fileName);
  return JSON.parse(readFileSync(filePath, 'utf8')) as T;
}
