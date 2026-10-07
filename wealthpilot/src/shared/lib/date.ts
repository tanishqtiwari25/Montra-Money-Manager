import { TIME_ZONE } from '@shared/config';
function parseDate(value: string): Date { return new Date(value.length === 10 ? value + 'T12:00:00+05:30' : value); }
export function formatDate(value: string, options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }): string {
  const date = parseDate(value);
  return Number.isFinite(date.getTime()) ? new Intl.DateTimeFormat('en-IN', { ...options, timeZone: TIME_ZONE }).format(date) : '—';
}
export function monthLabel(month: string): string { return formatDate(month + '-01', { month: 'short' }); }
export function addMonths(date: string, months: number): string {
  const parsed = parseDate(date);
  const day = parsed.getUTCDate();
  parsed.setUTCDate(1);
  parsed.setUTCMonth(parsed.getUTCMonth() + Math.ceil(months));
  const maxDay = new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth() + 1, 0)).getUTCDate();
  parsed.setUTCDate(Math.min(day, maxDay));
  return parsed.toISOString().slice(0, 10);
}
