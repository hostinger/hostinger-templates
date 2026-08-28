import { useEffect, useRef, useState } from 'react';
import { APP_COPY } from '../constants/copy';
import { KeysDoodle } from '../icons/KeysDoodle';

export function ShareBar() {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // Clipboard API unavailable (e.g. insecure context): fall back to a prompt.
      window.prompt('Copy this link:', window.location.href);
    }
    setCopied(true);
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="share-bar" aria-labelledby="share-heading">
      <KeysDoodle className="share-bar__doodle" />
      <div className="share-bar__text">
        <h2 id="share-heading">{APP_COPY.share.heading}</h2>
        <p>{APP_COPY.share.body}</p>
      </div>
      <button type="button" className="share-bar__button" onClick={copyLink}>
        {copied ? APP_COPY.share.copied : APP_COPY.share.button}
      </button>
      <span className="visually-hidden" role="status">
        {copied ? APP_COPY.share.copied : ''}
      </span>
    </section>
  );
}
