<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type {
  ComponentDoc,
  PlaygroundConfig,
  PropValue,
} from '../../types/content';
import { site, stageSlotFor } from '../../utils/content';
import { buildSnippet } from '../../utils/snippet';
import {
  clearConfig,
  initialConfig,
  loadConfig,
  saveConfig,
} from '../../utils/playgroundState';
import { uiRegistry } from '../ui';
import PropControls from './PropControls.vue';
import SnippetPanel from './SnippetPanel.vue';

const props = defineProps<{ doc: ComponentDoc }>();

const config = ref<PlaygroundConfig>(loadConfig(props.doc));

// Reset assigns a fresh config but must not be re-saved by the watcher —
// resetting forgets the copy stored on this device.
let skipNextSave = false;

watch(
  config,
  (value) => {
    if (skipNextSave) {
      skipNextSave = false;
      return;
    }
    saveConfig(props.doc, value);
  },
  { deep: true },
);

const specimen = computed(() => uiRegistry[props.doc.id]);
const slotContent = computed(() => stageSlotFor(props.doc));
const snippet = computed(() => buildSnippet(props.doc, config.value));

const setProp = (name: string, value: PropValue) => {
  config.value = { ...config.value, [name]: value };
};

const reset = () => {
  skipNextSave = true;
  config.value = initialConfig(props.doc);
  clearConfig(props.doc);
};
</script>

<template>
  <section class="playground" :aria-label="site.playground.ariaLabel">
    <div class="stage">
      <span class="stage__chip">{{ site.playground.previewLabel }}</span>
      <div class="stage__specimen" :data-component="doc.id">
        <component :is="specimen" v-if="specimen" v-bind="config">
          <template v-if="slotContent !== undefined" #default>
            {{ slotContent }}
          </template>
        </component>
        <p v-else class="stage__missing">
          {{ site.playground.unregisteredNote }}
        </p>
      </div>
    </div>
    <PropControls :doc="doc" :config="config" @set="setProp" @reset="reset" />
    <SnippetPanel :snippet="snippet" />
  </section>
</template>
