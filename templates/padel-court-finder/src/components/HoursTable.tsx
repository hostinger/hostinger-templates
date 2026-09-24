import type { WeeklyHours } from '../types/content';
import { WEEK_ROWS, dayKeyFor, formatWindow } from '../utils/hours';

type HoursTableProps = {
  hours: WeeklyHours;
  now: Date;
};

export function HoursTable({ hours, now }: HoursTableProps) {
  const today = dayKeyFor(now);

  return (
    <table className="data-table">
      <caption className="visually-hidden">Opening hours</caption>
      <tbody>
        {WEEK_ROWS.map((row) => (
          <tr key={row.key} className={row.key === today ? 'data-table__row--today' : undefined}>
            <th scope="row">
              {row.label}
              {row.key === today && <span className="data-table__tag">Today</span>}
            </th>
            <td>{formatWindow(hours[row.key])}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
