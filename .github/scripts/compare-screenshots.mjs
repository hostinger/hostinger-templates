import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import pixelmatch from 'pixelmatch';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';

const THUMBNAIL_FAIL_RATIO = Number(process.env.VISUAL_FAIL_RATIO ?? '0.25');
const HOMEPAGE_FAIL_RATIO = Number(process.env.VISUAL_HOMEPAGE_FAIL_RATIO ?? '0.3');
const PIXEL_THRESHOLD = Number(process.env.VISUAL_PIXEL_THRESHOLD ?? '0.15');
const MAX_SCROLL = 30000;

export async function comparePreviewScreenshots({
  templateId,
  templateDir,
  port,
  outDir,
  settleMs = 0,
}) {
  mkdirSync(outDir, { recursive: true });

  const expectedThumbnail = join(templateDir, 'preview', `${templateId}-thumbnail.png`);
  const expectedHomepage = join(templateDir, 'preview', `${templateId}-homepage.png`);
  const actualThumbnail = join(outDir, 'actual-thumbnail.png');
  const actualHomepage = join(outDir, 'actual-homepage.png');

  await capture(port, { thumbnail: actualThumbnail, homepage: actualHomepage }, settleMs);

  const thumbnail = comparePair({
    name: 'thumbnail',
    expectedPath: expectedThumbnail,
    actualPath: actualThumbnail,
    diffPath: join(outDir, 'diff-thumbnail.png'),
    failRatio: THUMBNAIL_FAIL_RATIO,
  });
  const homepage = comparePair({
    name: 'homepage',
    expectedPath: expectedHomepage,
    actualPath: actualHomepage,
    diffPath: join(outDir, 'diff-homepage.png'),
    failRatio: HOMEPAGE_FAIL_RATIO,
  });

  const result = {
    ok: thumbnail.ok && homepage.ok,
    thumbnail,
    homepage,
  };

  writeFileSync(join(outDir, 'visual.json'), JSON.stringify(result, null, 2));
  return result;
}

async function capture(port, paths, settleMs) {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'load' });
    await page.waitForTimeout(settleMs);
    await revealOnScroll(page);
    await page.screenshot({ path: paths.thumbnail });
    await page.screenshot({ path: paths.homepage, fullPage: true });
  } finally {
    await browser.close();
  }
}

async function revealOnScroll(page) {
  for (let top = 0; top < Math.min(MAX_SCROLL, await page.evaluate(() => document.documentElement.scrollHeight)); top += 600) {
    await page.evaluate((y) => window.scrollTo(0, y), top);
    await page.waitForTimeout(150);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);
}

function comparePair({ name, expectedPath, actualPath, diffPath, failRatio }) {
  if (!existsSync(expectedPath)) {
    return {
      name,
      ok: false,
      skipped: false,
      error: `Missing committed baseline ${expectedPath}`,
    };
  }

  copyFileSync(expectedPath, join(dirname(diffPath), `expected-${name}.png`));

  const expected = PNG.sync.read(readFileSync(expectedPath));
  const actual = PNG.sync.read(readFileSync(actualPath));
  const width = Math.min(expected.width, actual.width);
  const height = Math.min(expected.height, actual.height);

  if (width === 0 || height === 0) {
    return {
      name,
      ok: false,
      error: 'Screenshot has zero size',
      expected: sizeOf(expected),
      actual: sizeOf(actual),
    };
  }

  const expectedCrop = crop(expected, width, height);
  const actualCrop = crop(actual, width, height);
  const diff = new PNG({ width, height });
  const diffPixels = pixelmatch(
    expectedCrop.data,
    actualCrop.data,
    diff.data,
    width,
    height,
    { threshold: PIXEL_THRESHOLD },
  );
  const mismatchRatio = diffPixels / (width * height);
  writeFileSync(diffPath, PNG.sync.write(diff));

  return {
    name,
    ok: mismatchRatio <= failRatio,
    mismatchRatio,
    diffPixels,
    failRatio,
    expected: sizeOf(expected),
    actual: sizeOf(actual),
    compared: { width, height },
    heightDelta: actual.height - expected.height,
  };
}

function crop(image, width, height) {
  if (image.width === width && image.height === height) {
    return image;
  }

  const cropped = new PNG({ width, height });
  PNG.bitblt(image, cropped, 0, 0, width, height, 0, 0);
  return cropped;
}

function sizeOf(image) {
  return { width: image.width, height: image.height };
}
