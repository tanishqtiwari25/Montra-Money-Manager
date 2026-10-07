const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const decimals = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
export function formatMoney(paise: number, options: { compact?: boolean; decimals?: boolean } = {}): string {
  if (!Number.isFinite(paise)) return '—';
  const rupees = paise / 100;
  if (options.compact) {
    const absolute = Math.abs(rupees);
    const scale = absolute >= 10000000 ? 10000000 : absolute >= 100000 ? 100000 : 1;
    if (scale > 1) return (rupees < 0 ? '−' : '') + '₹' + Number((absolute / scale).toFixed(1)) + (scale === 10000000 ? ' Cr' : ' Lakh');
  }
  return (options.decimals ? decimals : inr).format(rupees);
}
export function rupeesToPaise(rupees: number): number { return Math.round(rupees * 100); }
