<script setup lang="ts">
import { services, site } from '~/data/content'
</script>

<template>
  <section
    id="services"
    class="services"
    aria-labelledby="services-title"
  >
    <div class="container">
      <p class="eyebrow">{{ site.servicesSection.eyebrow }}</p>
      <h2 id="services-title">{{ site.servicesSection.title }}</h2>
      <p class="section-lead">{{ site.servicesSection.lead }}</p>

      <ol class="service-list">
        <li
          v-for="(service, index) in services"
          :key="service.slug"
        >
          <NuxtLink
            :to="`/services/${service.slug}`"
            class="service-row"
            :class="`tone-${service.tone}`"
          >
            <span class="service-row__number" aria-hidden="true">0{{ index + 1 }}</span>
            <span class="service-row__body">
              <span class="service-row__name">{{ service.name }}</span>
              <span class="service-row__for">{{ service.forWhen }}</span>
              <span class="service-row__meta">
                {{ service.session.length }} ·
                {{ formatFee(service.session.feeAmount, service.session.feeCurrency) }} ·
                {{ service.session.format }}
              </span>
            </span>
            <span class="service-row__arrow" aria-hidden="true">→</span>
          </NuxtLink>
        </li>
      </ol>
    </div>
  </section>
</template>
