import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const THUMBNAIL_FAIL_RATIO = Number(process.env.VISUAL_FAIL_RATIO ?? '0.25');
const HOMEPAGE_FAIL_RATIO = Number(process.env.VISUAL_HOMEPAGE_FAIL_RATIO ?? '0.3');
const PIXEL_THRESHOLD = Number(process.env.VISUAL_PIXEL_THRESHOLD ?? '0.15');

export function comparePreviewScreenshots({
  templateId,
  templateDir,
  port,
  outDir,
}) {
  mkdirSync(outDir, { recursive: true });

  const expectedThumbnail = join(templateDir, 'preview', `${templateId}-thumbnail.png`);
  const expectedHomepage = join(templateDir, 'preview', `${templateId}-homepage.png`);
  const actualThumbnail = join(outDir, 'actual-thumbnail.png');
  const actualHomepage = join(outDir, 'actual-homepage.png');

  capture(port, actualThumbnail, false);
  capture(port, actualHomepage, true);

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

function capture(port, dest, fullPage) {
  const args = [
    '--yes',
    'playwright@latest',
    'screenshot',
    '--browser',
    'chromium',
    '--viewport-size',
    '1440,900',
  ];

  if (fullPage) {
    args.push('--full-page');
  }

  args.push(`http://127.0.0.1:${port}/`, dest);

  execFileSync('npx', args, {
    stdio: 'pipe',
    cwd: scriptsDir,
  });
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
