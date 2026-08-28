<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { site } from '../../utils/content';

const props = defineProps<{ snippet: string }>();

type CopyState = 'idle' | 'copied' | 'failed';

const copyState = ref<CopyState>('idle');
let resetTimer: number | undefined;

const copy = async () => {
  try {
    await navigator.clipboard.writeText(props.snippet);
    copyState.value = 'copied';
  } catch {
    copyState.value = 'failed';
  }
  window.clearTimeout(resetTimer);
  resetTimer = window.setTimeout(() => {
    copyState.value = 'idle';
  }, 2000);
};

onBeforeUnmount(() => window.clearTimeout(resetTimer));

const copyLabel = computed(() => {
  if (copyState.value === 'copied') {
    return site.playground.copiedLabel;
  }
  if (copyState.value === 'failed') {
    return site.playground.copyFailedLabel;
  }
  return site.playground.copyLabel;
});
</script>

<template>
  <div class="snippet">
    <div class="snippet__bar">
      <span class="snippet__lang">{{ site.playground.snippetLabel }}</span>
      <button
        type="button"
        class="snippet__copy"
        :class="{ 'snippet__copy--done': copyState === 'copied' }"
        @click="copy"
      >
        {{ copyLabel }}
      </button>
    </div>
    <pre class="snippet__pre"><code class="snippet__code">{{ snippet }}</code></pre>
    <p class="visually-hidden" role="status">
      {{ copyState === 'copied' ? site.playground.copiedAnnouncement : '' }}
    </p>
  </div>
</template>
