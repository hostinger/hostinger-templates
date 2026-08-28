import { useRef, useState } from 'react';
import { CopyIcon } from '../icons/CopyIcon';
import type { InstallOption } from '../types/site';

type InstallTabsProps = {
  title: string;
  description: string;
  options: InstallOption[];
};

type CopyState = 'idle' | 'success' | 'error';

export const InstallTabs = ({ title, description, options }: InstallTabsProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeOption = options[activeIndex];

  const selectTab = (index: number) => {
    setActiveIndex(index);
    setCopyState('idle');
    tabRefs.current[index]?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    let nextIndex: number | null = null;

    if (event.key === 'ArrowRight') nextIndex = (activeIndex + 1) % options.length;
    if (event.key === 'ArrowLeft') nextIndex = (activeIndex - 1 + options.length) % options.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = options.length - 1;

    if (nextIndex !== null) {
      event.preventDefault();
      selectTab(nextIndex);
    }
  };

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(activeOption.command);
      setCopyState('success');
    } catch {
      setCopyState('error');
    }
  };

  return (
    <section className="install-section" id="install" aria-labelledby="install-title">
      <div className="section-index" aria-hidden="true">00 / INSTALL</div>
      <div className="install-intro">
        <h2 id="install-title">{title}</h2>
        <p>{description}</p>
      </div>
      <div className="install-console">
        <div className="install-tabs" role="tablist" aria-label="Installation method">
          {options.map((option, index) => (
            <button
              key={option.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              id={`install-tab-${option.id}`}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              aria-controls={`install-panel-${option.id}`}
              tabIndex={activeIndex === index ? 0 : -1}
              onClick={() => selectTab(index)}
              onKeyDown={handleKeyDown}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div
          className="install-panel"
          id={`install-panel-${activeOption.id}`}
          role="tabpanel"
          aria-labelledby={`install-tab-${activeOption.id}`}
        >
          <code>
            <span aria-hidden="true">$ </span>
            {activeOption.command}
          </code>
          <button className="copy-button" type="button" onClick={copyCommand}>
            <CopyIcon copied={copyState === 'success'} />
            <span>{copyState === 'success' ? 'Copied' : copyState === 'error' ? 'Copy failed' : 'Copy'}</span>
          </button>
        </div>
        <p className="copy-status" role="status" aria-live="polite">
          {copyState === 'success' && 'Command copied to clipboard.'}
          {copyState === 'error' && 'Clipboard unavailable. Select and copy the command manually.'}
        </p>
      </div>
    </section>
  );
};
