import type { Guest } from '../types';

/**
 * The guest list. Add, remove, or rename entries freely — ids only need to be
 * unique. The order here is the order shown in the unassigned list.
 *
 * Note: share links encode guests by their position in this array, so links
 * created before a reorder may seat different names.
 */
export const GUESTS: Guest[] = [
  { id: 'ana', name: 'Ana Petrova' },
  { id: 'ben', name: 'Ben Okafor' },
  { id: 'chloe', name: 'Chloé Fontaine' },
  { id: 'daniel', name: 'Daniel Reyes' },
  { id: 'elif', name: 'Elif Kaya' },
  { id: 'franco', name: 'Franco Marini' },
  { id: 'greta', name: 'Greta Lindqvist' },
  { id: 'hugo', name: 'Hugo Baptiste' },
  { id: 'imani', name: 'Imani Walker' },
  { id: 'jonas', name: 'Jonas Keller' },
  { id: 'lena', name: 'Lena Horváth' },
  { id: 'marco', name: 'Marco Silva' },
];
