import { useState } from 'react';
import { AreaCard } from '../components/AreaCard';
import { AreaMap } from '../components/AreaMap';
import { LeadFilter, type LeadFilterValue } from '../components/LeadFilter';
import { SectionHeading } from '../components/SectionHeading';
import { AREAS_PAGE_COPY, WALK_AREAS } from '../constants/areas';
import { getPinNumber } from '../lib/areas';

export function AreasPage() {
  const [leadFilter, setLeadFilter] = useState<LeadFilterValue>('all');
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);

  const visibleAreas = WALK_AREAS.filter((area) => leadFilter === 'all' || area.leadPolicy === leadFilter);

  function selectArea(areaId: string) {
    setSelectedAreaId((currentAreaId) => (currentAreaId === areaId ? null : areaId));
  }

  function selectAreaFromMap(areaId: string) {
    selectArea(areaId);
    document.getElementById(`area-${areaId}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function changeFilter(value: LeadFilterValue) {
    setLeadFilter(value);
    setSelectedAreaId(null);
  }

  return (
    <section className="section page-intro areas-page" aria-labelledby="areas-title">
      <div className="container">
        <SectionHeading eyebrow={AREAS_PAGE_COPY.eyebrow} title={AREAS_PAGE_COPY.title} id="areas-title" as="h1">
          <p className="section-heading__body">{AREAS_PAGE_COPY.body}</p>
        </SectionHeading>
        <LeadFilter value={leadFilter} onChange={changeFilter} />
        <div className="areas-page__layout">
          <div className="areas-page__map">
            <AreaMap areas={visibleAreas} selectedAreaId={selectedAreaId} onSelect={selectAreaFromMap} />
          </div>
          <div className="areas-page__list">
            {visibleAreas.length === 0 && <p className="empty-state">{AREAS_PAGE_COPY.emptyState}</p>}
            {visibleAreas.map((area) => (
              <AreaCard
                key={area.id}
                area={area}
                pinNumber={getPinNumber(area.id)}
                isSelected={area.id === selectedAreaId}
                onSelect={selectArea}
                bookLabel={AREAS_PAGE_COPY.bookArea}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
