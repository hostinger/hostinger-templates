<script setup lang="ts">
import type { PropMeta } from '../../types/content';
import { site } from '../../utils/content';

defineProps<{ propsMeta: PropMeta[] }>();

const formatDefault = (prop: PropMeta): string => {
  if (prop.required) {
    return site.playground.requiredLabel;
  }
  if (typeof prop.default === 'boolean') {
    return String(prop.default);
  }
  return `'${prop.default ?? ''}'`;
};
</script>

<template>
  <div class="props-table-wrap">
    <table class="props-table">
      <thead>
        <tr>
          <th scope="col">{{ site.playground.table.prop }}</th>
          <th scope="col">{{ site.playground.table.type }}</th>
          <th scope="col">{{ site.playground.table.default }}</th>
          <th scope="col">{{ site.playground.table.description }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="prop in propsMeta" :key="prop.name">
          <th scope="row"><code class="props-table__name">{{ prop.name }}</code></th>
          <td><code>{{ prop.type }}</code></td>
          <td>
            <code :class="{ 'props-table__required': prop.required }">{{
              formatDefault(prop)
            }}</code>
          </td>
          <td class="props-table__desc">{{ prop.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
