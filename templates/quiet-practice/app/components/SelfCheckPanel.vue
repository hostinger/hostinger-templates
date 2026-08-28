<script setup lang="ts">
import { selfCheck, services, site } from '~/data/content'

const questions = selfCheck.questions

const step = ref(0)
const answers = ref<number[]>([])
const routing = ref(false)
const promptEl = ref<HTMLParagraphElement | null>(null)

const current = computed(() => questions[step.value])

async function choose(optionIndex: number) {
  if (routing.value) {
    return
  }
  answers.value[step.value] = optionIndex
  if (step.value < questions.length - 1) {
    step.value += 1
    return
  }
  routing.value = true
  const slug = resolveServiceSlug(
    questions,
    answers.value,
    services.map(service => service.slug),
  )
  await navigateTo(`/services/${slug}`)
}

function back() {
  if (step.value > 0 && !routing.value) {
    step.value -= 1
  }
}

function focusPrompt() {
  promptEl.value?.focus()
}
</script>

<template>
  <section
    id="self-check"
    class="self-check"
    aria-labelledby="self-check-title"
  >
    <div class="container self-check__inner">
      <div class="self-check__intro">
        <p class="eyebrow">{{ selfCheck.eyebrow }}</p>
        <h2 id="self-check-title">{{ selfCheck.title }}</h2>
        <p class="section-lead">{{ selfCheck.lead }}</p>
      </div>

      <div class="check-card">
        <div class="check-card__meta">
          <p class="check-card__count" aria-live="polite">
            Question {{ step + 1 }} of {{ questions.length }}
          </p>
          <ol class="check-dots" aria-hidden="true">
            <li
              v-for="(question, index) in questions"
              :key="question.id"
              class="check-dots__dot"
              :class="{
                'is-done': index < step,
                'is-current': index === step,
              }"
            />
          </ol>
        </div>

        <Transition name="soft" mode="out-in" @after-enter="focusPrompt">
          <div :key="current?.id ?? step" class="check-card__question">
            <p ref="promptEl" class="check-card__prompt" tabindex="-1">
              {{ current?.prompt }}
            </p>
            <div class="check-card__options">
              <button
                v-for="(option, index) in current?.options ?? []"
                :key="option.label"
                type="button"
                class="check-option"
                :class="{ 'is-chosen': answers[step] === index }"
                @click="choose(index)"
              >
                <span class="check-option__marker" aria-hidden="true" />
                <span class="check-option__label">{{ option.label }}</span>
              </button>
            </div>
          </div>
        </Transition>

        <div class="check-card__footer">
          <button
            v-if="step > 0"
            type="button"
            class="check-back"
            @click="back"
          >
            <span aria-hidden="true">←</span> {{ selfCheck.backLabel }}
          </button>
          <p v-else class="check-card__hint">{{ selfCheck.hint }}</p>
          <p v-if="routing" class="check-card__routing" role="status">
            {{ selfCheck.routingLabel }}
          </p>
        </div>

        <!-- Browsers expose noscript children as raw text when JS is on,
             so hydration is told to skip comparing this subtree. -->
        <noscript data-allow-mismatch>
          <p class="check-card__noscript">{{ selfCheck.noscript }}</p>
        </noscript>
      </div>

      <p class="check-disclaimer">
        {{ selfCheck.disclaimer }}
        <a :href="mailtoHref(site.email, site.contact.emailSubject)">{{ selfCheck.fallbackLabel }}</a>.
      </p>
    </div>
  </section>
</template>
