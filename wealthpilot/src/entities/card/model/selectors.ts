import type { PaymentCard } from './types';
export function creditCardDebt(cards: readonly PaymentCard[]): number { return cards.filter(card => card.type === 'credit').reduce((sum, card) => sum + card.balancePaise, 0); }
export function creditUtilization(card: PaymentCard): number { return card.type === 'credit' && card.limitPaise ? card.balancePaise / card.limitPaise * 100 : 0; }
