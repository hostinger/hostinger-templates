import { site } from '../constants/content';
import type { Club } from '../types/content';
import { formatPerPlayer, formatPrice } from '../utils/format';

type PriceTableProps = {
  prices: Club['prices'];
};

export function PriceTable({ prices }: PriceTableProps) {
  const rows = [
    { label: 'Off-peak', value: prices.offPeak },
    { label: 'Peak', value: prices.peak },
  ];

  return (
    <>
      <table className="data-table data-table--prices">
        <caption className="visually-hidden">Court prices</caption>
        <thead>
          <tr>
            <td />
            <th scope="col">Court, {site.pricing.sessionLength}</th>
            <th scope="col">Per player</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <td>{formatPrice(row.value)}</td>
              <td className="data-table__accent">{formatPerPlayer(row.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="detail-note">{site.pricing.peakDefinition}</p>
    </>
  );
}
