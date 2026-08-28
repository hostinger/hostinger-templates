import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Redirect,
  Render,
} from '@nestjs/common';
import { ContentService } from './content.service.js';
import { buildCurlTokens, renderJsonHtml, renderTokensHtml } from './utils/curl.js';
import { resolveParamValues } from './utils/params.js';
import { buildFaqJsonLd } from './utils/schema.js';
import {
  buildFormGroups,
  buildParamDocGroups,
  groupEndpoints,
  renderPathHtml,
  toEndpointCard,
} from './utils/view-models.js';

@Controller()
export class AppController {
  constructor(private readonly content: ContentService) {}

  @Get()
  @Render('index')
  home() {
    const { site, endpoints } = this.content;
    const quickstart = endpoints[0];
    const quickstartTokens = buildCurlTokens({
      baseUrl: site.baseUrl,
      auth: site.auth,
      endpoint: quickstart,
      values: resolveParamValues(quickstart, {}).values,
    });

    return {
      site,
      pageTitle: `${site.apiName} API Reference`,
      metaDescription: site.metaDescription,
      faqJsonLd: buildFaqJsonLd(site.faqs),
      pageScripts: ['/js/try-it.js'],
      groups: groupEndpoints(endpoints),
      endpointCount: endpoints.length,
      authHeaderLine: `${site.auth.headerName}: ${site.auth.scheme} ${site.auth.tokenPlaceholder}`,
      quickstart: {
        ...toEndpointCard(quickstart),
        curlHtml: renderTokensHtml(quickstartTokens),
      },
    };
  }

  /** Convenience: `/endpoints` is not a page, send it to the index list. */
  @Get('endpoints')
  @Redirect('/#endpoints', 302)
  endpointsIndex() {}

  @Get('endpoints/:slug')
  @Render('endpoint')
  endpoint(
    @Param('slug') slug: string,
    @Query() query: Record<string, unknown>,
  ) {
    const endpoint = this.content.getEndpoint(slug);
    if (!endpoint) {
      throw new NotFoundException();
    }

    const { site } = this.content;
    const { values, fromUrl } = resolveParamValues(endpoint, query);
    const curlTokens = buildCurlTokens({
      baseUrl: site.baseUrl,
      auth: site.auth,
      endpoint,
      values,
    });
    const tryData = {
      baseUrl: site.baseUrl,
      auth: {
        headerName: site.auth.headerName,
        scheme: site.auth.scheme,
        tokenPlaceholder: site.auth.tokenPlaceholder,
      },
      endpoint: {
        slug: endpoint.slug,
        method: endpoint.method,
        path: endpoint.path,
        params: endpoint.params,
      },
    };

    return {
      site,
      pageTitle: `${endpoint.method} ${endpoint.path} — ${site.apiName} API Reference`,
      metaDescription: endpoint.summary,
      pageScripts: ['/js/try-it.js'],
      endpoint,
      methodClass: `method-${endpoint.method.toLowerCase()}`,
      pathHtml: renderPathHtml(endpoint.path),
      docsNav: groupEndpoints(this.content.endpoints).map((group) => ({
        name: group.name,
        endpoints: group.endpoints.map((entry) => ({
          ...entry,
          active: entry.slug === endpoint.slug,
        })),
      })),
      paramDocGroups: buildParamDocGroups(endpoint),
      formGroups: buildFormGroups(endpoint, values),
      curlHtml: renderTokensHtml(curlTokens),
      responseHtml: renderJsonHtml(endpoint.responseExample),
      tryDataJson: JSON.stringify(tryData).replaceAll('<', '\\u003c'),
      fromUrl,
    };
  }
}
