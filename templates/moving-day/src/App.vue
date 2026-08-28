<script setup lang="ts">
import { onMounted } from 'vue';
import EstimateSummary from './components/EstimateSummary.vue';
import FaqSection from './components/FaqSection.vue';
import HeroSection from './components/HeroSection.vue';
import RoomSelector from './components/RoomSelector.vue';
import SiteHeader from './components/SiteHeader.vue';
import { useMoveEstimate } from './composables/useMoveEstimate';
import site from './data/site.json';
import movingImage from './assets/images/moving-boxes.jpg';

const estimate = useMoveEstimate();

onMounted(() => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: site.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  });
  document.head.appendChild(script);
});
</script>

<template>
  <SiteHeader />
  <main>
    <HeroSection />

    <section
      id="estimate"
      class="estimator section-pad"
    >
      <div class="section-kicker">
        Your no-fuss estimate
      </div>
      <div class="estimator-intro">
        <h2>What are we<br><em>moving for you?</em></h2>
        <p>Select each room type and use the counter if you have more than one. We’ll suggest the right van and a helpful guide price.</p>
      </div>
      <div class="estimator-layout">
        <RoomSelector
          :rooms="estimate.rooms"
          :counts="estimate.counts.value"
          @change="estimate.setCount"
        />
        <EstimateSummary
          :selected-rooms="estimate.selectedRooms.value"
          :counts="estimate.counts.value"
          :total-rooms="estimate.totalRooms.value"
          :total-volume="estimate.totalVolume.value"
          :van="estimate.van.value"
          :estimate="estimate.estimate.value"
          :disclaimer="estimate.disclaimer"
          @reset="estimate.reset"
        />
      </div>
    </section>

    <section
      id="how-it-works"
      class="story"
    >
      <div class="story-image">
        <img
          :src="movingImage"
          alt="Mover checking carefully packed boxes before loading"
        >
        <div class="image-stamp">
          No drama.<br>No mystery fees.
        </div>
      </div>
      <div class="story-copy">
        <div class="section-kicker light">
          How moving day works
        </div>
        <h2>From packed up<br>to <em>settled in.</em></h2>
        <ol>
          <li
            v-for="step in site.steps"
            :key="step.number"
          >
            <span>{{ step.number }}</span>
            <div><h3>{{ step.title }}</h3><p>{{ step.text }}</p></div>
          </li>
        </ol>
      </div>
    </section>

    <section class="proof section-pad">
      <p class="eyebrow">
        <span />Small team, big care
      </p>
      <blockquote>“Everything arrived exactly as it left — and we were drinking tea in our new kitchen by four.”</blockquote>
      <p class="quote-author">
        Maya &amp; Tom · Bristol to Frome
      </p>
      <div class="stats">
        <div
          v-for="stat in site.stats"
          :key="stat.label"
        >
          <strong>{{ stat.value }}</strong><span>{{ stat.label }}</span>
        </div>
      </div>
    </section>

    <FaqSection :faqs="site.faqs" />
  </main>

  <footer>
    <div>
      <a
        class="brand footer-brand"
        href="#"
      ><span
        class="brand-mark"
        aria-hidden="true"
      ><i /><i /><i /></span><span>{{ site.name }}</span></a>
      <h2>Ready when<br><em>you are.</em></h2>
    </div>
    <div class="footer-contact">
      <p>{{ site.serviceArea }}<br>{{ site.hours }}</p>
      <a :href="site.phoneHref">{{ site.phoneDisplay }}</a>
      <a :href="`mailto:${site.email}`">{{ site.email }}</a>
    </div>
    <p class="footer-fine">
      © 2026 {{ site.legalName }} {{ site.footerNotice }}
    </p>
  </footer>
</template>
