import type { FC } from 'hono/jsx';
import type { ResultContent } from '../types/content.js';
import { Terminal } from './Terminal.js';

/** The boxed "in five minutes you'll have" payoff, shown up front in the hero. */
export const ResultPanel: FC<{ result: ResultContent }> = ({ result }) => (
  <aside class="result-panel" aria-labelledby="result-title">
    <p class="result-eyebrow">{result.eyebrow}</p>
    <h2 class="result-title" id="result-title">
      {result.title}
    </h2>
    <Terminal terminal={result.terminal} />
    <ul class="result-list">
      {result.items.map((item) => (
        <li class="result-item">
          <span class="result-check" aria-hidden="true">
            ✓
          </span>
          <div class="result-item-body">
            <p class="result-item-title">{item.title}</p>
            <p class="result-item-detail">{item.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  </aside>
);
