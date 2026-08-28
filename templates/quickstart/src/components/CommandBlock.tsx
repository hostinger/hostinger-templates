import type { FC } from 'hono/jsx';

type TokenKind = 'bin' | 'flag' | 'env' | 'op' | 'str' | 'url' | 'arg';

interface CommandToken {
  text: string;
  kind: TokenKind;
}

const OPERATORS = new Set(['&&', '||', '|', ';']);

/**
 * Splits a single-line shell command into display tokens. Tokens are
 * re-joined with the original single spaces, so the rendered text content
 * is always exactly the command — which is what the copy button copies.
 */
export function tokenizeCommand(command: string): CommandToken[] {
  const parts = command.split(' ');
  const tokens: CommandToken[] = [];
  let expectBinary = true;
  let inString = false;

  for (const part of parts) {
    let kind: TokenKind = 'arg';
    if (inString) {
      kind = 'str';
      if (part.endsWith('"') || part.endsWith("'")) inString = false;
    } else if (OPERATORS.has(part)) {
      kind = 'op';
      expectBinary = true;
    } else if (part === '') {
      kind = 'arg';
    } else if (expectBinary && /^[A-Za-z_][A-Za-z0-9_]*=/.test(part)) {
      kind = 'env';
    } else if (expectBinary) {
      kind = 'bin';
      expectBinary = false;
    } else if (part.startsWith('"') || part.startsWith("'")) {
      kind = 'str';
      const quote = part.slice(0, 1);
      if (!(part.length > 1 && part.endsWith(quote))) inString = true;
    } else if (part.startsWith('-')) {
      kind = 'flag';
    } else if (part.startsWith('http://') || part.startsWith('https://')) {
      kind = 'url';
    }
    tokens.push({ text: part, kind });
  }

  return tokens;
}

function renderTokens(command: string) {
  return tokenizeCommand(command).map((token, index) => (
    <>
      {index > 0 ? ' ' : ''}
      <span class={`tok tok-${token.kind}`}>{token.text}</span>
    </>
  ));
}

/**
 * A dark one-line terminal block. The `$` prompt is drawn with CSS so it is
 * never part of the selectable or copyable text; `public/js/enhance.js`
 * injects a copy button that copies the code element's exact text content.
 */
export const CommandBlock: FC<{ command: string; outputLine?: string }> = ({
  command,
  outputLine,
}) => (
  <div class="term-block" data-copy-block>
    <pre class="term-pre"><code class="term-code" data-copy-code>{renderTokens(command)}</code>{outputLine === undefined ? null : ['\n', <span class="term-output">{outputLine}</span>]}</pre>
  </div>
);
