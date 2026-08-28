<script lang="ts">
  import { LABELS } from '../content/copy';
  import { plan } from '../lib/plan.svelte';
  import { buildShareUrl } from '../lib/urlState';

  let copied = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | undefined;

  async function copyLink() {
    const url = buildShareUrl(plan.assignments);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt(LABELS.copyFallbackPrompt, url);
      return;
    }
    copied = true;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      copied = false;
    }, 2000);
  }

  function clearPlan() {
    if (window.confirm(LABELS.clearConfirm)) plan.clear();
  }
</script>

<div class="toolbar">
  <p class="counter" aria-live="polite">
    {LABELS.seatedCounter}
    <strong>{String(plan.seatedCount).padStart(2, '0')} / {plan.totalGuests}</strong>
  </p>
  <div class="actions">
    <button type="button" class="primary" onclick={copyLink}>
      {copied ? LABELS.copied : LABELS.copyLink}
    </button>
    <button type="button" onclick={() => window.print()}>{LABELS.print}</button>
    <button type="button" onclick={clearPlan} disabled={plan.seatedCount === 0}>
      {LABELS.clear}
    </button>
  </div>
</div>

<style>
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.8rem 0;
    border-top: 1px solid var(--line-soft);
    border-bottom: 1px solid var(--line-soft);
  }

  .counter {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--ink-dim);
  }

  .counter strong {
    margin-left: 0.4rem;
    color: var(--accent);
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  button {
    padding: 0.5rem 0.95rem;
    border: 1px solid var(--line-soft);
    background: transparent;
    color: var(--ink);
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition:
      border-color 120ms ease,
      background-color 120ms ease,
      color 120ms ease;
  }

  button:hover:not(:disabled) {
    border-color: var(--line);
  }

  button:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .primary {
    border-color: var(--accent);
    background: var(--accent);
    color: var(--paper-deep);
    font-weight: 700;
  }

  .primary:hover {
    background: transparent;
    color: var(--accent);
  }
</style>
