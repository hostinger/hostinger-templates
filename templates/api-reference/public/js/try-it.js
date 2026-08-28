/*
 * Progressive enhancement for the API reference.
 *
 * - Copy buttons copy the exact text content of their target code block.
 * - On endpoint pages, the request builder re-assembles the curl command
 *   on every input and keeps the page URL in sync so a filled example
 *   can be shared as a link.
 *
 * The curl assembly below mirrors the typed builder in
 * `src/utils/curl.ts` one-to-one — change them together. Nothing here
 * ever performs a network request.
 */
(() => {
  'use strict';

  const NEWLINE = ' \\\n  ';

  function escapeSingleQuoted(value) {
    return value.replaceAll("'", "'\\''");
  }

  function escapeDoubleQuoted(value) {
    return value
      .replaceAll('\\', '\\\\')
      .replaceAll('"', '\\"')
      .replaceAll('`', '\\`');
  }

  function parseArrayInput(value) {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  function isIncluded(param, raw) {
    return param.required || raw.trim() !== '';
  }

  function toBodyValue(param, raw) {
    if (param.type === 'array') {
      return parseArrayInput(raw);
    }
    if (param.type === 'boolean') {
      if (raw === 'true') return true;
      if (raw === 'false') return false;
      return undefined;
    }
    if (param.type === 'integer') {
      const numeric = Number(raw);
      if (raw.trim() !== '' && Number.isFinite(numeric)) return numeric;
      return raw;
    }
    return raw;
  }

  function buildBodyObject(endpoint, values) {
    const body = {};
    let hasEntries = false;
    for (const param of endpoint.params) {
      if (param.in !== 'body') continue;
      const raw = values[param.name] ?? '';
      if (!isIncluded(param, raw)) continue;
      const value = toBodyValue(param, raw);
      if (value === undefined) continue;
      body[param.name] = value;
      hasEntries = true;
    }
    return hasEntries ? body : null;
  }

  function emitJsonTokens(value, indent, shellEscape, out) {
    const pad = ' '.repeat(indent);
    const childPad = ' '.repeat(indent + 2);

    if (value === null) {
      out.push({ text: 'null', type: 'jconst' });
      return;
    }
    if (typeof value === 'boolean') {
      out.push({ text: String(value), type: 'jconst' });
      return;
    }
    if (typeof value === 'number') {
      out.push({ text: JSON.stringify(value), type: 'jnum' });
      return;
    }
    if (typeof value === 'string') {
      const literal = JSON.stringify(value);
      out.push({
        text: shellEscape ? escapeSingleQuoted(literal) : literal,
        type: 'jstr',
      });
      return;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) {
        out.push({ text: '[]', type: 'punct' });
        return;
      }
      out.push({ text: '[\n', type: 'punct' });
      value.forEach((item, index) => {
        out.push({ text: childPad, type: 'plain' });
        emitJsonTokens(item, indent + 2, shellEscape, out);
        out.push({
          text: index < value.length - 1 ? ',\n' : '\n',
          type: 'punct',
        });
      });
      out.push({ text: pad, type: 'plain' });
      out.push({ text: ']', type: 'punct' });
      return;
    }

    const entries = Object.entries(value);
    if (entries.length === 0) {
      out.push({ text: '{}', type: 'punct' });
      return;
    }
    out.push({ text: '{\n', type: 'punct' });
    entries.forEach(([key, entry], index) => {
      const keyLiteral = JSON.stringify(key);
      out.push({ text: childPad, type: 'plain' });
      out.push({
        text: shellEscape ? escapeSingleQuoted(keyLiteral) : keyLiteral,
        type: 'jkey',
      });
      out.push({ text: ': ', type: 'punct' });
      emitJsonTokens(entry, indent + 2, shellEscape, out);
      out.push({
        text: index < entries.length - 1 ? ',\n' : '\n',
        type: 'punct',
      });
    });
    out.push({ text: pad, type: 'plain' });
    out.push({ text: '}', type: 'punct' });
  }

  function includedQueryParams(endpoint, values) {
    return endpoint.params.filter(
      (param) =>
        param.in === 'query' && isIncluded(param, values[param.name] ?? ''),
    );
  }

  function emitUrlTokens(data, values, withQuery, out) {
    out.push({ text: "'", type: 'quote' });
    out.push({ text: escapeSingleQuoted(data.baseUrl), type: 'url' });

    for (const piece of data.endpoint.path.split(/(\{[^}]+\})/)) {
      if (piece === '') continue;
      const match = /^\{([^}]+)\}$/.exec(piece);
      if (!match) {
        out.push({ text: escapeSingleQuoted(piece), type: 'url' });
        continue;
      }
      const raw = (values[match[1]] ?? '').trim();
      out.push({
        text: raw === '' ? piece : escapeSingleQuoted(encodeURIComponent(raw)),
        type: 'pval',
      });
    }

    if (withQuery) {
      includedQueryParams(data.endpoint, values).forEach((param, index) => {
        const raw = (values[param.name] ?? '').trim();
        out.push({ text: index === 0 ? '?' : '&', type: 'punct' });
        out.push({
          text: escapeSingleQuoted(encodeURIComponent(param.name)),
          type: 'qkey',
        });
        out.push({ text: '=', type: 'punct' });
        out.push({
          text: escapeSingleQuoted(encodeURIComponent(raw)),
          type: 'qval',
        });
      });
    }

    out.push({ text: "'", type: 'quote' });
  }

  function buildCurlTokens(data, values) {
    const hasBodyParams = data.endpoint.params.some(
      (param) => param.in === 'body',
    );
    const out = [];

    out.push({ text: 'curl', type: 'cmd' });
    out.push({ text: ' ', type: 'plain' });
    out.push({ text: '-X', type: 'flag' });
    out.push({ text: ' ', type: 'plain' });
    out.push({ text: data.endpoint.method, type: 'method' });
    out.push({ text: NEWLINE, type: 'plain' });

    emitUrlTokens(data, values, hasBodyParams, out);

    if (!hasBodyParams) {
      const queryParams = includedQueryParams(data.endpoint, values);
      if (queryParams.length > 0) {
        out.push({ text: NEWLINE, type: 'plain' });
        out.push({ text: '-G', type: 'flag' });
        for (const param of queryParams) {
          const raw = (values[param.name] ?? '').trim();
          out.push({ text: NEWLINE, type: 'plain' });
          out.push({ text: '--data-urlencode', type: 'flag' });
          out.push({ text: ' ', type: 'plain' });
          out.push({ text: "'", type: 'quote' });
          out.push({ text: escapeSingleQuoted(param.name), type: 'qkey' });
          out.push({ text: '=', type: 'punct' });
          out.push({ text: escapeSingleQuoted(raw), type: 'qval' });
          out.push({ text: "'", type: 'quote' });
        }
      }
    }

    out.push({ text: NEWLINE, type: 'plain' });
    out.push({ text: '-H', type: 'flag' });
    out.push({ text: ' ', type: 'plain' });
    out.push({ text: '"', type: 'quote' });
    out.push({ text: escapeDoubleQuoted(data.auth.headerName), type: 'hname' });
    out.push({ text: ': ', type: 'punct' });
    const authValue = data.auth.scheme
      ? data.auth.scheme + ' ' + data.auth.tokenPlaceholder
      : data.auth.tokenPlaceholder;
    out.push({ text: escapeDoubleQuoted(authValue), type: 'hval' });
    out.push({ text: '"', type: 'quote' });

    const body = buildBodyObject(data.endpoint, values);
    if (body !== null) {
      out.push({ text: NEWLINE, type: 'plain' });
      out.push({ text: '-H', type: 'flag' });
      out.push({ text: ' ', type: 'plain' });
      out.push({ text: "'", type: 'quote' });
      out.push({ text: 'Content-Type', type: 'hname' });
      out.push({ text: ': ', type: 'punct' });
      out.push({ text: 'application/json', type: 'hval' });
      out.push({ text: "'", type: 'quote' });

      out.push({ text: NEWLINE, type: 'plain' });
      out.push({ text: '-d', type: 'flag' });
      out.push({ text: ' ', type: 'plain' });
      out.push({ text: "'", type: 'quote' });
      emitJsonTokens(body, 2, true, out);
      out.push({ text: "'", type: 'quote' });
    }

    return out;
  }

  /* Render tokens into the code block using text nodes only. */
  function renderTokens(codeEl, tokens) {
    codeEl.textContent = '';
    const fragment = document.createDocumentFragment();
    for (const token of tokens) {
      if (token.type === 'plain') {
        fragment.appendChild(document.createTextNode(token.text));
        continue;
      }
      const span = document.createElement('span');
      let className = 'tok tok-' + token.type;
      if (token.type === 'method') {
        className += ' tok-method-' + token.text.toLowerCase();
      }
      span.className = className;
      span.textContent = token.text;
      fragment.appendChild(span);
    }
    codeEl.appendChild(fragment);
  }

  /* ---- copy buttons ---- */

  function findStatusElement(button) {
    let node = button.parentElement;
    while (node) {
      const status = node.querySelector('[data-copy-status]');
      if (status) return status;
      node = node.parentElement;
    }
    return null;
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        /* fall through to the textarea fallback */
      }
    }
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '-1000px';
    document.body.appendChild(area);
    area.select();
    let copied;
    try {
      copied = document.execCommand('copy');
    } catch {
      copied = false;
    }
    area.remove();
    return copied;
  }

  function initCopyButtons() {
    for (const button of document.querySelectorAll('[data-copy-target]')) {
      button.addEventListener('click', async () => {
        const target = document.querySelector(
          button.getAttribute('data-copy-target'),
        );
        if (!target) return;
        const copied = await copyText(target.textContent ?? '');
        const status = findStatusElement(button);
        button.textContent = copied ? 'Copied' : 'Copy failed';
        button.classList.toggle('is-copied', copied);
        if (status) {
          status.textContent = copied
            ? 'Command copied to the clipboard.'
            : 'Copy failed — select the command text and copy it manually.';
        }
        window.setTimeout(() => {
          button.textContent = 'Copy';
          button.classList.remove('is-copied');
          if (status) status.textContent = '';
        }, 2000);
      });
    }
  }

  /* ---- request builder panel ---- */

  function initTryPanel(panel) {
    const dataEl = panel.querySelector('[data-try-data]');
    const codeEl = panel.querySelector('[data-curl-output]');
    const form = panel.querySelector('form');
    if (!dataEl || !codeEl || !form) return;

    let data;
    try {
      data = JSON.parse(dataEl.textContent);
    } catch {
      return;
    }

    const controls = Array.from(form.querySelectorAll('[data-param]'));

    function readValues() {
      const values = {};
      for (const param of data.endpoint.params) {
        values[param.name] = '';
      }
      for (const control of controls) {
        values[control.getAttribute('data-param')] = control.value;
      }
      return values;
    }

    function syncUrl(values) {
      const search = new URLSearchParams();
      for (const param of data.endpoint.params) {
        const value = values[param.name] ?? '';
        if (value.trim() !== '') search.set(param.name, value);
      }
      const query = search.toString();
      history.replaceState(
        null,
        '',
        location.pathname + (query ? '?' + query : ''),
      );
    }

    function rebuild() {
      const values = readValues();
      renderTokens(codeEl, buildCurlTokens(data, values));
      syncUrl(values);
    }

    for (const control of controls) {
      control.addEventListener('input', rebuild);
      control.addEventListener('change', rebuild);
    }
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      rebuild();
    });
  }

  initCopyButtons();
  const panel = document.querySelector('[data-try-panel]');
  if (panel) initTryPanel(panel);
})();
