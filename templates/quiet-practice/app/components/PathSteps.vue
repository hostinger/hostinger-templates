<script setup lang="ts">
import { site } from '~/data/content'
</script>

<template>
  <section class="steps" aria-labelledby="steps-title">
    <div class="container">
      <p class="eyebrow">{{ site.steps.eyebrow }}</p>
      <h2 id="steps-title">{{ site.steps.title }}</h2>
      <ol class="steps__list">
        <li
          v-for="(step, index) in site.steps.items"
          :key="step.title"
          class="steps__item"
        >
          <span class="steps__number" aria-hidden="true">{{ index + 1 }}</span>
          <h3 class="steps__title">{{ step.title }}</h3>
          <p class="steps__body">{{ step.body }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>
