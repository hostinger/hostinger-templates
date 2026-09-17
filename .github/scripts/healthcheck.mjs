import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createConnection } from 'node:net';
import { basename, join } from 'node:path';
import { comparePreviewScreenshots } from './compare-screenshots.mjs';

const templateDir = process.argv[2] ?? process.cwd();
const templateId = process.env.TEMPLATE_ID ?? basename(templateDir);
const outDir = process.env.PREVIEW_OUT ?? join(templateDir, '.preview-visual');
const port = Number.parseInt(process.env.PORT ?? '4173', 10);
const previewScript = JSON.parse(
  readFileSync(join(templateDir, 'package.json'), 'utf8'),
).scripts?.preview;

if (!previewScript) {
  console.error('package.json is missing a preview script');
  process.exit(1);
}

const extraArgs = previewArgs(previewScript, port);
const child = spawn('npm', ['run', 'preview', ...extraArgs], {
  cwd: templateDir,
  env: {
    ...process.env,
    PORT: String(port),
    HOST: '127.0.0.1',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
  detached: true,
});

let output = '';
child.stdout.on('data', (chunk) => {
  output += chunk;
});
child.stderr.on('data', (chunk) => {
  output += chunk;
});

const stop = () => {
  if (child.pid) {
    try {
      process.kill(-child.pid, 'SIGTERM');
    } catch {
      try {
        child.kill('SIGTERM');
      } catch {
        // already gone
      }
    }
  }
};

process.on('exit', stop);
process.on('SIGINT', () => {
  stop();
  process.exit(1);
});

try {
  await waitForPort(port, 60_000);
  const response = await fetch(`http://127.0.0.1:${port}/`, {
    redirect: 'follow',
  });
  const body = await response.text();
  const contentType = response.headers.get('content-type') ?? '';

  if (response.status >= 400) {
    throw new Error(`GET / returned ${response.status}`);
  }

  if (body.length < 50) {
    throw new Error(`GET / returned a suspiciously small body (${body.length} bytes)`);
  }

  mkdirSync(outDir, { recursive: true });
  const visual = comparePreviewScreenshots({
    templateId,
    templateDir,
    port,
    outDir,
  });

  const result = {
    ok: visual.ok,
    status: response.status,
    contentType,
    bytes: body.length,
    port,
    visual,
  };
  writeFileSync(join(outDir, 'result.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result));

  if (!visual.ok) {
    throw new Error(visualFailure(visual));
  }
} catch (error) {
  console.error(output.trim());
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  stop();
}

function visualFailure(visual) {
  const parts = [visual.thumbnail, visual.homepage]
    .filter((item) => item && !item.ok)
    .map((item) => {
      if (item.error) {
        return `${item.name}: ${item.error}`;
      }

      return `${item.name}: ${(item.mismatchRatio * 100).toFixed(1)}% pixels differ (limit ${(item.failRatio * 100).toFixed(0)}%)`;
    });

  return parts.join('; ') || 'Visual comparison failed';
}

function previewArgs(script, listenPort) {
  if (/\bserve\b/.test(script)) {
    return ['--', '-l', `tcp://127.0.0.1:${listenPort}`];
  }

  if (/\bnuxt preview\b/.test(script)) {
    return ['--', '--port', String(listenPort)];
  }

  if (/\bvite preview\b/.test(script) || /\bastro preview\b/.test(script)) {
    return ['--', '--host', '127.0.0.1', '--port', String(listenPort)];
  }

  return [];
}

function waitForPort(listenPort, timeoutMs) {
  const started = Date.now();

  return new Promise((resolve, reject) => {
    const attempt = () => {
      const socket = createConnection({ host: '127.0.0.1', port: listenPort }, () => {
        socket.end();
        resolve();
      });

      socket.on('error', () => {
        socket.destroy();
        if (Date.now() - started > timeoutMs) {
          reject(new Error(`Preview did not listen on port ${listenPort} within ${timeoutMs}ms`));
          return;
        }
        setTimeout(attempt, 400);
      });
    };

    attempt();
  });
}
