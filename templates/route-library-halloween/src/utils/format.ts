const KM_FORMAT = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const METRES_FORMAT = new Intl.NumberFormat('en-GB');

/** `6.8` → `"6.8 km"` */
export function formatKm(km: number): string {
  return `${KM_FORMAT.format(km)} km`;
}

/** `959` → `"959 m"`, `1250` → `"1,250 m"` */
export function formatMetres(metres: number): string {
  return `${METRES_FORMAT.format(metres)} m`;
}
