<script lang="ts">
  import { browser } from '$app/environment'
  import { resolve } from '$app/paths'
  import { onMount } from 'svelte'
  import EstimateReceipt from '$lib/components/EstimateReceipt.svelte'
  import HowTo from '$lib/components/HowTo.svelte'
  import MetricControl from '$lib/components/MetricControl.svelte'
  import UsageCurve from '$lib/components/UsageCurve.svelte'
  import { calculateEstimate, formatCompact } from '$lib/calculation'
  import rawContent from '$lib/content/pricing.json'
  import { readEstimate, writeEstimate } from '$lib/url-state'
  import type { EstimateInput, PricingContent } from '$lib/types/pricing'
  import '../styles/global.css'

  const content = rawContent as PricingContent
  let input = $state<EstimateInput>({ ...content.defaults })
  let copied = $state(false)
  let hydrated = $state(false)
  const estimate = $derived(calculateEstimate(input, content.pricing))

  onMount(() => {
    input = readEstimate(new URLSearchParams(window.location.search), content.defaults, content.limits)
    hydrated = true
  })

  $effect(() => {
    if (!browser || !hydrated) return
    const next = writeEstimate(new URL(window.location.href), input)
    window.history.replaceState({}, '', next)
  })

  function setMetric(metric: keyof EstimateInput, value: number) {
    input = { ...input, [metric]: value }
    copied = false
  }

  async function copyShareLink() {
    const shareUrl = writeEstimate(new URL(window.location.href), input).toString()
    await navigator.clipboard.writeText(shareUrl)
    copied = true
    window.setTimeout(() => (copied = false), 2200)
  }
</script>

<svelte:head>
  <title>Pricing Calculator — Vectorline</title>
</svelte:head>

<main>
  <header class="site-header">
    <a class="brand" href={resolve('/')} aria-label="Vectorline pricing calculator home">
      <span class="brand__glyph" aria-hidden="true">V/</span>
      <span>{content.product.name}</span>
    </a>
    <div class="site-header__status"><i></i> RATE TABLE ACTIVE</div>
  </header>

  <section class="hero">
    <div class="hero__copy">
      <p class="eyebrow">{content.product.eyebrow}</p>
      <h1>{content.product.headline}</h1>
      <p class="hero__description">{content.product.description}</p>
    </div>
    <div class="hero__readout" aria-label="Current inputs">
      <span>{String(input.seats).padStart(3, '0')} USERS</span>
      <span>{formatCompact(input.usage)} REQUESTS</span>
    </div>
  </section>

  <section class="instrument" aria-label="Pricing calculator">
    <div class="instrument__panel">
      <div class="instrument__bar">
        <span>INPUT CHANNELS</span>
        <span>DRAG TO CALIBRATE</span>
      </div>

      <MetricControl
        id="seats"
        label="Workspace seats"
        value={input.seats}
        limit={content.limits.seats}
        suffix="SEATS"
        onChange={(value) => setMetric('seats', value)}
      />

      <MetricControl
        id="usage"
        label="Monthly API usage"
        value={input.usage}
        limit={content.limits.usage}
        suffix="CALLS"
        onChange={(value) => setMetric('usage', value)}
      />

      <UsageCurve usage={input.usage} maximum={content.limits.usage.max} />

      <div class="instrument__spec">
        <span>BASE {content.pricing.baseFee} USD</span>
        <span>{content.pricing.includedSeats} SEATS INCLUDED</span>
        <span>{formatCompact(content.pricing.includedUsage)} CALLS INCLUDED</span>
      </div>
    </div>

    <EstimateReceipt {estimate} {copied} onCopy={copyShareLink} />
  </section>

  <HowTo items={content.howTo} />

  <footer>
    <span>{content.product.name} / ESTIMATION UTILITY</span>
    <span>NO ACCOUNT · NO BILLING API · 2026</span>
  </footer>
</main>
