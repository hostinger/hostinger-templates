<script lang="ts">
  let { usage, maximum }: { usage: number; maximum: number } = $props()

  const x = $derived(24 + (usage / maximum) * 352)
  const y = $derived(120 - Math.pow(usage / maximum, 0.55) * 78)
</script>

<div class="curve" aria-hidden="true">
  <div class="curve__label">LIVE LOAD PROFILE</div>
  <svg viewBox="0 0 400 148" role="img">
    <title>API usage curve</title>
    <g class="curve__grid">
      <path d="M24 20V124H382" />
      <path d="M24 98H382M24 72H382M24 46H382" />
      <path d="M96 20V124M168 20V124M240 20V124M312 20V124" />
    </g>
    <path class="curve__wave curve__wave--ghost" d="M24 120C76 117 101 105 144 96S211 81 252 70S330 54 382 32" />
    <path class="curve__wave" d="M24 120C76 117 101 105 144 96S211 81 252 70S330 54 382 32" />
    <path class="curve__cursor" d={`M${x} 20V124`} />
    <circle class="curve__point" cx={x} cy={y} r="6" />
  </svg>
</div>
