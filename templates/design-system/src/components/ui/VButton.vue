<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
);
</script>

<template>
  <button
    type="button"
    class="v-button"
    :class="[`v-button--${variant}`, `v-button--${size}`]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style>
.v-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1.5px solid transparent;
  border-radius: 9px;
  font-family: var(--font-sans);
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 1;
  cursor: pointer;
  transition:
    background 130ms ease,
    border-color 130ms ease,
    color 130ms ease,
    transform 130ms ease;
}

.v-button:active:not(:disabled) {
  transform: translateY(1px);
}

.v-button--sm {
  height: 32px;
  padding: 0 14px;
  font-size: 13.5px;
}

.v-button--md {
  height: 40px;
  padding: 0 18px;
  font-size: 15px;
}

.v-button--lg {
  height: 48px;
  padding: 0 24px;
  font-size: 16.5px;
}

.v-button--primary {
  background: var(--accent);
  border-color: var(--ink);
  color: var(--ink);
}

.v-button--primary:hover:not(:disabled) {
  background: var(--accent-bright);
}

.v-button--secondary {
  background: var(--paper);
  border-color: var(--ink);
  color: var(--ink);
}

.v-button--secondary:hover:not(:disabled) {
  background: var(--panel);
}

.v-button--ghost {
  background: transparent;
  border-color: transparent;
  color: var(--ink);
}

.v-button--ghost:hover:not(:disabled) {
  background: var(--wash);
}

.v-button:disabled {
  background: var(--panel);
  border-color: var(--line);
  color: var(--ink-faint);
  cursor: not-allowed;
}

.v-button--ghost:disabled {
  background: transparent;
  border-color: transparent;
}
</style>
