import { computed, ref, watch } from 'vue';
import type { Gift } from '../types';

const STORAGE_KEY = 'registry-device-claims-v1';

function readStoredClaims(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    // Private browsing or blocked storage: fall back to in-memory claims.
    return [];
  }
}

function writeStoredClaims(ids: string[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage unavailable: claims still work for this page view.
  }
}

export function useClaims(gifts: Gift[]) {
  const deviceClaims = ref<string[]>(readStoredClaims());

  watch(deviceClaims, (ids) => writeStoredClaims(ids), { deep: true });

  const isSeedClaimed = (gift: Gift): boolean => gift.seedClaimed === true;

  const isDeviceClaimed = (gift: Gift): boolean => deviceClaims.value.includes(gift.id);

  const isClaimed = (gift: Gift): boolean => isSeedClaimed(gift) || isDeviceClaimed(gift);

  const claim = (gift: Gift): void => {
    if (isClaimed(gift)) return;
    deviceClaims.value = [...deviceClaims.value, gift.id];
  };

  const release = (gift: Gift): void => {
    if (!isDeviceClaimed(gift)) return;
    deviceClaims.value = deviceClaims.value.filter((id) => id !== gift.id);
  };

  const availableCount = computed(() => gifts.filter((gift) => !isClaimed(gift)).length);

  return {
    availableCount,
    claim,
    isClaimed,
    isDeviceClaimed,
    isSeedClaimed,
    release,
  };
}
