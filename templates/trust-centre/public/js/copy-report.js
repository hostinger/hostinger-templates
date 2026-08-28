/**
 * Reveals the "copy report" button on the fallback page when the Clipboard
 * API is available. Without JavaScript the report text stays selectable in
 * the <pre> block, so nothing is lost.
 */
(function () {
  'use strict';

  var button = document.querySelector('[data-copy-report]');
  var source = document.getElementById('report-text');
  if (!button || !source || !navigator.clipboard) {
    return;
  }

  button.hidden = false;
  var defaultLabel = button.textContent;
  var copiedLabel = button.getAttribute('data-copied-label') || defaultLabel;
  var resetTimer;

  button.addEventListener('click', function () {
    navigator.clipboard.writeText(source.textContent || '').then(function () {
      button.textContent = copiedLabel;
      button.classList.add('is-copied');
      clearTimeout(resetTimer);
      resetTimer = setTimeout(function () {
        button.textContent = defaultLabel;
        button.classList.remove('is-copied');
      }, 2000);
    });
  });
})();
