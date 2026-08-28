import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import type { RouteRecord } from './types/content.js';
import { loadRoutes, loadSiteContent } from './utils/content.js';
import { buildProfileChart, buildSparkline } from './utils/elevation.js';
import {
  CLIMB_FILTERS,
  DISTANCE_FILTERS,
  buildFilterHref,
  climbBucket,
  distanceBucket,
  filterRoutes,
  parseClimbFilter,
  parseDistanceFilter,
  type ClimbFilterId,
  type DistanceFilterId,
} from './utils/filters.js';
import { formatKm, formatMetres } from './utils/format.js';
import { buildFaqJsonLd } from './utils/schema.js';

/**
 * The compiled server runs from `dist/`, the dev server from `src/`.
 * Both sit one level below the project root, so views, data and static
 * assets are resolved from there and the build needs no copy step.
 */
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const site = loadSiteContent(rootDir);
const routes = loadRoutes(rootDir);
const routeBySlug = new Map(routes.map((route) => [route.slug, route]));

const app = express();
app.disable('x-powered-by');
app.set('view engine', 'ejs');
app.set('views', path.join(rootDir, 'src', 'views'));

// Shared locals available to every view.
app.locals.site = site;
app.locals.faqJsonLd = buildFaqJsonLd(site.faqs);

app.use(
  express.static(path.join(rootDir, 'public'), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.gpx')) {
        res.setHeader('Content-Type', 'application/gpx+xml');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${path.basename(filePath)}"`,
        );
      }
    },
  }),
);

function toRouteCard(route: RouteRecord) {
  return {
    name: route.name,
    slug: route.slug,
    surface: route.surface,
    difficulty: route.difficulty,
    startPoint: route.startPoint,
    description: route.description,
    distanceLabel: formatKm(route.distanceKm),
    climbLabel: formatMetres(route.elevationGainM),
    href: `/routes/${route.slug}`,
    gpxHref: `/gpx/${route.slug}.gpx`,
    distanceBucket: distanceBucket(route),
    climbBucket: climbBucket(route),
    sparkline: buildSparkline(route.profile),
  };
}

function toFilterChips<Id extends DistanceFilterId | ClimbFilterId>(
  options: ReadonlyArray<{ id: Id; label: string }>,
  group: 'distance' | 'climb',
  distance: DistanceFilterId,
  climb: ClimbFilterId,
) {
  return options.map((option) => ({
    id: option.id,
    label: option.label,
    active: group === 'distance' ? option.id === distance : option.id === climb,
    href:
      group === 'distance'
        ? buildFilterHref(option.id as DistanceFilterId, climb)
        : buildFilterHref(distance, option.id as ClimbFilterId),
  }));
}

app.get('/', (req, res) => {
  const distance = parseDistanceFilter(req.query.distance);
  const climb = parseClimbFilter(req.query.climb);
  const matchedSlugs = new Set(
    filterRoutes(routes, distance, climb).map((route) => route.slug),
  );

  const totalKm = routes.reduce((sum, route) => sum + route.distanceKm, 0);
  const totalClimb = routes.reduce(
    (sum, route) => sum + route.elevationGainM,
    0,
  );

  res.render('index', {
    pageTitle: `${site.clubName} — Route Library`,
    metaDescription: site.intro,
    pageScripts: ['/js/filters.js'],
    distanceChips: toFilterChips(DISTANCE_FILTERS, 'distance', distance, climb),
    climbChips: toFilterChips(CLIMB_FILTERS, 'climb', distance, climb),
    cards: routes.map((route) => ({
      ...toRouteCard(route),
      matched: matchedSlugs.has(route.slug),
    })),
    matchedCount: matchedSlugs.size,
    totals: {
      count: routes.length,
      distanceLabel: formatKm(totalKm),
      climbLabel: formatMetres(totalClimb),
    },
  });
});

app.get('/routes/:slug', (req, res) => {
  const route = routeBySlug.get(req.params.slug);
  if (!route) {
    renderNotFound(res);
    return;
  }

  res.render('route', {
    pageTitle: `${route.name} — ${site.clubName}`,
    metaDescription: route.description,
    pageScripts: ['/js/profile-hover.js'],
    route,
    chart: buildProfileChart(route.profile),
    distanceLabel: formatKm(route.distanceKm),
    climbLabel: formatMetres(route.elevationGainM),
    gpxHref: `/gpx/${route.slug}.gpx`,
    gpxFileName: `${route.slug}.gpx`,
    otherRoutes: routes
      .filter((other) => other.slug !== route.slug)
      .map((other) => ({
        name: other.name,
        href: `/routes/${other.slug}`,
        distanceLabel: formatKm(other.distanceKm),
        climbLabel: formatMetres(other.elevationGainM),
        difficulty: other.difficulty,
      })),
  });
});

function renderNotFound(res: Response): void {
  res.status(404).render('not-found', {
    pageTitle: `Not in the book — ${site.clubName}`,
    metaDescription: `That page is not in the ${site.clubName} route book.`,
    pageScripts: [],
    allRoutes: routes.map((route) => ({
      name: route.name,
      href: `/routes/${route.slug}`,
      distanceLabel: formatKm(route.distanceKm),
    })),
  });
}

app.use((req, res) => {
  renderNotFound(res);
});

app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    next(err);
    return;
  }
  console.error(err);
  res
    .status(500)
    .type('text/plain')
    .send('Something went wrong on our side. Please try again.');
});

const parsedPort = Number.parseInt(process.env.PORT ?? '', 10);
const port = Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 4361;

app.listen(port, () => {
  console.log(`${site.clubName} route library running at http://localhost:${port}`);
});
