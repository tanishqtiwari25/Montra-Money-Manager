import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from 'lucide-react';
import { Badge } from '@shared/ui';
import { formatDate, formatMoney } from '@shared/lib';
import type { ReactNode } from 'react';
import type { Transaction } from '../model/types';
export function TransactionRow({ transaction, categoryName, paymentLabel, action }: { transaction: Transaction; categoryName: string; paymentLabel: string; action?: ReactNode }) {
  const Icon = transaction.type === 'income' ? ArrowDownLeft : transaction.type === 'expense' ? ArrowUpRight : ArrowLeftRight;
  return <div className="flex flex-wrap items-center gap-3 border-b border-line py-4 last:border-0"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-canvas text-muted"><Icon size={18} aria-hidden="true" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-ink">{transaction.note}</p><p className="mt-1 text-xs text-muted">{categoryName} · {formatDate(transaction.date, { day: 'numeric', month: 'short' })}</p></div><Badge>{paymentLabel}</Badge><span className={'min-w-24 text-right text-sm font-semibold tabular-nums ' + (transaction.type === 'income' ? 'text-[var(--positive)]' : transaction.type === 'expense' ? 'text-[var(--negative)]' : 'text-muted')}>{transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '−' : ''}{formatMoney(transaction.amountPaise)}</span>{action}</div>;
}
