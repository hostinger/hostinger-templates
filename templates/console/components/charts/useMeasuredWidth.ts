"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Measures the rendered width of a container so charts draw at exact pixel
 * size on every viewport. The fallback matches the server render, so
 * hydration stays clean.
 */
export function useMeasuredWidth<T extends HTMLElement>(fallback: number) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver((entries) => {
      const measured = entries[0]?.contentRect.width;
      if (measured) setWidth(Math.max(200, Math.round(measured)));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}
