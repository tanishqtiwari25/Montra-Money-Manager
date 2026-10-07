import type { RequestOptions } from '@shared/api';
export interface UserProfile {
  id: string; name: string; email: string; occupation: string;
  monthlySalaryPaise: number; monthlyGoalSavingsPaise: number;
  emergencyFundPaise: number; emergencyTargetPaise: number; currency: 'INR';
}
export type ProfileInput = Omit<UserProfile, 'id' | 'currency'>;
export interface UserApi { get: (options?: RequestOptions) => Promise<UserProfile>; update: (input: ProfileInput, options?: RequestOptions) => Promise<UserProfile> }
