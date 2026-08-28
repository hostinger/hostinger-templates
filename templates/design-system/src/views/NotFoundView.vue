<script setup lang="ts">
import NotFoundPanel from '../components/NotFoundPanel.vue';
import { site } from '../utils/content';

document.title = `${site.notFound.title} · ${site.systemName}`;
</script>

<template>
  <NotFoundPanel :message="site.notFound.unknownPage" />
</template>
