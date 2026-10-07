import { mockCollection, mockRequest, readMockResource, registerMockView, requireRecord } from '@shared/api';
import type { Account, AccountApi } from '../model/types';
const db = mockCollection<Account>('accounts', () => [
  { id: 'hdfc', name: 'Salary account', institution: 'HDFC Bank', type: 'bank', balancePaise: 25200000, lastFour: '4821', color: '#4338ca' },
  { id: 'sbi', name: 'Savings account', institution: 'State Bank of India', type: 'bank', balancePaise: 8600000, lastFour: '9164', color: '#0369a1' },
  { id: 'icici', name: 'Everyday account', institution: 'ICICI Bank', type: 'bank', balancePaise: 7400000, lastFour: '7302', color: '#9a3412' },
  { id: 'paytm', name: 'Paytm wallet / UPI', institution: 'Paytm', type: 'wallet', balancePaise: 450000, color: '#0e7490' },
  { id: 'cash', name: 'Cash in hand', institution: 'Personal', type: 'cash', balancePaise: 800000, color: '#047857' },
  { id: 'investment-sip', name: 'Index fund portfolio', institution: 'Demo investments', type: 'investment', balancePaise: 33000000, color: '#6d28d9' },
]);
// A mock transport projection avoids importing the transaction slice.
interface LedgerProjection { amountPaise: number; type: 'income' | 'expense' | 'transfer'; paymentMethodId: string; destinationAccountId?: string }
function effect(entries: LedgerProjection[], accountId: string): number {
  return entries.reduce((sum, entry) => {
    const source = entry.paymentMethodId === 'hdfc-debit' ? 'hdfc' : entry.paymentMethodId === 'icici-debit' ? 'icici' : entry.paymentMethodId;
    const sourceEffect = source === accountId ? (entry.type === 'income' ? entry.amountPaise : -entry.amountPaise) : 0;
    return sum + sourceEffect + (entry.type === 'transfer' && entry.destinationAccountId === accountId ? entry.amountPaise : 0);
  }, 0);
}
function readAccounts(): Account[] {
  const ledger = readMockResource<LedgerProjection>('transactions');
  return db.read().map(account => ({ ...account, balancePaise: account.balancePaise + (ledger ? effect(ledger.items, account.id) - effect(ledger.initial, account.id) : 0) }));
}
registerMockView('account-balances', readAccounts);
export const accountApi: AccountApi = {
  list: options => mockRequest(() => readAccounts(), options),
  get: (id, options) => mockRequest(() => requireRecord(readAccounts(), id), options),
};
