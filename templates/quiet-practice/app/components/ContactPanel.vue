<script setup lang="ts">
import { site } from '~/data/content'

const action = bookingAction(site)
</script>

<template>
  <section
    id="contact"
    class="contact"
    aria-labelledby="contact-title"
  >
    <div class="container contact__inner">
      <div class="contact__copy">
        <p class="eyebrow contact__eyebrow">{{ site.contact.eyebrow }}</p>
        <h2 id="contact-title">{{ site.contact.title }}</h2>
        <p class="contact__body">{{ site.contact.body }}</p>
        <div class="contact__actions">
          <a
            :href="action.href"
            class="btn btn--light"
            :target="action.external ? '_blank' : undefined"
            :rel="action.external ? 'noopener' : undefined"
          >
            {{ action.label }}
          </a>
          <a
            :href="mailtoHref(site.email, site.contact.emailSubject)"
            class="btn btn--ghost"
          >
            {{ site.contact.emailLabel }}
          </a>
        </div>
        <p class="contact__note">{{ site.responseNote }}</p>
      </div>
      <dl class="contact__details">
        <div>
          <dt>Phone</dt>
          <dd><a :href="telHref(site.phoneCountryCode, site.phoneDisplay)">{{ site.phoneDisplay }}</a></dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd><a :href="mailtoHref(site.email)">{{ site.email }}</a></dd>
        </div>
        <div>
          <dt>Where</dt>
          <dd>{{ site.addressLine }}<br>{{ site.formatLine }}</dd>
        </div>
        <div>
          <dt>Hours</dt>
          <dd>{{ site.hours }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>
