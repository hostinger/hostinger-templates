import {
  Catch,
  NotFoundException,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ContentService } from './content.service.js';
import { buildNotFoundView } from './utils/view-models.js';

/** Renders the styled 404 page for unknown routes and unknown slugs. */
@Catch(NotFoundException)
export class NotFoundViewFilter implements ExceptionFilter {
  constructor(private readonly content: ContentService) {}

  catch(_exception: NotFoundException, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const { site, endpoints } = this.content;

    response.status(404).render('not-found', {
      site,
      pageTitle: `Not found — ${site.apiName} API Reference`,
      metaDescription: `That page is not part of the ${site.apiName} API reference.`,
      pageScripts: [],
      notFound: buildNotFoundView(site, endpoints, request.path),
    });
  }
}
