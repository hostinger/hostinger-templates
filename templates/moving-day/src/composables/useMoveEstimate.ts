import { computed, ref, watch } from 'vue';
import pricingData from '../data/pricing.json';
import type { Room, RoomCounts, Van } from '../types/content';

const rooms = pricingData.rooms as Room[];
const vans = pricingData.vans as Van[];

function initialCounts(): RoomCounts {
  const params = new URLSearchParams(window.location.search);

  return Object.fromEntries(
    rooms.map((room) => {
      const value = Number.parseInt(params.get(room.id) ?? '0', 10);
      return [room.id, Number.isFinite(value) ? Math.min(Math.max(value, 0), 5) : 0];
    }),
  );
}

export function useMoveEstimate() {
  const counts = ref<RoomCounts>(initialCounts());

  const selectedRooms = computed(() =>
    rooms.filter((room) => counts.value[room.id] > 0),
  );

  const totalRooms = computed(() =>
    Object.values(counts.value).reduce((total, count) => total + count, 0),
  );

  const totalVolume = computed(() =>
    rooms.reduce((total, room) => total + room.volume * counts.value[room.id], 0),
  );

  const van = computed(() =>
    vans.find((option) => totalVolume.value <= option.maxVolume) ?? vans[vans.length - 1],
  );

  const estimate = computed(() => {
    if (totalRooms.value === 0) return 0;
    const raw = pricingData.basePrice + totalVolume.value * pricingData.pricePerCubicMetre;
    const rounded = Math.ceil(raw / pricingData.estimateRounding) * pricingData.estimateRounding;
    return Math.max(rounded, pricingData.minimumEstimate);
  });

  const setCount = (id: string, value: number) => {
    counts.value[id] = Math.min(Math.max(value, 0), 5);
  };

  const reset = () => {
    counts.value = Object.fromEntries(rooms.map((room) => [room.id, 0]));
  };

  watch(
    counts,
    (next) => {
      const url = new URL(window.location.href);
      rooms.forEach((room) => {
        const count = next[room.id];
        if (count > 0) url.searchParams.set(room.id, String(count));
        else url.searchParams.delete(room.id);
      });
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
    },
    { deep: true },
  );

  return {
    rooms,
    counts,
    selectedRooms,
    totalRooms,
    totalVolume,
    van,
    estimate,
    setCount,
    reset,
    disclaimer: pricingData.disclaimer,
  };
}
