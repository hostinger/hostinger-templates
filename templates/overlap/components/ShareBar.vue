<script setup lang="ts">
import { SHARE } from '~/constants/copy'

const status = ref<'idle' | 'copied' | 'failed'>('idle')
let resetTimer: number | undefined

async function copyLink() {
  const url = window.location.href
  try {
    await navigator.clipboard.writeText(url)
    status.value = 'copied'
  }
  catch {
    status.value = 'failed'
  }
  window.clearTimeout(resetTimer)
  resetTimer = window.setTimeout(() => {
    status.value = 'idle'
  }, 2600)
}

onBeforeUnmount(() => window.clearTimeout(resetTimer))
</script>

<template>
  <div class="share">
    <button
      type="button"
      class="aurora-button"
      @click="copyLink"
    >
      <svg
        viewBox="0 0 20 20"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        stroke-width="1.7"
        class="share-icon"
      >
        <path d="M8 12.5 12.5 8" />
        <path d="M9.5 5.8 11 4.3a3.2 3.2 0 0 1 4.6 4.6l-1.5 1.5" />
        <path d="M10.5 14.2 9 15.7a3.2 3.2 0 0 1-4.6-4.6l1.5-1.5" />
      </svg>
      {{ SHARE.button }}
    </button>
    <p
      class="share-status"
      role="status"
      aria-live="polite"
    >
      <span v-if="status === 'copied'">{{ SHARE.copied }}</span>
      <span v-else-if="status === 'failed'">{{ SHARE.failed }}</span>
      <span
        v-else
        class="share-hint"
      >{{ SHARE.hint }}</span>
    </p>
  </div>
</template>

<style scoped>
.share {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}

.share-icon {
  width: 1rem;
  height: 1rem;
}

.share-status {
  min-height: 1.2em;
  color: var(--color-aurora-mint);
  font-size: 0.8rem;
}

.share-hint {
  color: var(--color-ink-faint);
}
</style>
