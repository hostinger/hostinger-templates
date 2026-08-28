<script setup lang="ts">
import { CITY_BY_SLUG } from '~/constants/cities'
import { SITE } from '~/constants/copy'
import type { City } from '~/types'

const { selectedSlugs, workingHours, ready, addCity, removeCity, setWorkingHours }
  = useUrlCities()

const selectedCities = computed<City[]>(() =>
  selectedSlugs.value
    .map((slug) => CITY_BY_SLUG[slug])
    .filter((city): city is City => Boolean(city)),
)

const { rows, overlapColumns, overlapRanges, closestHint, viewerNowHour, dayLabel }
  = useOverlap(selectedCities, workingHours)

const loading = computed(() => !ready.value || dayLabel.value === '')
</script>

<template>
  <div class="page">
    <header class="hero">
      <p class="hero-brand">
        <span
          class="hero-mark"
          aria-hidden="true"
        />
        {{ SITE.name }}
      </p>
      <h1 class="hero-title">
        {{ SITE.tagline }}
      </h1>
      <p class="hero-intro">
        {{ SITE.intro }}
      </p>
    </header>

    <main class="main">
      <section
        class="controls"
        aria-label="Board controls"
      >
        <CityPicker
          class="controls-picker"
          :selected-slugs="selectedSlugs"
          @add="addCity"
        />
        <WorkingHoursControl
          :working-hours="workingHours"
          @change="setWorkingHours"
        />
        <ShareBar class="controls-share" />
      </section>

      <OverlapBoard
        :loading="loading"
        :rows="rows"
        :overlap-columns="overlapColumns"
        :overlap-ranges="overlapRanges"
        :closest-hint="closestHint"
        :viewer-now-hour="viewerNowHour"
        :day-label="dayLabel"
        @remove="removeCity"
      />

      <OverlapLegend class="legend-row" />

      <HowTo />
    </main>

    <footer class="footer">
      <p>{{ SITE.footer }}</p>
    </footer>
  </div>
</template>

<style scoped>
.page {
  max-width: var(--page-max);
  margin: 0 auto;
  padding: 2rem clamp(1rem, 4vw, 2.5rem) 2.5rem;
}

.hero {
  margin-bottom: 2rem;
}

.hero-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 1.02rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.hero-mark {
  width: 1.05rem;
  height: 1.05rem;
  border-radius: 50%;
  background: var(--gradient-aurora);
  box-shadow: 0 0 14px rgba(122, 162, 255, 0.55);
}

.hero-title {
  max-width: 21ch;
  margin-top: 0.9rem;
  font-size: clamp(1.7rem, 4.5vw, 2.7rem);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.015em;
  background: linear-gradient(100deg, var(--color-ink) 40%, var(--color-aurora-blue) 75%, var(--color-aurora-violet));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: var(--color-ink);
}

.hero-intro {
  max-width: 58ch;
  margin-top: 0.85rem;
  color: var(--color-ink-dim);
  font-size: 0.98rem;
}

.main {
  display: grid;
  gap: 1.6rem;
  min-width: 0;
}

.controls {
  display: grid;
  grid-template-columns: minmax(220px, 1.4fr) auto auto;
  align-items: end;
  gap: 1rem 1.6rem;
  padding: 1rem 1.2rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-l);
  background: rgba(25, 28, 61, 0.6);
  backdrop-filter: blur(6px);
}

.controls-share {
  justify-self: end;
}

.legend-row {
  padding: 0 0.2rem;
}

.footer {
  margin-top: 2.6rem;
  padding-top: 1.2rem;
  border-top: 1px solid var(--color-border);
  color: var(--color-ink-faint);
  font-size: 0.82rem;
}

@media (max-width: 860px) {
  .controls {
    grid-template-columns: 1fr;
    align-items: stretch;
  }

  .controls-share {
    justify-self: start;
  }
}
</style>
