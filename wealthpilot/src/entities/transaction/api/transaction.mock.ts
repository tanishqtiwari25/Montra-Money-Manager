import { ApiError, mockCollection, mockRequest, paginate, requireDate, requirePaise, requireRecord } from '@shared/api';
import type { Transaction, TransactionApi, TransactionInput } from '../model/types';
function seedTransactions(): Transaction[] {
  const entries = [
    ['Salary · Acme Studio', 60000, 'income', 'salary', 'hdfc', 1],
    ['Apartment rent', 18000, 'expense', 'housing', 'hdfc', 1],
    ['Swiggy · weekend dinner', 1200, 'expense', 'food', 'hdfc-credit', 2],
    ['Zomato · team lunch', 1600, 'expense', 'food', 'icici-credit', 3],
    ['Amazon · home essentials', 4500, 'expense', 'shopping', 'hdfc-credit', 4],
    ['Netflix subscription', 649, 'expense', 'subscriptions', 'icici-credit', 4],
    ['Indian Oil · fuel', 2400, 'expense', 'transport', 'icici-debit', 5],
    ['UPI · electricity and internet', 1800, 'expense', 'utilities', 'sbi', 5],
    ['UPI · local groceries', 2200, 'expense', 'food', 'paytm', 6],
    ['SIP · index fund contribution', 6000, 'transfer', 'investment', 'hdfc', 6],
    ['Personal loan EMI', 5800, 'expense', 'emi', 'hdfc', 7],
    ['UPI · family support', 2500, 'expense', 'family', 'sbi', 7],
  ] as const;
  return Array.from({ length: 12 }, (_, monthIndex) => {
    const date = new Date(Date.UTC(2025, 10 + monthIndex, 1));
    const month = date.toISOString().slice(0, 7);
    const seasonalVariation = [0, -100, 80, 200, 40, -50, 150, 100, -150, 60, 20, 0][monthIndex] ?? 0;
    return entries.map(([note, amount, type, categoryId, paymentMethodId, day], index): Transaction => ({
      id: 'tx-' + month + '-' + index, amountPaise: (amount + (type === 'expense' && categoryId === 'shopping' ? monthIndex * 50 : 0) + (categoryId === 'food' ? seasonalVariation * 2 : categoryId === 'transport' ? seasonalVariation * 3 : 0)) * 100,
      type, categoryId, date: month + '-' + String(day).padStart(2, '0'), note, paymentMethodId,
      tags: type === 'income' ? ['salary'] : categoryId === 'emi' ? ['loan'] : ['personal'],
      ...(type === 'transfer' ? { destinationAccountId: 'investment-sip' } : {}),
    }));
  }).flat();
}
const db = mockCollection<Transaction>('transactions', seedTransactions);
const paymentMethods = new Set(['hdfc', 'sbi', 'icici', 'paytm', 'cash', 'hdfc-debit', 'icici-debit', 'hdfc-credit', 'icici-credit']);
const categories = new Set(['salary', 'housing', 'food', 'shopping', 'subscriptions', 'transport', 'utilities', 'investment', 'emi', 'family', 'other']);
function validate(input: TransactionInput): void {
  requirePaise(input.amountPaise); requireDate(input.date);
  if (!['income', 'expense', 'transfer'].includes(input.type)) throw new ApiError('VALIDATION', 'Choose a valid transaction type.');
  if (!paymentMethods.has(input.paymentMethodId)) throw new ApiError('VALIDATION', 'Choose a valid payment account or card.');
  if (!categories.has(input.categoryId)) throw new ApiError('VALIDATION', 'Choose a valid category.');
  if (!input.note.trim() || input.note.length > 200) throw new ApiError('VALIDATION', 'A note between 1 and 200 characters is required.');
  if (input.tags.length > 8 || input.tags.some(tag => !tag.trim() || tag.length > 24)) throw new ApiError('VALIDATION', 'Use up to eight tags of 1–24 characters.');
  if (input.type === 'transfer' && (!input.destinationAccountId || !['hdfc', 'sbi', 'icici', 'paytm', 'cash', 'investment-sip'].includes(input.destinationAccountId) || input.destinationAccountId === input.paymentMethodId)) throw new ApiError('VALIDATION', 'Choose a different destination account.');
  if (input.type === 'transfer' && input.paymentMethodId.includes('credit')) throw new ApiError('VALIDATION', 'Credit-card transfers are not supported in this demo.');
}
export const transactionApi: TransactionApi = {
  list: (query = {}, options) => mockRequest(() => {
    const search = query.search?.trim().toLowerCase();
    const items = db.read().filter(item =>
      (!search || (item.note + ' ' + item.tags.join(' ')).toLowerCase().includes(search)) &&
      (!query.from || item.date >= query.from) && (!query.to || item.date <= query.to) &&
      (!query.categoryId || item.categoryId === query.categoryId) &&
      (!query.paymentMethodId || item.paymentMethodId === query.paymentMethodId) &&
      (!query.type || item.type === query.type) &&
      (query.minPaise === undefined || item.amountPaise >= query.minPaise) &&
      (query.maxPaise === undefined || item.amountPaise <= query.maxPaise));
    items.sort((a, b) => query.sort === 'amount-desc' ? b.amountPaise - a.amountPaise : query.sort === 'amount-asc' ? a.amountPaise - b.amountPaise : query.sort === 'date-asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
    return paginate(items, query);
  }, options),
  get: (id, options) => mockRequest(() => requireRecord(db.read(), id), options),
  create: (input, options) => mockRequest(() => {
    validate(input); const item: Transaction = { ...input, id: crypto.randomUUID(), note: input.note.trim(), tags: input.tags.map(tag => tag.trim()) };
    db.write([...db.read(), item]); return item;
  }, options),
  update: (id, input, options) => mockRequest(() => {
    validate(input); const items = db.read(); requireRecord(items, id);
    const item: Transaction = { ...input, id, note: input.note.trim(), tags: input.tags.map(tag => tag.trim()) };
    db.write(items.map(value => value.id === id ? item : value)); return item;
  }, options),
  remove: (id, options) => mockRequest(() => { const items = db.read(); requireRecord(items, id); db.write(items.filter(item => item.id !== id)); return { id }; }, options),
};
