import { AREAS_PAGE_COPY, LEAD_POLICY_LABELS } from '../constants/areas';
import type { LeadPolicy } from '../types/content';

export type LeadFilterValue = 'all' | LeadPolicy;

const FILTER_OPTIONS: { value: LeadFilterValue; label: string }[] = [
  { value: 'all', label: AREAS_PAGE_COPY.filterAll },
  { value: 'off-lead', label: LEAD_POLICY_LABELS['off-lead'] },
  { value: 'on-lead', label: LEAD_POLICY_LABELS['on-lead'] },
];

interface LeadFilterProps {
  value: LeadFilterValue;
  onChange: (value: LeadFilterValue) => void;
}

export function LeadFilter({ value, onChange }: LeadFilterProps) {
  return (
    <div className="chip-group" role="group" aria-label={AREAS_PAGE_COPY.filterLabel}>
      {FILTER_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className="chip"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
