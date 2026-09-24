import { useEffect } from 'react';
import { site } from '../constants/content';

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    const suffix = `${site.brand} — Padel court finder for ${site.city}`;
    document.title = title ? `${title} · ${suffix}` : suffix;
  }, [title]);
}
