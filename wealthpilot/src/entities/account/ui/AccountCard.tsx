import { Landmark, Wallet, Banknote, TrendingUp } from 'lucide-react';
import { Card, Badge } from '@shared/ui';
import { formatMoney } from '@shared/lib';
import type { Account } from '../model/types';
export function AccountCard({ account }: { account: Account }) {
  const Icon = account.type === 'bank' ? Landmark : account.type === 'wallet' ? Wallet : account.type === 'cash' ? Banknote : TrendingUp;
  return <Card><div className="mb-5 flex items-center justify-between"><span className="rounded-xl bg-canvas p-3" style={{ color: account.color }}><Icon size={22} aria-hidden="true" /></span><Badge>{account.type}</Badge></div><p className="text-sm text-muted">{account.institution}</p><h3 className="mt-1 font-semibold text-ink">{account.name}</h3><p className="my-4 text-2xl font-semibold tabular-nums text-ink">{formatMoney(account.balancePaise)}</p><p className="text-xs text-muted">{account.lastFour ? 'Account ending ' + account.lastFour : 'Available balance'} · Demo</p></Card>;
}
