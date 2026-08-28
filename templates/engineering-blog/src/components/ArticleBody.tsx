import { useEffect, useRef } from 'react';

type Props = {
  html: string;
};

const COPY_LABEL = 'Copy';
const COPIED_LABEL = 'Copied';
const COPY_RESET_MS = 2000;

/**
 * Renders the post's markdown HTML and progressively enhances every
 * fenced code block with a copy button. Without JavaScript (or without
 * the async Clipboard API) the article stays fully readable — the
 * buttons are simply never added.
 */
export function ArticleBody({ html }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => attachCopyButtons(containerRef.current), [html]);

  return (
    <div
      ref={containerRef}
      className="article-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function attachCopyButtons(container: HTMLDivElement | null): (() => void) | undefined {
  const clipboardAvailable =
    typeof navigator !== 'undefined' && Boolean(navigator.clipboard);
  if (!container || !clipboardAvailable) return undefined;

  const blocks = Array.from(
    container.querySelectorAll<HTMLElement>('.gatsby-highlight'),
  );

  const cleanups = blocks.map((block) => {
    const code = block.querySelector('code');
    if (!code) return () => {};

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-copy';
    button.textContent = COPY_LABEL;
    button.setAttribute('aria-label', 'Copy code to clipboard');

    let resetTimer: number | undefined;

    const handleClick = async () => {
      // textContent preserves the code exactly; only the highlighter's
      // trailing newline is dropped.
      const text = (code.textContent ?? '').replace(/\n$/, '');
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = COPIED_LABEL;
        button.classList.add('is-copied');
        window.clearTimeout(resetTimer);
        resetTimer = window.setTimeout(() => {
          button.textContent = COPY_LABEL;
          button.classList.remove('is-copied');
        }, COPY_RESET_MS);
      } catch {
        button.textContent = 'Copy failed';
      }
    };

    button.addEventListener('click', handleClick);
    block.appendChild(button);

    return () => {
      window.clearTimeout(resetTimer);
      button.removeEventListener('click', handleClick);
      button.remove();
    };
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}
