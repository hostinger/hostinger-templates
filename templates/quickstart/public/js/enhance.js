/**
 * Progressive enhancement, in two parts:
 *
 * 1. Install tabs — the server renders stacked, labelled install blocks that
 *    read fine on their own. This script upgrades the group to a proper
 *    tablist (role=tab / tabpanel, arrow-key + Home/End navigation, roving
 *    tabindex) and shows one panel at a time.
 *
 * 2. Copy buttons — every command block gets a button that copies the code
 *    element's exact text content. The $ prompt is CSS-drawn, so what you
 *    see as the command is exactly what lands on the clipboard.
 */
(() => {
  'use strict';

  // --- Install tabs -------------------------------------------------------
  const setupTabs = (root) => {
    const panels = Array.from(root.querySelectorAll('[data-tab-panel]'));
    if (panels.length < 2) return;

    const tablist = document.createElement('div');
    tablist.className = 'tablist';
    tablist.setAttribute('role', 'tablist');
    if (root.dataset.tabsLabel) {
      tablist.setAttribute('aria-label', root.dataset.tabsLabel);
    }

    const tabs = panels.map((panel, index) => {
      const label = panel.querySelector('[data-tab-label]');
      const tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'tab';
      tab.id = `${panel.id}-tab`;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', panel.id);
      tab.textContent = label ? label.textContent.trim() : `Tab ${index + 1}`;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
      tablist.append(tab);
      return tab;
    });

    const select = (index, moveFocus) => {
      tabs.forEach((tab, i) => {
        const active = i === index;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        panels[i].hidden = !active;
      });
      if (moveFocus) tabs[index].focus();
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(index, false));
      tab.addEventListener('keydown', (event) => {
        const last = tabs.length - 1;
        let next = null;
        if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1;
        else if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = last;
        if (next === null) return;
        event.preventDefault();
        select(next, true);
      });
    });

    root.prepend(tablist);
    root.classList.add('tabs-active');
    select(0, false);
  };

  document.querySelectorAll('[data-tabs]').forEach(setupTabs);

  // --- Copy-to-clipboard buttons ------------------------------------------
  const status = document.createElement('div');
  status.className = 'sr-only';
  status.setAttribute('role', 'status');
  document.body.append(status);

  const setupCopy = (block) => {
    const code = block.querySelector('[data-copy-code]');
    if (!code) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-btn';
    button.textContent = 'Copy';
    button.setAttribute('aria-label', `Copy command: ${code.textContent}`);

    let timer;
    button.addEventListener('click', () => {
      navigator.clipboard
        .writeText(code.textContent)
        .then(() => {
          button.classList.add('copied');
          button.textContent = 'Copied';
          status.textContent = 'Command copied to clipboard';
          clearTimeout(timer);
          timer = setTimeout(() => {
            button.classList.remove('copied');
            button.textContent = 'Copy';
            status.textContent = '';
          }, 2000);
        })
        .catch(() => {
          // Clipboard unavailable (permissions, very old browser): select the
          // command instead so a manual ⌘C / Ctrl+C still copies it exactly.
          const selection = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(code);
          selection.removeAllRanges();
          selection.addRange(range);
          status.textContent = 'Command selected — press Ctrl+C or Cmd+C to copy';
        });
    });

    block.append(button);
  };

  if (navigator.clipboard || window.getSelection) {
    document.querySelectorAll('[data-copy-block]').forEach(setupCopy);
  }
})();
