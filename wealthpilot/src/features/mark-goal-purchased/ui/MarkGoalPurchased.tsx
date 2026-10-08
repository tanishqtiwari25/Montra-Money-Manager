import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { goalApi, useGoals, type Goal } from '@entities/goal';
import { useAccounts } from '@entities/account';
import { useCards } from '@entities/card';
import { useTransactions } from '@entities/transaction';
import { Button, Modal, Select, Skeleton, ErrorState, toast } from '@shared/ui';
import { formatMoney, errorMessage } from '@shared/lib';
import { purchaseGoalSchema, type PurchaseGoalValues } from '../model/schema';
export function MarkGoalPurchased({ goal }: { goal: Goal }) {
  const [open, setOpen] = useState(false); const [error, setError] = useState<string | null>(null); const accounts = useAccounts();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PurchaseGoalValues>({ resolver: zodResolver(purchaseGoalSchema), defaultValues: { paymentAccountId: accounts.items.find(account => account.type !== 'investment')?.id ?? '' } });
  useEffect(() => { if (open) void accounts.load(); }, [open, accounts.load]);
  const submit = async (values: PurchaseGoalValues) => {
    setError(null);
    try { const item = await goalApi.purchase(goal.id, values); useGoals.getState().upsert(item); await Promise.all([useAccounts.getState().load(true), useCards.getState().load(true), useTransactions.getState().load(true)]); toast(goal.name + ' marked as purchased.'); setOpen(false); }
    catch (cause: unknown) { setError(errorMessage(cause)); }
  };
  return <><Button disabled={goal.status !== 'achieved'} onClick={() => { reset({ paymentAccountId: accounts.items.find(account => account.type !== 'investment')?.id ?? '' }); setError(null); setOpen(true); }}>Mark as purchased</Button><Modal open={open} title={'Record your ' + goal.name + ' purchase'} onClose={() => { if (!isSubmitting) setOpen(false); }}>{accounts.error ? <ErrorState message={accounts.error} onRetry={() => void accounts.load(true)} /> : !accounts.loaded ? <Skeleton /> : <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate><p className="text-sm text-muted">Record {formatMoney(goal.targetPaise)} as an expense and complete this goal.</p><Select label="Payment account" disabled={isSubmitting} error={errors.paymentAccountId?.message} {...register('paymentAccountId')}><option value="">Choose account</option>{accounts.items.filter(account => account.type !== 'investment').map(account => <option key={account.id} value={account.id}>{account.institution} · {formatMoney(account.balancePaise)}</option>)}</Select>{error && <ErrorState message={error} />}<div className="flex justify-end gap-2"><Button variant="secondary" onClick={() => setOpen(false)} disabled={isSubmitting}>Cancel</Button><Button type="submit" busy={isSubmitting}>Record purchase</Button></div></form>}</Modal></>;
}
