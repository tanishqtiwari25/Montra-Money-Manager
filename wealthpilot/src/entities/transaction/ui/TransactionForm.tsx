import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Select, ErrorState } from '@shared/ui';
import { transactionFormSchema, type TransactionFormValues } from '../model/schema';
export interface TransactionFormOption { id: string; label: string }
export interface TransactionFormProps {
  defaults: TransactionFormValues;
  paymentOptions: TransactionFormOption[];
  categoryOptions: TransactionFormOption[];
  destinationOptions: TransactionFormOption[];
  onSubmit: (values: TransactionFormValues) => Promise<void>;
  onCancel: () => void;
  error: string | null;
  submitLabel?: string;
}
export function TransactionForm({ defaults, paymentOptions, categoryOptions, destinationOptions, onSubmit, onCancel, error, submitLabel = 'Save transaction' }: TransactionFormProps) {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<TransactionFormValues>({ resolver: zodResolver(transactionFormSchema), defaultValues: defaults });
  const type = watch('type');
  return <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
    <fieldset disabled={isSubmitting} className="space-y-4">
      <div className="grid grid-cols-2 gap-4"><Input label="Amount (₹)" type="number" inputMode="decimal" step="0.01" min="0.01" error={errors.amount?.message} {...register('amount', { valueAsNumber: true })} /><Select label="Type" error={errors.type?.message} {...register('type')}><option value="expense">Expense</option><option value="income">Income</option><option value="transfer">Transfer</option></Select></div>
      <Select label="Category" error={errors.categoryId?.message} {...register('categoryId')}><option value="">Choose category</option>{categoryOptions.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}</Select>
      <Select label="Payment account or card" error={errors.paymentMethodId?.message} {...register('paymentMethodId')}><option value="">Choose payment method</option>{paymentOptions.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}</Select>
      {type === 'transfer' && <Select label="Destination account" error={errors.destinationAccountId?.message} {...register('destinationAccountId')}><option value="">Choose destination</option>{destinationOptions.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}</Select>}
      <Input label="Date (IST)" type="date" error={errors.date?.message} {...register('date')} />
      <Input label="Note" placeholder="What was this for?" maxLength={200} error={errors.note?.message} {...register('note')} />
      <Input label="Tags" placeholder="personal, essentials" error={errors.tags?.message} {...register('tags')} />
    </fieldset>
    {error && <ErrorState message={error} />}
    <div className="flex justify-end gap-2 pt-2"><Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>Cancel</Button><Button type="submit" busy={isSubmitting}>{submitLabel}</Button></div>
  </form>;
}
