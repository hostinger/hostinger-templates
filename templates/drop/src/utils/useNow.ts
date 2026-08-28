import { useSyncExternalStore } from "react";

function subscribeEverySecond(onTick: () => void): () => void {
  const id = window.setInterval(onTick, 1000);
  return () => window.clearInterval(id);
}

function getNowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

function getServerNowSeconds(): null {
  return null;
}

/**
 * Ticking clock for the countdown, precise to the second. Returns `null`
 * during prerendering and hydration so the static HTML and the first client
 * render match exactly, then updates every second.
 */
export function useNow(): Date | null {
  const seconds = useSyncExternalStore(
    subscribeEverySecond,
    getNowSeconds,
    getServerNowSeconds,
  );

  return seconds === null ? null : new Date(seconds * 1000);
}
