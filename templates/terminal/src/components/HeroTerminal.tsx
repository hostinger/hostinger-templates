import { useTypewriter } from '../hooks/useTypewriter';

type HeroTerminalProps = {
  command: string;
  output: string[];
};

export const HeroTerminal = ({ command, output }: HeroTerminalProps) => {
  const typed = useTypewriter(command);

  return (
    <div className="hero-terminal" aria-label="relayctl command demonstration">
      <div className="terminal-bar" aria-hidden="true">
        <span>TTY 01</span>
        <span>LOCAL SESSION</span>
        <span>80×24</span>
      </div>
      <div className="terminal-screen">
        <p className="terminal-command">
          <span aria-hidden="true">$</span>
          <span>{typed.text}</span>
          <span className="terminal-cursor" aria-hidden="true" />
        </p>
        <div
          className={`terminal-output ${typed.complete ? 'terminal-output--visible' : ''}`}
          aria-live="polite"
        >
          {typed.complete &&
            output.map((line, index) => (
              <p key={line} style={{ '--line-delay': `${index * 85}ms` } as React.CSSProperties}>
                {line}
              </p>
            ))}
        </div>
      </div>
      <span className="terminal-stamp" aria-hidden="true">
        SIGNAL<br />VERIFIED
      </span>
    </div>
  );
};
