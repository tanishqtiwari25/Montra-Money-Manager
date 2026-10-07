import type { RequestOptions } from '@shared/api';
export type GoalIcon = 'phone' | 'laptop' | 'plane' | 'headphones' | 'sparkles';
export interface Goal {
  id: string; name: string; targetPaise: number; savedPaise: number;
  targetDate?: string; imageUrl?: string; icon: GoalIcon; priority: 'high' | 'medium' | 'low';
  status: 'saving' | 'achieved' | 'purchased'; createdAt: string; purchasedAt?: string;
  achievementAnnounced: boolean;
}
export type GoalInput = Pick<Goal, 'name' | 'targetPaise' | 'targetDate' | 'imageUrl' | 'icon' | 'priority'>;
export interface GoalContribution { amountPaise: number }
export interface GoalApi {
  list: (options?: RequestOptions) => Promise<Goal[]>;
  get: (id: string, options?: RequestOptions) => Promise<Goal>;
  create: (input: GoalInput, options?: RequestOptions) => Promise<Goal>;
  contribute: (id: string, input: GoalContribution, options?: RequestOptions) => Promise<Goal>;
  purchase: (id: string, input: { paymentAccountId: string }, options?: RequestOptions) => Promise<Goal>;
  acknowledgeAchievement: (id: string, options?: RequestOptions) => Promise<Goal>;
}
