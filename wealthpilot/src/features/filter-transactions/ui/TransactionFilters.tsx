import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SlidersHorizontal } from 'lucide-react';
import type { TransactionQuery, TransactionFormOption } from '@entities/transaction';
import { Button, Input, Select } from '@shared/ui';
import { transactionFilterSchema, initialTransactionFilters, filtersToQuery, type TransactionFilters as FilterValues } from '../model/filters';
export function TransactionFilters({ onApply, categories, paymentMethods, initialSearch = '' }: { onApply: (query: TransactionQuery) => void; categories: TransactionFormOption[]; paymentMethods: TransactionFormOption[]; initialSearch?: string }) {
  const [expanded, setExpanded] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FilterValues>({ resolver: zodResolver(transactionFilterSchema), defaultValues: { ...initialTransactionFilters, search: initialSearch } });
  return <form onSubmit={handleSubmit(values => onApply(filtersToQuery(values)))} className="space-y-4" noValidate>
    <div className="flex flex-wrap items-end gap-3"><div className="min-w-48 flex-1"><Input label="Search transactions" placeholder="Merchant, note or tag" error={errors.search?.message} {...register('search')} /></div><Select label="Sort" {...register('sort')}><option value="date-desc">Newest first</option><option value="date-asc">Oldest first</option><option value="amount-desc">Highest amount</option><option value="amount-asc">Lowest amount</option></Select><Button variant="secondary" aria-expanded={expanded} aria-controls="transaction-filter-fields" onClick={() => setExpanded(value => !value)}><SlidersHorizontal size={16} />Filters</Button><Button type="submit">Apply</Button></div>
    <div id="transaction-filter-fields" hidden={!expanded} className="grid gap-4 rounded-control border border-line p-4 sm:grid-cols-2 lg:grid-cols-4">
      <Input label="From date" type="date" error={errors.from?.message} {...register('from')} /><Input label="To date" type="date" error={errors.to?.message} {...register('to')} />
      <Select label="Category" {...register('categoryId')}><option value="">All categories</option>{categories.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}</Select>
      <Select label="Payment method" {...register('paymentMethodId')}><option value="">All accounts and cards</option>{paymentMethods.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}</Select>
      <Select label="Type" {...register('type')}><option value="">All types</option><option value="income">Income</option><option value="expense">Expense</option><option value="transfer">Transfer</option></Select>
      <Input label="Minimum (₹)" inputMode="decimal" error={errors.min?.message} {...register('min')} /><Input label="Maximum (₹)" inputMode="decimal" error={errors.max?.message} {...register('max')} />
      <div className="flex items-end"><Button variant="ghost" onClick={() => { reset(initialTransactionFilters); onApply(filtersToQuery(initialTransactionFilters)); }}>Reset filters</Button></div>
    </div>
  </form>;
}
