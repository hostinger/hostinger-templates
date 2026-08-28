const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** 1771632 -> "1,771,632" (locale-independent, deterministic). */
export function formatInt(value: number): string {
  const sign = value < 0 ? "−" : "";
  const digits = Math.round(Math.abs(value)).toString();
  return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** 1771632 -> "1.77M", 141904 -> "141.9K", 984 -> "984". */
export function formatCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return trimZeros((value / 1_000_000).toFixed(2)) + "M";
  if (abs >= 1_000) return trimZeros((value / 1_000).toFixed(1)) + "K";
  return formatInt(value);
}

function trimZeros(text: string): string {
  return text.replace(/\.0+$|(\.\d*[1-9])0+$/, "$1");
}

export function formatPercent(value: number, decimals = 2): string {
  return value.toFixed(decimals) + "%";
}

/** Signed delta with a true minus sign: 4.45 -> "+4.5%", -0.041 -> "−0.04 pp". */
export function formatSigned(value: number, decimals: number, suffix: string): string {
  const sign = value < 0 ? "−" : "+";
  return sign + Math.abs(value).toFixed(decimals) + suffix;
}

/** "2026-08-14" or ISO datetime -> "Aug 14" (parsed textually; timezone-proof). */
export function formatDateShort(iso: string): string {
  const [, month, day] = iso.slice(0, 10).split("-");
  return `${MONTHS[Number(month) - 1]} ${Number(day)}`;
}

/** "2026-08-28T09:24:41Z" -> "Aug 28, 09:24 UTC" (parsed textually; timezone-proof). */
export function formatDateTime(iso: string): string {
  const [datePart, timePart] = iso.split("T");
  const [, month, day] = datePart.split("-");
  const time = timePart ? timePart.slice(0, 5) : "";
  return `${MONTHS[Number(month) - 1]} ${Number(day)}, ${time} UTC`;
}

/** "2023-11-02" -> "Nov 2, 2023". */
export function formatDateLong(iso: string): string {
  const [year, month, day] = iso.slice(0, 10).split("-");
  return `${MONTHS[Number(month) - 1]} ${Number(day)}, ${year}`;
}
