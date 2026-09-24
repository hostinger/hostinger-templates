import { useEffect, useState } from 'react';

const ONE_MINUTE = 60_000;

export function useNow() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), ONE_MINUTE);
    return () => window.clearInterval(timer);
  }, []);

  return now;
}
