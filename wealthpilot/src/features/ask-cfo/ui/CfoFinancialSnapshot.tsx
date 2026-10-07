import { ShieldCheck } from 'lucide-react';
import { Card, ProgressBar } from '@shared/ui';
import { formatMoney } from '@shared/lib';
import type { CfoSnapshot } from '../model/types';
export function CfoFinancialSnapshot({ snapshot }: { snapshot: CfoSnapshot }) {
  const rows = [ ['Monthly salary', snapshot.salaryPaise], ['Liquid savings', snapshot.liquidSavingsPaise], ['Allocated to goals', snapshot.goalAllocationsPaise], ['Active loans', snapshot.activeLoanOutstandingPaise], ['Credit-card debt', snapshot.creditCardDebtPaise], ['Monthly expenses', snapshot.monthlyExpensesPaise], ['Monthly surplus', snapshot.monthlySavingsPaise] ] as const;
  return <Card title="Financial snapshot"><dl className="space-y-4">{rows.map(([label, value]) => <div key={label} className="flex items-center justify-between gap-4 text-sm"><dt className="text-muted">{label}</dt><dd className="font-semibold tabular-nums text-ink">{formatMoney(value)}</dd></div>)}</dl><div className="mt-6 border-t border-line pt-5"><p className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink"><ShieldCheck size={17} aria-hidden="true" />Emergency reserve</p><ProgressBar value={snapshot.emergencyProgressPercent} label="Emergency fund target funded" tone="positive" /><p className="mt-2 text-xs text-muted">{formatMoney(snapshot.emergencyFundPaise)} of {formatMoney(snapshot.emergencyTargetPaise)} target</p></div><p className="mt-5 text-xs leading-relaxed text-muted">Goal savings are part of liquid savings. Your emergency reserve remains separately allocated.</p></Card>;
}
