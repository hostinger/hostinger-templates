<script setup lang="ts">
import { site } from '~/data/site'
import { createBookingLink, isValidIsoDate, todayIso, validateDates } from '~/utils/booking'

const props = withDefaults(
  defineProps<{
    roomName?: string
    compact?: boolean
  }>(),
  {
    roomName: '',
    compact: false,
  },
)

const route = useRoute()
const router = useRouter()
const initialParams = import.meta.client
  ? new URLSearchParams(window.location.search)
  : null
const initialArrival = initialParams?.get('arrival') ?? route.query.arrival
const initialDeparture = initialParams?.get('departure') ?? route.query.departure
const arrival = ref(
  isValidIsoDate(initialArrival) && initialArrival >= todayIso()
    ? initialArrival
    : '',
)
const departure = ref(
  isValidIsoDate(initialDeparture) ? initialDeparture : '',
)
const error = ref('')

const hydrateDates = () => {
  const params = new URLSearchParams(window.location.search)
  const savedArrival = params.get('arrival')
  const savedDeparture = params.get('departure')

  arrival.value =
    isValidIsoDate(savedArrival) && savedArrival >= todayIso()
      ? savedArrival
      : ''
  departure.value = isValidIsoDate(savedDeparture) ? savedDeparture : ''
}

if (import.meta.client) {
  window.setTimeout(hydrateDates, 0)
}

watch([arrival, departure], () => {
  error.value = ''
  const query = { ...route.query }
  if (arrival.value) query.arrival = arrival.value
  else delete query.arrival
  if (departure.value) query.departure = departure.value
  else delete query.departure
  router.replace({ query })
})

const submit = () => {
  const dates = { arrival: arrival.value, departure: departure.value }
  error.value = validateDates(dates)
  if (error.value) return

  window.location.href = createBookingLink(
    site.bookingUrl,
    site.email,
    props.roomName,
    dates,
  )
}
</script>

<template>
  <form
    class="date-planner"
    :class="{ 'date-planner--compact': compact }"
    novalidate
    @submit.prevent="submit"
  >
    <div class="date-planner__intro">
      <p class="eyebrow">Plan your stay</p>
      <p v-if="site.bookingUrl">
        Choose dates to continue to our booking partner. Availability is confirmed there.
      </p>
      <p v-else>
        Choose dates to prepare an email enquiry. We will reply with availability.
      </p>
    </div>
    <label>
      <span>Arrival</span>
      <input v-model="arrival" type="date" :min="todayIso()" aria-describedby="date-error">
    </label>
    <label>
      <span>Departure</span>
      <input v-model="departure" type="date" :min="arrival || todayIso()" aria-describedby="date-error">
    </label>
    <button class="button button--rust" type="submit">
      {{ site.bookingUrl ? 'Check dates' : 'Enquire by email' }}
      <span aria-hidden="true">↗</span>
    </button>
    <p id="date-error" class="date-planner__error" aria-live="polite">
      {{ error }}
    </p>
  </form>
</template>
