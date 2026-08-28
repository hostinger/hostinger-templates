import path from 'node:path';
import { fileURLToPath } from 'node:url';
import formbody from '@fastify/formbody';
import fastifyStatic from '@fastify/static';
import view from '@fastify/view';
import ejs from 'ejs';
import Fastify from 'fastify';
import type { FastifyReply } from 'fastify';
import {
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MIN_LENGTH,
  hasErrors,
  normalizeDisclosureInput,
  prepareReport,
  validateDisclosure,
  type DisclosureErrors,
  type DisclosureInput,
} from './utils/disclosure.js';
import { loadSiteContent, loadTrustContent } from './utils/content.js';
import { formatDate, formatTimestamp } from './utils/format.js';
import { buildFaqJsonLd } from './utils/schema.js';

/**
 * The compiled server runs from `dist/`, the dev server from `src/`. Both sit
 * one level below the project root, so views, data and static assets resolve
 * from there and the build needs no copy step.
 */
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const site = loadSiteContent(rootDir);
const trust = loadTrustContent(rootDir);

const EMPTY_FORM: DisclosureInput = { email: '', category: '', description: '' };
const NO_ERRORS: DisclosureErrors = {};

async function start(): Promise<void> {
  const app = Fastify();

  await app.register(formbody);
  await app.register(fastifyStatic, { root: path.join(rootDir, 'public') });
  await app.register(view, {
  engine: { ejs },
  root: path.join(rootDir, 'src', 'views'),
  viewExt: 'ejs',
  defaultContext: {
    site,
    trust,
    faqJsonLd: buildFaqJsonLd(trust.faqs.items),
    lastReviewedLabel: formatDate(site.page.lastReviewed),
    subprocessorsUpdatedLabel: formatDate(trust.subprocessors.lastUpdated),
    descriptionMinLength: DESCRIPTION_MIN_LENGTH,
    descriptionMaxLength: DESCRIPTION_MAX_LENGTH,
  },
  });

app.get('/', (_request, reply) => {
  return reply.view('index', {
    pageTitle: `${site.company.name} ${site.page.title}`,
    metaDescription: site.page.metaDescription,
    pageScripts: ['/js/disclosure-form.js'],
    formValues: EMPTY_FORM,
    formErrors: NO_ERRORS,
  });
});

/** Deep links to /disclosure land on the form section of the home page. */
app.get('/disclosure', (_request, reply) => {
  return reply.redirect('/#disclosure', 303);
});

app.post('/disclosure', (request, reply) => {
  const input = normalizeDisclosureInput(request.body);
  const errors = validateDisclosure(
    input,
    trust.disclosure.form.categories,
    trust.disclosure.validation,
  );

  if (hasErrors(errors)) {
    return reply.code(422).view('disclosure', {
      pageTitle: `${trust.disclosure.validation.errorSummaryHeading} — ${site.company.name} ${site.page.title}`,
      metaDescription: site.page.metaDescription,
      pageScripts: ['/js/disclosure-form.js'],
      formValues: input,
      formErrors: errors,
    });
  }

  const category = trust.disclosure.form.categories.find(
    (candidate) => candidate.id === input.category,
  );
  if (!category) {
    // validateDisclosure already guarantees this; the check narrows the type.
    throw new Error(`Unknown disclosure category "${input.category}".`);
  }

  const report = prepareReport(input, {
    securityEmail: site.securityContact.email,
    productName: site.company.product,
    categoryLabel: category.label,
    anonymousReporter: trust.disclosure.fallback.anonymousReporter,
    labels: trust.disclosure.reportLabels,
    preparedAt: formatTimestamp(new Date()),
  });

  return reply.view('disclosure-fallback', {
    pageTitle: `${trust.disclosure.fallback.heading} — ${site.company.name} ${site.page.title}`,
    metaDescription: site.page.metaDescription,
    pageScripts: ['/js/copy-report.js'],
    report,
    categoryLabel: category.label,
  });
});

function renderNotFound(reply: FastifyReply): FastifyReply {
  return reply.code(404).view('not-found', {
    pageTitle: `Page not found — ${site.company.name} ${site.page.title}`,
    metaDescription: site.page.metaDescription,
    pageScripts: [],
  });
}

app.setNotFoundHandler((_request, reply) => {
  return renderNotFound(reply);
});

app.setErrorHandler((error, _request, reply) => {
  console.error(error);
  return reply
    .code(500)
    .type('text/plain; charset=utf-8')
    .send('Something went wrong on our side. Please try again.');
});

const parsedPort = Number.parseInt(process.env.PORT ?? '', 10);
const port = Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 4373;

  await app.listen({ port, host: '0.0.0.0' });
  console.log(
    `${site.company.name} trust centre running at http://localhost:${port}`,
  );
}

start().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
