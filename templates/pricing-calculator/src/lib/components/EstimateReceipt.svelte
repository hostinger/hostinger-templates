<script lang="ts">
  import { formatCurrency } from '$lib/calculation'
  import type { Estimate } from '$lib/types/pricing'

  let {
    estimate,
    copied,
    onCopy,
  }: {
    estimate: Estimate
    copied: boolean
    onCopy: () => void
  } = $props()
</script>

<aside class="receipt" aria-label="Monthly estimate" aria-live="polite">
  <div class="receipt__top">
    <div>
      <p>ESTIMATE / MONTHLY</p>
      <span>USD · BEFORE TAX</span>
    </div>
    <div class="receipt__mark" aria-hidden="true">V/L</div>
  </div>

  <div class="receipt__lines">
    {#each estimate.lines as line (line.id)}
      <div class="receipt__line">
        <div>
          <strong>{line.label}</strong>
          <span>{line.detail}</span>
        </div>
        <b>{formatCurrency(line.amount)}</b>
      </div>
    {/each}
  </div>

  <div class="receipt__total">
    <span>Estimated total</span>
    <strong>{formatCurrency(estimate.total)}</strong>
    <small>per month</small>
  </div>

  <button class="receipt__copy" type="button" onclick={onCopy}>
    <span>{copied ? 'LINK COPIED' : 'COPY SHARE LINK'}</span>
    <span aria-hidden="true">{copied ? '✓' : '↗'}</span>
  </button>
  <p class="receipt__note">Planning estimate only. No billing data is collected.</p>
</aside>
