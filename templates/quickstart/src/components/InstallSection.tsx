import type { FC } from 'hono/jsx';
import type { InstallContent, ProjectContent } from '../types/content.js';
import { CommandBlock } from './CommandBlock.js';

/**
 * Server-rendered as stacked, labelled install blocks so the page reads
 * fully without JavaScript. `public/js/enhance.js` upgrades the group to an
 * accessible tablist (role=tab / tabpanel, arrow-key navigation).
 */
export const InstallSection: FC<{ install: InstallContent; project: ProjectContent }> = ({
  install,
  project,
}) => (
  <section class="section section-install" id="install" aria-labelledby="install-heading">
    <div class="container">
      <div class="section-head">
        <h2 class="section-heading" id="install-heading">
          {install.heading}
        </h2>
        <p class="section-sub">{install.sub}</p>
      </div>
      <div class="install-tabs" data-tabs data-tabs-label={install.tabsLabel}>
        {install.methods.map((method) => (
          <section class="install-method" id={`install-${method.id}`} data-tab-panel>
            <h3 class="install-method-label" data-tab-label>
              {method.label}
            </h3>
            <CommandBlock command={method.command} />
            <p class="install-note">{method.note}</p>
          </section>
        ))}
      </div>
      <div class="install-verify">
        <p class="install-verify-lead">{install.verifyLead}</p>
        <CommandBlock
          command={`${project.binary} --version`}
          outputLine={`${project.binary} ${project.version}`}
        />
      </div>
    </div>
  </section>
);
