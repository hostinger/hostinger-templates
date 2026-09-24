import { pluralise } from '../utils/format';

type CourtStripProps = {
  courts: number;
};

export function CourtStrip({ courts }: CourtStripProps) {
  return (
    <span className="court-strip" role="img" aria-label={pluralise(courts, 'court')}>
      {Array.from({ length: courts }, (_, index) => (
        <span key={index} className="court-strip__court" />
      ))}
    </span>
  );
}
