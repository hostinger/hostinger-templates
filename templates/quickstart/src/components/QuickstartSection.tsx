import type { FC } from 'hono/jsx';
import type { QuickstartContent } from '../types/content.js';
import { CommandBlock } from './CommandBlock.js';

export const QuickstartSection: FC<{ quickstart: QuickstartContent }> = ({ quickstart }) => (
  <section class="section section-quickstart" id="quickstart" aria-labelledby="quickstart-heading">
    <div class="container">
      <div class="section-head">
        <h2 class="section-heading" id="quickstart-heading">
          {quickstart.heading}
        </h2>
        <p class="section-sub">{quickstart.sub}</p>
      </div>
      <ol class="steps">
        {quickstart.steps.map((step, index) => (
          <li class="step">
            <span class="step-num" aria-hidden="true">
              {index + 1}
            </span>
            <div class="step-body">
              <h3 class="step-title">{step.title}</h3>
              <CommandBlock command={step.command} />
              <p class="step-explanation">{step.explanation}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
