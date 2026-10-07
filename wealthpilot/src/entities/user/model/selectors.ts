import type { UserProfile } from './types';
export function emergencyFundHealth(user: UserProfile): number { return user.emergencyTargetPaise > 0 ? Math.max(0, Math.min(100, user.emergencyFundPaise / user.emergencyTargetPaise * 100)) : 0; }
export function monthlyGoalCapacity(user: UserProfile, expensesPaise: number): number { return Math.max(0, Math.min(user.monthlyGoalSavingsPaise, user.monthlySalaryPaise - expensesPaise)); }
