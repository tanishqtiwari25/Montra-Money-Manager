import type { RequestOptions } from '@shared/api';
import type { Goal, GoalInput } from '@entities/goal';
import type { Reminder } from '@entities/notification';
export type CfoStage = 'ready' | 'awaiting-reason' | 'awaiting-detail' | 'awaiting-device' | 'advice';
export type CfoReplyId = 'purchase-phone' | 'purchase-laptop' | 'importance' | 'reason-work' | 'reason-status' | 'reason-device' | 'reason-other' | 'device-minor' | 'device-major' | 'device-okay' | 'payoff-plan' | 'review-plan';
export interface CfoPurchase { name: string; pricePaise: number; category: 'phone' | 'work-equipment' | 'other' }
export interface CfoRequest { requestId: string; conversationId: string; message: string; replyId?: CfoReplyId; purchase?: CfoPurchase }
export interface CfoQuickReply { id: CfoReplyId; label: string; message: string }
export interface CfoSnapshot {
  salaryPaise: number; liquidSavingsPaise: number; goalAllocationsPaise: number;
  emergencyFundPaise: number; emergencyTargetPaise: number; emergencyProgressPercent: number;
  activeLoanOutstandingPaise: number; creditCardDebtPaise: number;
  monthlyExpensesPaise: number; monthlySavingsPaise: number; monthlyGoalSavingsPaise: number;
}
export interface CfoImpactCard {
  kind: 'impact'; title: string; purchasePricePaise: number; unallocatedSavingsPaise: number;
  goalDelays: { goalName: string; months: number }[];
  emergencyLabel: string; emergencyTone: 'positive' | 'warning' | 'negative';
  recommendedBuyDate: string | null; waitMonths: number | null; explanation: string;
}
export interface CfoLoanPlanCard {
  kind: 'loan-payoff'; title: string;
  loans: { name: string; outstandingPaise: number; emiPaise: number; extraPaise: number; monthlyPaymentPaise: number; months: number | null; payoffDate: string | null }[];
  explanation: string;
}
export interface CfoStrategyCard { kind: 'strategy'; title: string; options: { name: string; description: string; costPaise?: number }[] }
export interface CfoRoiCard { kind: 'roi'; title: string; purchasePricePaise: number; potentialMonthlyIncomePaise: number; breakEvenMonths: number; explanation: string }
export interface CfoSalaryCard { kind: 'salary-growth'; title: string; currentSalaryPaise: number; targetSalaryPaise: number; progressPercent: number; steps: string[] }
export type CfoRichCard = CfoImpactCard | CfoLoanPlanCard | CfoStrategyCard | CfoRoiCard | CfoSalaryCard;
export interface CfoSetGoalAction { kind: 'set-goal'; label: string; goal: GoalInput; existingGoalId?: string; idempotencyKey: string }
export interface CfoPayoffAction { kind: 'show-payoff'; label: string; message: string; replyId: 'payoff-plan' }
export interface CfoRemindAction { kind: 'remind'; label: string; title: string; dueDate: string; idempotencyKey: string }
export type CfoAction = CfoSetGoalAction | CfoPayoffAction | CfoRemindAction;
export interface CfoResponse {
  id: string; conversationId: string; revision: number; state: CfoStage;
  text: string; createdAt: string; purchase: CfoPurchase; snapshot: CfoSnapshot;
  quickReplies: CfoQuickReply[]; cards: CfoRichCard[]; actions: CfoAction[];
}
export interface CfoApi {
  ask: (request: CfoRequest, options?: RequestOptions) => Promise<CfoResponse>;
  getSnapshot: (options?: RequestOptions) => Promise<CfoSnapshot>;
  setGoal: (action: CfoSetGoalAction, options?: RequestOptions) => Promise<Goal>;
  remind: (action: CfoRemindAction, options?: RequestOptions) => Promise<Reminder>;
}
export type CfoMessage =
  | { id: string; role: 'user'; text: string; createdAt: string; status: 'pending' | 'sent' | 'failed'; request: CfoRequest }
  | { id: string; role: 'assistant'; response: CfoResponse };
