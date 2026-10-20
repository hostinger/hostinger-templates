import { AREAS_PAGE_COPY, LEAD_POLICY_LABELS } from '../constants/areas';
import { ClockIcon, DogsIcon, LeashIcon } from '../icons';
import type { WalkArea } from '../types/content';

interface AreaFactsProps {
  area: WalkArea;
}

export function AreaFacts({ area }: AreaFactsProps) {
  return (
    <ul className="area-facts">
      <li>
        <ClockIcon width={16} height={16} />
        {area.durationMinutes} {AREAS_PAGE_COPY.minutesUnit}
      </li>
      <li>
        <LeashIcon width={16} height={16} />
        {LEAD_POLICY_LABELS[area.leadPolicy]}
      </li>
      <li>
        <DogsIcon width={16} height={16} />
        {AREAS_PAGE_COPY.maxDogsPrefix} {area.maxDogs} {AREAS_PAGE_COPY.maxDogsSuffix}
      </li>
    </ul>
  );
}
