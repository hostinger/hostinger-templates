<script setup lang="ts">
import { RouterLink } from 'vue-router';
import ComponentIndexCard from '../components/ComponentIndexCard.vue';
import FaqSection from '../components/FaqSection.vue';
import { uiRegistry } from '../components/ui';
import { components, site, stageSlotFor } from '../utils/content';
import { initialConfig } from '../utils/playgroundState';

document.title = `${site.systemName} · ${site.tagline}`;
</script>

<template>
  <section class="hero">
    <div class="container hero__inner">
      <div class="hero__copy">
        <p class="kicker kicker--chip">{{ site.hero.kicker }}</p>
        <h1 class="hero__headline">
          {{ site.hero.headline }}
          <mark class="hero__mark">{{ site.hero.headlineMark }}</mark>
        </h1>
        <p class="hero__intro">{{ site.hero.intro }}</p>
        <div class="hero__actions">
          <RouterLink class="cta cta--primary" to="/components/button">
            {{ site.hero.primaryCta }}
          </RouterLink>
          <RouterLink
            class="cta cta--ghost"
            :to="{ path: '/', hash: '#components' }"
          >
            {{ site.hero.secondaryCta }}
          </RouterLink>
        </div>
      </div>
      <figure class="hero-stage">
        <span class="stage__chip">{{ site.hero.stageLabel }}</span>
        <div class="hero-stage__canvas" inert>
          <div
            v-for="doc in components"
            :key="doc.id"
            class="hero-stage__slot"
            :data-component="doc.id"
          >
            <span class="hero-stage__tag">{{ doc.tag }}</span>
            <component
              :is="uiRegistry[doc.id]"
              v-if="uiRegistry[doc.id]"
              v-bind="initialConfig(doc)"
            >
              <template v-if="stageSlotFor(doc) !== undefined" #default>
                {{ stageSlotFor(doc) }}
              </template>
            </component>
          </div>
        </div>
        <figcaption class="hero-stage__caption">
          {{ site.hero.stageCaption }}
        </figcaption>
      </figure>
    </div>
  </section>

  <section class="principles" aria-labelledby="principles-heading">
    <div class="container">
      <header class="section-head">
        <p class="kicker">{{ site.principles.kicker }}</p>
        <h2 id="principles-heading">{{ site.principles.heading }}</h2>
      </header>
      <ol class="principles__list">
        <li
          v-for="(item, index) in site.principles.items"
          :key="item.title"
          class="principles__item"
        >
          <span class="principles__num" aria-hidden="true">
            {{ String(index + 1).padStart(2, '0') }}
          </span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.body }}</p>
        </li>
      </ol>
    </div>
  </section>

  <section
    id="components"
    class="component-index"
    aria-labelledby="components-heading"
  >
    <div class="container">
      <header class="section-head">
        <p class="kicker">{{ site.componentIndex.kicker }}</p>
        <h2 id="components-heading">{{ site.componentIndex.heading }}</h2>
        <p class="section-head__intro">{{ site.componentIndex.intro }}</p>
      </header>
      <div class="component-index__grid">
        <ComponentIndexCard v-for="doc in components" :key="doc.id" :doc="doc" />
      </div>
    </div>
  </section>

  <FaqSection />
</template>
