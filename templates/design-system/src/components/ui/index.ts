import type { Component } from 'vue';
import VButton from './VButton.vue';
import VCard from './VCard.vue';
import VInput from './VInput.vue';

/**
 * Maps a component doc's `id` (see src/data/components.ts) to the real
 * component the playground renders. Add new kit components here after
 * documenting them in the data file.
 */
export const uiRegistry: Readonly<Record<string, Component>> = {
  button: VButton,
  input: VInput,
  card: VCard,
};

export { VButton, VCard, VInput };
