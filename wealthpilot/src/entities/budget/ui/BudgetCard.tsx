import { Card, Badge, ProgressBar } from '@shared/ui';
import { formatMoney } from '@shared/lib';
import type { Budget } from '../model/types';
export function BudgetCard({ budget, categoryName, spentPaise }: { budget: Budget; categoryName: string; spentPaise: number }) {
  const percent = budget.limitPaise ? spentPaise / budget.limitPaise * 100 : 0;
  const over = spentPaise > budget.limitPaise;
  return <Card><div className="mb-5 flex items-center justify-between gap-2"><h3 className="font-semibold text-ink">{categoryName}</h3><Badge tone={over ? 'negative' : percent >= 80 ? 'warning' : 'positive'}>{over ? 'Over budget' : percent >= 80 ? 'Almost there' : 'On track'}</Badge></div><div className="mb-3 flex justify-between text-sm"><span className="font-semibold text-ink">{formatMoney(spentPaise)}</span><span className="text-muted">of {formatMoney(budget.limitPaise)}</span></div><ProgressBar value={percent} label={categoryName + ' budget usage'} tone={over ? 'negative' : percent >= 80 ? 'warning' : 'brand'} /><p className={'mt-3 text-xs ' + (over ? 'text-[var(--negative)]' : 'text-muted')}>{formatMoney(Math.abs(budget.limitPaise - spentPaise))} {over ? 'over your limit' : 'remaining'} · {Math.round(percent)}% used</p></Card>;
}
