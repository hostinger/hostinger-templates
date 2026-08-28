<script setup lang="ts">
import roomsData from '~/data/rooms.json'
import ratesData from '~/data/rates.json'
import { faqs } from '~/data/faqs'
import { fieldNotes, site } from '~/data/site'
import type { Room, SeasonalRate } from '~/types'
import coastHero from '~/assets/images/coast-hero.jpg'
import coastPath from '~/assets/images/coast-path.jpg'

const rooms = roomsData as Room[]
const rates = ratesData as SeasonalRate[]

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }),
    },
  ],
})
</script>

<template>
  <div>
    <section class="hero">
      <img :src="coastHero" alt="Rugged Cornish coast meeting a slate-blue sea">
      <div class="hero__wash" />
      <div class="hero__copy">
        <p class="eyebrow">{{ site.location }} · 50.087° N</p>
        <h1>A place to<br><em>come ashore.</em></h1>
        <p>{{ site.strapline }}</p>
      </div>
      <div class="hero__weather">
        <span>FIELD NOTE 08</span>
        <span>WESTERLY · SALT AIR</span>
      </div>
    </section>

    <DatePlanner />

    <section class="intro section-shell">
      <div>
        <p class="eyebrow">The house</p>
        <h2>Not a hotel.<br>A house with three good rooms.</h2>
      </div>
      <div class="intro__text">
        <p>Above the old harbour road, The Rooms is a small guesthouse for people who want the coast without a programme.</p>
        <p>Breakfast comes with every key. The sea is five minutes downhill. Boots dry by the back door.</p>
      </div>
    </section>

    <TideRule />

    <section id="rooms" class="rooms-section section-shell">
      <header class="section-heading">
        <p class="eyebrow">Choose a key</p>
        <h2>Three ways to stay</h2>
        <p>Same breakfast, same harbour. Different light, outlook and floorboards.</p>
      </header>
      <div class="room-list">
        <RoomCard
          v-for="(room, index) in rooms"
          :key="room.slug"
          :room="room"
          :index="index"
        />
      </div>
    </section>

    <section id="rates" class="rates-section">
      <div class="section-shell">
        <header class="section-heading section-heading--light">
          <p class="eyebrow">The useful bit</p>
          <h2>Compare rooms & rates</h2>
          <p>Nightly room rates in GBP, including breakfast. No hidden resort or cleaning fees.</p>
        </header>
        <RoomComparison :rooms="rooms" :rates="rates" />
        <p class="rates-note">Rates shown are a guide, not live availability. Minimum stays may apply on summer weekends.</p>
      </div>
    </section>

    <section class="field-guide section-shell">
      <header class="section-heading">
        <p class="eyebrow">Out of the door</p>
        <h2>A small field guide</h2>
      </header>
      <div class="field-guide__grid">
        <article v-for="note in fieldNotes" :key="note.title">
          <span>{{ note.marker }}</span>
          <h3>{{ note.title }}</h3>
          <p>{{ note.text }}</p>
        </article>
      </div>
      <figure class="coast-figure">
        <img :src="coastPath" alt="Sun setting over rippled coastal water">
        <figcaption>Take the path west. Turn back when the weather says.</figcaption>
      </figure>
    </section>

    <section class="faq-section section-shell">
      <header class="section-heading">
        <p class="eyebrow">Before you set out</p>
        <h2>House notes</h2>
      </header>
      <FaqList :faqs="faqs" />
    </section>
  </div>
</template>
