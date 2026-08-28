<script setup lang="ts">
import site from '../data/site.json';
import heroImage from '../assets/images/movers-hero.jpg';
</script>

<template>
  <section class="hero">
    <div class="hero-copy">
      <p class="eyebrow">
        <span />{{ site.serviceArea }}
      </p>
      <h1>A calmer way<br>to <em>move house.</em></h1>
      <p class="hero-intro">
        Friendly local removals with careful hands and clear prices.
        Build your room-by-room estimate in under two minutes.
      </p>
      <a
        class="button button-primary"
        href="#estimate"
      >Build my estimate <span>↓</span></a>
      <div
        class="trust-row"
        aria-label="Service benefits"
      >
        <span
          v-for="item in site.trustItems"
          :key="item"
        ><b>✓</b>{{ item }}</span>
      </div>
    </div>
    <div class="hero-visual">
      <img
        :src="heroImage"
        alt="Two professional movers carrying boxes through a bright home"
      >
      <div class="hero-note">
        <span
          class="note-icon"
          aria-hidden="true"
        >✦</span>
        <span><strong>Room to breathe.</strong> We handle the heavy bits.</span>
      </div>
      <span
        class="route-line"
        aria-hidden="true"
      />
      <span
        class="route-dot dot-one"
        aria-hidden="true"
      />
      <span
        class="route-dot dot-two"
        aria-hidden="true"
      />
    </div>
  </section>
</template>
