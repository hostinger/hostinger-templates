import { useEffect, useState, useSyncExternalStore } from 'react';

const motionQuery = '(prefers-reduced-motion: reduce)';

const subscribeToMotionPreference = (callback: () => void) => {
  const query = window.matchMedia(motionQuery);
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
};

const getMotionPreference = () => window.matchMedia(motionQuery).matches;

export const useTypewriter = (text: string, speed = 34) => {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    getMotionPreference,
    () => true,
  );
  const [visibleLength, setVisibleLength] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timer = window.setInterval(() => {
      setVisibleLength((length) => {
        if (length >= text.length) {
          window.clearInterval(timer);
          return length;
        }
        return length + 1;
      });
    }, speed);

    return () => window.clearInterval(timer);
  }, [prefersReducedMotion, speed, text]);

  return {
    text: prefersReducedMotion ? text : text.slice(0, visibleLength),
    complete: prefersReducedMotion || visibleLength >= text.length,
    prefersReducedMotion,
  };
};
