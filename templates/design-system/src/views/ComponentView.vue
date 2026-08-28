<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import ComponentPlayground from '../components/playground/ComponentPlayground.vue';
import PropsTable from '../components/playground/PropsTable.vue';
import NotFoundPanel from '../components/NotFoundPanel.vue';
import { components, componentsById, site } from '../utils/content';

const route = useRoute();

const doc = computed(() => componentsById.get(String(route.params.id)));

const docIndex = computed(() =>
  doc.value ? components.indexOf(doc.value) : -1,
);
const prevDoc = computed(() =>
  docIndex.value > 0 ? components[docIndex.value - 1] : undefined,
);
const nextDoc = computed(() =>
  docIndex.value >= 0 && docIndex.value < components.length - 1
    ? components[docIndex.value + 1]
    : undefined,
);

watchEffect(() => {
  document.title = doc.value
    ? `${doc.value.name} · ${site.systemName}`
    : `${site.notFound.title} · ${site.systemName}`;
});
</script>

<template>
  <article v-if="doc" class="component-page">
    <div class="container">
      <nav class="crumbs" :aria-label="site.playground.breadcrumbAriaLabel">
        <RouterLink to="/">{{ site.systemName }}</RouterLink>
        <span class="crumbs__sep" aria-hidden="true">/</span>
        <RouterLink :to="{ path: '/', hash: '#components' }">
          {{ site.nav.componentsLabel }}
        </RouterLink>
        <span class="crumbs__sep" aria-hidden="true">/</span>
        <span aria-current="page">{{ doc.name }}</span>
      </nav>

      <header class="component-head">
        <p class="kicker">{{ doc.kicker }}</p>
        <h1 class="component-head__title">
          {{ doc.name }}
          <code class="tag-chip">&lt;{{ doc.tag }}&gt;</code>
        </h1>
        <p class="component-head__intro">{{ doc.intro }}</p>
      </header>

      <ComponentPlayground :key="doc.id" :doc="doc" />

      <section class="props-section" aria-labelledby="props-heading">
        <h2 id="props-heading">{{ site.playground.propTableHeading }}</h2>
        <PropsTable :props-meta="doc.props" />
      </section>

      <section class="guidance" aria-labelledby="guidance-heading">
        <h2 id="guidance-heading">{{ site.playground.guidanceHeading }}</h2>
        <ul class="guidance__list">
          <li v-for="note in doc.guidance" :key="note">{{ note }}</li>
        </ul>
      </section>

      <nav class="pager" :aria-label="site.playground.pagerAriaLabel">
        <RouterLink
          v-if="prevDoc"
          class="pager__link pager__link--prev"
          :to="`/components/${prevDoc.id}`"
        >
          <span class="pager__dir">← {{ site.playground.prevLabel }}</span>
          <span class="pager__name">{{ prevDoc.name }}</span>
        </RouterLink>
        <span v-else class="pager__spacer" aria-hidden="true"></span>
        <RouterLink
          v-if="nextDoc"
          class="pager__link pager__link--next"
          :to="`/components/${nextDoc.id}`"
        >
          <span class="pager__dir">{{ site.playground.nextLabel }} →</span>
          <span class="pager__name">{{ nextDoc.name }}</span>
        </RouterLink>
        <span v-else class="pager__spacer" aria-hidden="true"></span>
      </nav>
    </div>
  </article>
  <NotFoundPanel v-else :message="site.notFound.unknownComponent" />
</template>
