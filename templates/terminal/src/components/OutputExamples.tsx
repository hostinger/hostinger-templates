import type { OutputExample } from '../types/site';

type OutputExamplesProps = {
  examples: OutputExample[];
};

export const OutputExamples = ({ examples }: OutputExamplesProps) => (
  <section className="examples-section" aria-labelledby="examples-title">
    <header>
      <p>Output specimens / 03</p>
      <h2 id="examples-title">Readable at a glance.<br />Parseable on demand.</h2>
    </header>
    <div className="example-stack">
      {examples.map((example, index) => (
        <figure key={example.title} className="output-example">
          <figcaption>
            <span>SPECIMEN {String.fromCharCode(65 + index)}</span>
            {example.title}
          </figcaption>
          <pre>
            <code>
              <span className="example-command">$ {example.command}</span>
              {'\n'}
              {example.output.join('\n')}
            </code>
          </pre>
        </figure>
      ))}
    </div>
  </section>
);
