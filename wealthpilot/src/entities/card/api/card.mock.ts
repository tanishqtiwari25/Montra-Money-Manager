import { mockCollection, mockRequest, readMockResource, readMockView, requireRecord } from '@shared/api';
import type { PaymentCard, CardApi } from '../model/types';
const db = mockCollection<PaymentCard>('cards', () => [
  { id: 'hdfc-credit', accountId: 'hdfc', name: 'HDFC Millennia', issuer: 'HDFC Bank', network: 'Visa', type: 'credit', lastFour: '2846', gradient: 'linear-gradient(135deg, #172554, #4338ca)', balancePaise: 2400000, limitPaise: 15000000, duePaise: 760000, dueDate: '2026-10-14' },
  { id: 'icici-credit', accountId: 'icici', name: 'Amazon Pay ICICI', issuer: 'ICICI Bank', network: 'Visa', type: 'credit', lastFour: '9051', gradient: 'linear-gradient(135deg, #1c1917, #78350f)', balancePaise: 850000, limitPaise: 10000000, duePaise: 340000, dueDate: '2026-10-19' },
  { id: 'hdfc-debit', accountId: 'hdfc', name: 'HDFC EasyShop', issuer: 'HDFC Bank', network: 'Mastercard', type: 'debit', lastFour: '3179', gradient: 'linear-gradient(135deg, #064e3b, #0f766e)', balancePaise: 25200000 },
  { id: 'icici-debit', accountId: 'icici', name: 'ICICI Coral Debit', issuer: 'ICICI Bank', network: 'Visa', type: 'debit', lastFour: '6582', gradient: 'linear-gradient(135deg, #7c2d12, #9a3412)', balancePaise: 7400000 },
]);
interface CardLedgerProjection { paymentMethodId: string; amountPaise: number; type: 'income' | 'expense' | 'transfer' }
function readCards(): PaymentCard[] {
  const ledger = readMockResource<CardLedgerProjection>('transactions');
  const accounts = readMockView<{ id: string; balancePaise: number }[]>('account-balances');
  const effect = (entries: CardLedgerProjection[], id: string) => entries.filter(entry => entry.paymentMethodId === id).reduce((sum, entry) => sum + (entry.type === 'income' ? -entry.amountPaise : entry.amountPaise), 0);
  return db.read().map(card => ({ ...card, balancePaise: card.type === 'debit' ? accounts?.find(account => account.id === card.accountId)?.balancePaise ?? card.balancePaise : Math.max(0, card.balancePaise + (ledger ? effect(ledger.items, card.id) - effect(ledger.initial, card.id) : 0)) }));
}
export const cardApi: CardApi = {
  list: options => mockRequest(() => readCards(), options),
  get: (id, options) => mockRequest(() => requireRecord(readCards(), id), options),
};
