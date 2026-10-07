import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { goalApi, useGoals, remainingForGoal, type Goal } from '@entities/goal';
import { useAccounts } from '@entities/account';
import { useUser } from '@entities/user';
import { Button, Modal, Input, Skeleton, ErrorState, toast } from '@shared/ui';
import { errorMessage, formatMoney, rupeesToPaise } from '@shared/lib';
import { contributionSchema, type ContributionValues } from '../model/schema';
import { announceGoalAchievement } from '../model/announce';
function ContributionForm({ goal, onCancel, onDone, onBusy }: { goal: Goal; onCancel: () => void; onDone: () => void; onBusy: (busy: boolean) => void }) {
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContributionValues>({ resolver: zodResolver(contributionSchema(remainingForGoal(goal))), defaultValues: { amount: Math.min(1000, remainingForGoal(goal) / 100) } });
  const submit = async (values: ContributionValues) => {
    onBusy(true); setError(null);
    try {
      const item = await goalApi.contribute(goal.id, { amountPaise: rupeesToPaise(values.amount) }); useGoals.getState().upsert(item);
      if (item.status === 'achieved') {
        toast('You can now afford ' + item.name + ' based on your salary and savings.');
        try { await announceGoalAchievement(item); } catch { toast('Goal funded. The achievement notification will retry when you open Goals.', 'info'); }
      } else toast('Contribution added to ' + item.name + '.');
      onDone();
    } catch (cause: unknown) { setError(errorMessage(cause)); }
    finally { onBusy(false); }
  };
  return <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4"><p className="text-sm text-muted">{formatMoney(remainingForGoal(goal))} remains. Contributions reserve existing savings and protect your emergency fund.</p><Input label="Contribution (₹)" type="number" inputMode="decimal" step="0.01" disabled={isSubmitting} error={errors.amount?.message} {...register('amount', { valueAsNumber: true })} />{error && <ErrorState message={error} />}<div className="flex justify-end gap-2"><Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>Cancel</Button><Button type="submit" busy={isSubmitting}>Add contribution</Button></div></form>;
}
export function ContributeToGoal({ goal }: { goal: Goal }) {
  const [open, setOpen] = useState(false); const [busy, setBusy] = useState(false);
  const accounts = useAccounts(); const user = useUser();
  useEffect(() => { if (open) { void accounts.load(); void user.load(); } }, [open, accounts.load, user.load]);
  const dataError = accounts.error ?? user.error;
  const retry = () => { void accounts.load(true); void user.load(true); };
  return <><Button variant="secondary" disabled={goal.status !== 'saving'} onClick={() => setOpen(true)}>Add contribution</Button><Modal open={open} title={'Save toward ' + goal.name} onClose={() => { if (!busy) setOpen(false); }}>{dataError ? <ErrorState message={dataError} onRetry={retry} /> : !accounts.loaded || !user.profile ? <Skeleton className="h-40" /> : <ContributionForm goal={goal} onBusy={setBusy} onCancel={() => setOpen(false)} onDone={() => setOpen(false)} />}</Modal></>;
}
