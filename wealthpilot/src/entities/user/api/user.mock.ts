import { ApiError, mockCollection, mockRequest, readMockResource, readMockView, requirePaise } from '@shared/api';
import type { UserProfile, UserApi } from '../model/types';
const db = mockCollection<UserProfile>('user', () => [{ id: 'demo-user', name: 'Tanishq Tiwari', email: 'tanishq@example.com', occupation: 'Product designer', monthlySalaryPaise: 6000000, monthlyGoalSavingsPaise: 1200000, emergencyFundPaise: 4500000, emergencyTargetPaise: 18000000, currency: 'INR' }]);
export const userApi: UserApi = {
  get: options => mockRequest(() => { const user = db.read()[0]; if (!user) throw new ApiError('NOT_FOUND', 'Profile not found.', 404); return user; }, options),
  update: (input, options) => mockRequest(() => {
    if (!input.name.trim() || input.name.trim().length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email) || input.occupation.length > 100) throw new ApiError('VALIDATION', 'Enter a valid name, email and occupation.');
    requirePaise(input.monthlySalaryPaise, 'Salary'); requirePaise(input.monthlyGoalSavingsPaise, 'Monthly goal savings', true);
    requirePaise(input.emergencyFundPaise, 'Emergency fund', true); requirePaise(input.emergencyTargetPaise, 'Emergency target');
    if (input.monthlyGoalSavingsPaise > input.monthlySalaryPaise) throw new ApiError('VALIDATION', 'Monthly goal savings cannot exceed salary.');
    const accounts = readMockView<{ type: string; balancePaise: number }[]>('account-balances');
    const goals = readMockResource<{ status: string; savedPaise: number }>('goals');
    if (!accounts || !goals) throw new ApiError('NETWORK', 'Demo finances not initialized. Reload the application.', 503);
    const liquid = accounts.filter(account => account.type !== 'investment').reduce((sum, account) => sum + account.balancePaise, 0);
    const allocations = goals.items.filter(goal => goal.status !== 'purchased').reduce((sum, goal) => sum + goal.savedPaise, 0);
    if (input.emergencyFundPaise > Math.max(0, liquid - allocations)) throw new ApiError('VALIDATION', 'Emergency savings cannot exceed unallocated cash.');
    const item: UserProfile = { ...input, name: input.name.trim(), email: input.email.trim(), occupation: input.occupation.trim(), id: 'demo-user', currency: 'INR' };
    db.write([item]); return item;
  }, options),
};
