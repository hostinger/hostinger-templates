<script setup lang="ts">
import { getService, services, site } from '~/data/content'

const route = useRoute()
const service = getService(String(route.params.slug))

if (!service) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Service not found',
    fatal: true,
  })
}

const others = services.filter(other => other.slug !== service.slug)
const action = bookingAction(site)
const copy = site.servicePage

useHead({
  title: `${service.name} — ${site.name}`,
  meta: [{ name: 'description', content: service.summary }],
})
</script>

<template>
  <article class="service-page" :class="`tone-${service.tone}`">
    <div class="container">
      <p class="service-page__back">
        <NuxtLink to="/#services">
          <span aria-hidden="true">←</span> {{ copy.backLabel }}
        </NuxtLink>
      </p>
    </div>

    <header class="service-page__head">
      <div class="container">
        <p class="eyebrow service-page__eyebrow">
          {{ service.session.length }} ·
          {{ formatFee(service.session.feeAmount, service.session.feeCurrency) }} ·
          {{ service.session.format }}
        </p>
        <h1 class="service-page__title">{{ service.name }}</h1>
        <p class="service-page__for">{{ service.forWhen }}</p>
      </div>
    </header>

    <div class="container service-page__grid">
      <div class="service-page__main">
        <p class="service-page__summary">{{ service.summary }}</p>

        <h2>{{ copy.fitTitle }}</h2>
        <ul class="signal-list">
          <li v-for="signal in service.signals" :key="signal">
            <span class="signal-list__marker" aria-hidden="true" />
            {{ signal }}
          </li>
        </ul>

        <h2>{{ copy.approachTitle }}</h2>
        <p
          v-for="paragraph in service.approach"
          :key="paragraph"
          class="service-page__para"
        >
          {{ paragraph }}
        </p>

        <h2>{{ copy.firstTitle }}</h2>
        <p class="service-page__para">{{ service.firstSession }}</p>

        <p class="service-page__recheck">
          <NuxtLink to="/#self-check">{{ site.checkNav }}</NuxtLink>
        </p>
      </div>

      <aside class="service-aside" aria-label="Session details and booking">
        <ArtMark class="service-aside__mark" />
        <h2 class="service-aside__title">{{ copy.asideTitle }}</h2>
        <dl class="service-aside__details">
          <div>
            <dt>{{ copy.detailLabels.length }}</dt>
            <dd>{{ service.session.length }}</dd>
          </div>
          <div>
            <dt>{{ copy.detailLabels.fee }}</dt>
            <dd>{{ formatFee(service.session.feeAmount, service.session.feeCurrency) }}</dd>
          </div>
          <div>
            <dt>{{ copy.detailLabels.frequency }}</dt>
            <dd>{{ service.session.frequency }}</dd>
          </div>
          <div>
            <dt>{{ copy.detailLabels.format }}</dt>
            <dd>{{ service.session.format }}</dd>
          </div>
        </dl>
        <div class="service-aside__actions">
          <a
            :href="action.href"
            class="btn"
            :target="action.external ? '_blank' : undefined"
            :rel="action.external ? 'noopener' : undefined"
          >
            {{ action.label }}
          </a>
          <a
            :href="mailtoHref(site.email, `${service.name} — a question`)"
            class="btn btn--quiet"
          >
            {{ copy.emailLabel }}
          </a>
        </div>
        <p class="service-aside__note">{{ site.responseNote }}</p>
      </aside>
    </div>

    <div class="container">
      <nav class="service-others" aria-label="Other services">
        <p class="service-others__label">{{ copy.othersLabel }}</p>
        <div class="service-others__links">
          <NuxtLink
            v-for="other in others"
            :key="other.slug"
            :to="`/services/${other.slug}`"
            class="service-others__card"
            :class="`tone-${other.tone}`"
          >
            <span class="service-others__name">{{ other.name }}</span>
            <span class="service-others__for">{{ other.forWhen }}</span>
          </NuxtLink>
        </div>
      </nav>
    </div>
  </article>
</template>
