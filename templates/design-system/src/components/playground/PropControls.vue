<script setup lang="ts">
import { useId } from 'vue';
import type {
  ComponentDoc,
  PlaygroundConfig,
  PropMeta,
  PropValue,
} from '../../types/content';
import { site } from '../../utils/content';

const props = defineProps<{ doc: ComponentDoc; config: PlaygroundConfig }>();

const emit = defineEmits<{
  set: [name: string, value: PropValue];
  reset: [];
}>();

const uid = useId();

const controlId = (prop: PropMeta): string => `${uid}-${prop.name}`;

const stringValue = (prop: PropMeta): string =>
  String(props.config[prop.name] ?? prop.initial);

const boolValue = (prop: PropMeta): boolean =>
  props.config[prop.name] === true;

const onSelect = (prop: PropMeta, event: Event) => {
  emit('set', prop.name, (event.target as HTMLSelectElement).value);
};

const onText = (prop: PropMeta, event: Event) => {
  emit('set', prop.name, (event.target as HTMLInputElement).value);
};

const onToggle = (prop: PropMeta, event: Event) => {
  emit('set', prop.name, (event.target as HTMLInputElement).checked);
};
</script>

<template>
  <aside class="controls" :aria-label="site.playground.controlsHeading">
    <div class="controls__head">
      <h2 class="controls__title">{{ site.playground.controlsHeading }}</h2>
      <button type="button" class="controls__reset" @click="emit('reset')">
        {{ site.playground.resetLabel }}
      </button>
    </div>
    <div
      v-for="prop in doc.props"
      :key="prop.name"
      class="control"
      :class="`control--${prop.control}`"
    >
      <div class="control__meta">
        <label class="control__name" :for="controlId(prop)">
          {{ prop.name }}
        </label>
        <code class="control__type">{{ prop.type }}</code>
      </div>
      <select
        v-if="prop.control === 'select'"
        :id="controlId(prop)"
        class="control__select"
        :value="stringValue(prop)"
        @change="onSelect(prop, $event)"
      >
        <option v-for="option in prop.options" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      <input
        v-else-if="prop.control === 'text'"
        :id="controlId(prop)"
        class="control__text"
        type="text"
        maxlength="60"
        :value="stringValue(prop)"
        @input="onText(prop, $event)"
      />
      <span v-else class="control__switch">
        <span class="toggle">
          <input
            :id="controlId(prop)"
            class="toggle__input"
            type="checkbox"
            role="switch"
            :checked="boolValue(prop)"
            @change="onToggle(prop, $event)"
          />
          <span class="toggle__track" aria-hidden="true"></span>
        </span>
        <span class="control__value" aria-hidden="true">
          {{ boolValue(prop) ? 'true' : 'false' }}
        </span>
      </span>
    </div>
    <p class="controls__note">{{ site.playground.persistNote }}</p>
  </aside>
</template>
