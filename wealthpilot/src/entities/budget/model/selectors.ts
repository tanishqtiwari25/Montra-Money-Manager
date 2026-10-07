import type { Budget } from './types';
export function budgetUsage(budget: Budget, spentPaise: number): { percent: number; overBudget: boolean; remainingPaise: number } { return { percent: budget.limitPaise > 0 ? spentPaise / budget.limitPaise * 100 : 0, overBudget: spentPaise > budget.limitPaise, remainingPaise: budget.limitPaise - spentPaise }; }
