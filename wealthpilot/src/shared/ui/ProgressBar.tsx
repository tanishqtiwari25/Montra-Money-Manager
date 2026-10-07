export function ProgressBar({ value, label, tone = 'brand' }: { value: number; label: string; tone?: 'brand' | 'positive' | 'negative' | 'warning' }) {
  const safe = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
  const colors = { brand: 'bg-indigo-600', positive: 'bg-emerald-600', negative: 'bg-rose-600', warning: 'bg-amber-600' };
  return <div role="progressbar" aria-label={label} aria-valuenow={Math.round(safe)} aria-valuemin={0} aria-valuemax={100} className="h-2.5 overflow-hidden rounded-full bg-canvas"><div className={'h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none ' + colors[tone]} style={{ width: safe + '%' }} /></div>;
}
