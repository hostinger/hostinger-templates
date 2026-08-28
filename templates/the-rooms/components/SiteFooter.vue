<script setup lang="ts">
defineProps<{
  site: {
    name: string
    location: string
    email: string
    phone: string
    address: string
  }
}>()
</script>

<template>
  <footer id="find-us" class="site-footer">
    <div>
      <p class="eyebrow">Find the house</p>
      <h2>At the harbour,<br>away from the crowd.</h2>
    </div>
    <address>
      <span>{{ site.address }}</span>
      <a :href="`mailto:${site.email}`">{{ site.email }}</a>
      <a :href="`tel:${site.phone.replace(/\s/g, '')}`">{{ site.phone }}</a>
    </address>
    <p class="site-footer__note">
      © {{ new Date().getFullYear() }} {{ site.name }}<br>
      Small by design.
    </p>
  </footer>
</template>
