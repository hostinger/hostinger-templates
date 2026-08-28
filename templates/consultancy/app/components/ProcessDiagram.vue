<script setup lang="ts">
defineProps<{
  steps: Array<{ label: string, text: string }>
}>()
</script>

<template>
  <ol class="process-diagram">
    <li v-for="(step, index) in steps" :key="step.label">
      <span class="step-number">{{ index + 1 }}</span>
      <div>
        <strong>{{ step.label }}</strong>
        <p>{{ step.text }}</p>
      </div>
      <svg v-if="index < steps.length - 1" class="process-arrow" viewBox="0 0 130 52" aria-hidden="true">
        <path d="M4 31C38 11 73 13 119 29" />
        <path d="m107 17 13 12-18 5" />
      </svg>
    </li>
  </ol>
</template>
