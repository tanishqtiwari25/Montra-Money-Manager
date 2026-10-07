export function payoffMonths(principalPaise: number, annualRate: number, paymentPaise: number): number | null {
  if (principalPaise <= 0) return 0;
  if (paymentPaise <= 0) return null;
  const monthlyRate = annualRate / 1200;
  if (monthlyRate === 0) return Math.ceil(principalPaise / paymentPaise);
  if (paymentPaise <= principalPaise * monthlyRate) return null;
  const months = Math.ceil(-Math.log(1 - principalPaise * monthlyRate / paymentPaise) / Math.log(1 + monthlyRate));
  return Number.isFinite(months) && months <= 600 ? months : null;
}
