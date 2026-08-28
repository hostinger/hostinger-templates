import type { FC } from 'hono/jsx';
import type { TerminalIllustration } from '../types/content.js';

/**
 * A typographic terminal-output illustration. Announced to assistive
 * technology as a single image via the aria-label from site.json.
 */
export const Terminal: FC<{ terminal: TerminalIllustration }> = ({ terminal }) => (
  <figure class="terminal" role="img" aria-label={terminal.ariaLabel}>
    <div class="terminal-chrome">
      <span class="terminal-dot" />
      <span class="terminal-dot" />
      <span class="terminal-dot terminal-dot-accent" />
      <span class="terminal-title">{terminal.title}</span>
    </div>
    <pre class="terminal-screen">{terminal.lines.map((line, index) => (
      <>
        {index > 0 ? '\n' : ''}
        <span class={`tline tline-${line.kind}`}>{line.text}</span>
      </>
    ))}</pre>
  </figure>
);
