<script setup lang="ts">
import { useId } from 'vue';

const props = withDefaults(
  defineProps<{
    label: string;
    state?: 'default' | 'error' | 'success';
    hint?: string;
  }>(),
  {
    state: 'default',
    hint: '',
  },
);

const fieldId = useId();
const hintId = `${fieldId}-hint`;

const describedBy = (): string | undefined =>
  props.hint === '' ? undefined : hintId;
</script>

<template>
  <div class="v-input" :class="`v-input--${state}`">
    <label class="v-input__label" :for="fieldId">{{ label }}</label>
    <input
      :id="fieldId"
      class="v-input__field"
      type="text"
      :aria-invalid="state === 'error' || undefined"
      :aria-describedby="describedBy()"
    />
    <p v-if="hint !== ''" :id="hintId" class="v-input__hint">{{ hint }}</p>
  </div>
</template>

<style>
.v-input {
  display: flex;
  flex-direction: column;
  gap: 7px;
  width: 100%;
  font-family: var(--font-sans);
  text-align: left;
}

.v-input__label {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: var(--ink);
}

.v-input__field {
  height: 42px;
  padding: 0 13px;
  border: 1.5px solid var(--line-strong);
  border-radius: 9px;
  background: var(--paper);
  color: var(--ink);
  font: inherit;
  font-size: 15px;
  transition:
    border-color 130ms ease,
    box-shadow 130ms ease;
}

.v-input__field:hover {
  border-color: var(--ink-faint);
}

.v-input__field:focus {
  outline: none;
  border-color: var(--ink);
  box-shadow: 0 0 0 3px var(--accent);
}

.v-input__hint {
  margin: 0;
  font-size: 13px;
  line-height: 1.45;
  color: var(--ink-soft);
}

.v-input--error .v-input__field {
  border-color: var(--error);
}

.v-input--error .v-input__field:focus {
  border-color: var(--error);
  box-shadow: 0 0 0 3px var(--error-tint);
}

.v-input--error .v-input__hint {
  color: var(--error);
}

.v-input--error .v-input__hint::before {
  content: '✕ ';
}

.v-input--success .v-input__field {
  border-color: var(--ok);
}

.v-input--success .v-input__hint {
  color: var(--ok);
}

.v-input--success .v-input__hint::before {
  content: '✓ ';
}
</style>
