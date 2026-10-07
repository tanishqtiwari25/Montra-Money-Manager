import { addMonths } from '@shared/lib';
import { DEMO_TODAY } from '@shared/config';
import type { Goal } from './types';
export interface GoalFinancialContext {
  liquidSavingsPaise: number; emergencyReservedPaise: number; emergencyTargetPaise: number;
  totalGoalAllocationsPaise: number; monthlySavingsPaise: number; activeLoanOutstandingPaise: number;
}
export interface GoalAffordability {
  label: string; tone: 'positive' | 'warning' | 'neutral'; months: number | null;
  estimatedDate: string | null; reason: string;
}
export function goalProgress(goal: Goal): number { return goal.targetPaise > 0 ? Math.min(100, goal.savedPaise / goal.targetPaise * 100) : 0; }
export function remainingForGoal(goal: Goal): number { return Math.max(0, goal.targetPaise - goal.savedPaise); }
export function allocatedToGoals(goals: readonly Goal[]): number { return goals.filter(goal => goal.status !== 'purchased').reduce((sum, goal) => sum + goal.savedPaise, 0); }
export function goalAffordability(goal: Goal, context: GoalFinancialContext): GoalAffordability {
  if (goal.status === 'purchased') return { label: 'Purchased', tone: 'neutral', months: 0, estimatedDate: goal.purchasedAt ?? DEMO_TODAY, reason: 'Purchase recorded.' };
  const remaining = remainingForGoal(goal);
  if (remaining === 0) return { label: 'Affordable now', tone: 'positive', months: 0, estimatedDate: DEMO_TODAY, reason: 'Fully funded with allocated savings; emergency savings stay reserved.' };
  const emergencyGap = Math.max(0, context.emergencyTargetPaise - context.emergencyReservedPaise);
  const unallocated = Math.max(0, context.liquidSavingsPaise - context.emergencyReservedPaise - context.totalGoalAllocationsPaise);
  const required = Math.max(0, remaining + emergencyGap + context.activeLoanOutstandingPaise - unallocated);
  if (required === 0) return { label: 'Affordable now', tone: 'positive', months: 0, estimatedDate: DEMO_TODAY, reason: 'Enough unallocated savings to cover the purchase, reserve the emergency target and cover active debt.' };
  if (context.monthlySavingsPaise <= 0) return { label: 'Not yet', tone: 'neutral', months: null, estimatedDate: null, reason: 'Create monthly savings before committing to this purchase.' };
  const months = Math.ceil(required / context.monthlySavingsPaise);
  return { label: 'In ' + months + (months === 1 ? ' month' : ' months'), tone: 'warning', months, estimatedDate: addMonths(DEMO_TODAY, months), reason: 'Estimate for this goal after protecting the emergency target and reserving loan payoff funds. Other goals remain allocated; future contributions compete for the same monthly savings.' };
}
export function estimatedGoalCompletion(goal: Goal, monthlyContributionPaise: number): string | null {
  if (remainingForGoal(goal) === 0) return goal.purchasedAt ?? DEMO_TODAY;
  return monthlyContributionPaise > 0 ? addMonths(DEMO_TODAY, Math.ceil(remainingForGoal(goal) / monthlyContributionPaise)) : null;
}
