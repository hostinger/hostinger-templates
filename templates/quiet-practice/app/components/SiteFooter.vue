<script setup lang="ts">
import { services, site } from '~/data/content'
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <div class="site-footer__grid">
        <div class="site-footer__practice">
          <p class="site-footer__name">
            <ArtMark class="site-footer__mark" />
            {{ site.name }}
          </p>
          <p>{{ site.therapist.name }}, {{ site.therapist.credentials }}</p>
          <p>{{ site.therapist.licence }}</p>
          <p>{{ site.addressLine }}</p>
        </div>
        <nav class="site-footer__col" aria-label="Services">
          <p class="site-footer__label">Services</p>
          <NuxtLink
            v-for="service in services"
            :key="service.slug"
            :to="`/services/${service.slug}`"
          >
            {{ service.name }}
          </NuxtLink>
        </nav>
        <nav class="site-footer__col" aria-label="Site">
          <p class="site-footer__label">Around the site</p>
          <NuxtLink
            v-for="link in site.navigation"
            :key="link.href"
            :to="link.href"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
        <div class="site-footer__col">
          <p class="site-footer__label">Reach out</p>
          <a :href="telHref(site.phoneCountryCode, site.phoneDisplay)">{{ site.phoneDisplay }}</a>
          <a :href="mailtoHref(site.email)">{{ site.email }}</a>
          <p>{{ site.hours }}</p>
        </div>
      </div>
      <div class="site-footer__notes">
        <p>{{ site.disclaimer }}</p>
        <p>{{ site.crisisNote }}</p>
        <p class="site-footer__fine">{{ site.footerNote }}</p>
      </div>
    </div>
  </footer>
</template>
