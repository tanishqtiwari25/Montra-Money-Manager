import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { transactionApi, TransactionForm, transactionFormToInput,  type TransactionFormValues, useTransactions } from '@entities/transaction';
import { useAccounts } from '@entities/account';
import { useCards } from '@entities/card';
import { useCategories } from '@entities/category';
import { Button, Modal, Skeleton, ErrorState, toast } from '@shared/ui';
import { errorMessage } from '@shared/lib';
import { DEMO_TODAY } from '@shared/config';
export function AddTransaction({ onSaved }: { onSaved?: () => void }) {
  const [open, setOpen] = useState(false); const [saving, setSaving] = useState(false); const [error, setError] = useState<string | null>(null);
  const accounts = useAccounts(); const cards = useCards(); const categories = useCategories();
  useEffect(() => { if (open) { void accounts.load(); void cards.load(); void categories.load(); } }, [open, accounts.load, cards.load, categories.load]);
  const dataError = accounts.error ?? cards.error ?? categories.error;
  const ready = accounts.loaded && cards.loaded && categories.loaded;
  const retry = () => { void accounts.load(true); void cards.load(true); void categories.load(true); };
  const defaults: TransactionFormValues = { amount: 0, type: 'expense', categoryId: '', date: DEMO_TODAY, note: '', paymentMethodId: 'hdfc', tags: '', destinationAccountId: '' };
  const submit = async (values: TransactionFormValues) => {
    setSaving(true); setError(null);
    try {
      const item = await transactionApi.create(transactionFormToInput(values));
      useTransactions.getState().upsert(item);
      await Promise.all([useAccounts.getState().load(true), useCards.getState().load(true)]);
      toast('Transaction added.'); setOpen(false); onSaved?.();
    } catch (cause: unknown) { setError(errorMessage(cause)); }
    finally { setSaving(false); }
  };
  return <><Button variant="primary"  onClick={() => { setError(null); setOpen(true); }}><Plus size={18} />Add transaction</Button><Modal open={open} title="Add transaction" onClose={() => { if (!saving) setOpen(false); }}>
    {dataError ? <ErrorState message={dataError} onRetry={retry} /> : !ready ? <Skeleton className="h-80" /> : <TransactionForm defaults={defaults} onSubmit={submit} onCancel={() => setOpen(false)} error={error} categoryOptions={categories.items.map(category => ({ id: category.id, label: category.name }))} paymentOptions={[...accounts.items.filter(account => account.type !== 'investment').map(account => ({ id: account.id, label: account.institution + ' · ' + account.name })), ...cards.items.map(card => ({ id: card.id, label: card.name + ' · ' + card.type + ' · ' + card.lastFour }))]} destinationOptions={accounts.items.map(account => ({ id: account.id, label: account.name }))} />}
  </Modal></>;
}
