import path from 'node:path';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import type { Express } from 'express';
import hbs from 'hbs';
import { AppModule } from './app.module.js';
import { ContentService } from './content.service.js';
import { projectRoot } from './paths.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  (app.getHttpAdapter().getInstance() as Express).disable('x-powered-by');
  app.useStaticAssets(path.join(projectRoot, 'public'));
  app.setBaseViewsDir(path.join(projectRoot, 'views'));
  app.setViewEngine('hbs');
  await new Promise<void>((resolve) => {
    hbs.registerPartials(path.join(projectRoot, 'views', 'partials'), resolve);
  });

  const parsedPort = Number.parseInt(process.env.PORT ?? '', 10);
  const port =
    Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 4375;
  await app.listen(port);

  const { site } = app.get(ContentService);
  console.log(
    `${site.apiName} API reference running at http://localhost:${port}`,
  );
}

bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
