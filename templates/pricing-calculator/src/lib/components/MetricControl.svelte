<script lang="ts">
  import { formatNumber } from '$lib/calculation'
  import type { NumericLimit } from '$lib/types/pricing'

  let {
    id,
    label,
    value,
    limit,
    suffix,
    onChange,
  }: {
    id: string
    label: string
    value: number
    limit: NumericLimit
    suffix: string
    onChange: (value: number) => void
  } = $props()

  const progress = $derived(((value - limit.min) / (limit.max - limit.min)) * 100)

  function commit(rawValue: string) {
    const parsed = Number(rawValue)
    if (!Number.isFinite(parsed)) return
    onChange(Math.min(limit.max, Math.max(limit.min, Math.round(parsed))))
  }
</script>

<section class="metric" aria-labelledby={`${id}-label`}>
  <div class="metric__heading">
    <div>
      <span class="metric__index" aria-hidden="true">0{id === 'seats' ? '1' : '2'}</span>
      <label id={`${id}-label`} for={`${id}-number`}>{label}</label>
    </div>
    <div class="metric__input-wrap">
      <input
        id={`${id}-number`}
        class="metric__number"
        type="number"
        min={limit.min}
        max={limit.max}
        step={limit.step}
        {value}
        aria-describedby={`${id}-suffix`}
        onchange={(event) => commit(event.currentTarget.value)}
      />
      <span id={`${id}-suffix`}>{suffix}</span>
    </div>
  </div>

  <div class="metric__track">
    <input
      id={`${id}-range`}
      class="metric__range"
      type="range"
      min={limit.min}
      max={limit.max}
      step={limit.step}
      {value}
      aria-label={`${label}: ${formatNumber(value)} ${suffix}`}
      style={`--progress: ${progress}%`}
      oninput={(event) => onChange(Number(event.currentTarget.value))}
    />
    <div class="metric__ticks" aria-hidden="true">
      {#each Array.from({ length: 21 }, (_, index) => index) as index (index)}
        <i></i>
      {/each}
    </div>
    <div class="metric__bounds" aria-hidden="true">
      <span>{formatNumber(limit.min)}</span>
      <span>{formatNumber(limit.max)}</span>
    </div>
  </div>
</section>
