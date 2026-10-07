import { useEffect, type ReactNode } from 'react';
import { useAccounts } from '@entities/account';
import { useCards } from '@entities/card';
import { useLoans } from '@entities/loan';
import { useTransactions } from '@entities/transaction';
import { useCategories } from '@entities/category';
import { useBudgets } from '@entities/budget';
import { useGoals } from '@entities/goal';
import { useUser } from '@entities/user';
import { useNotifications } from '@entities/notification';
import { announceGoalAchievement } from '@features/contribute-to-goal';
import { useFinancialNotifications } from '@features/sync-notifications';
import { ToastHost, toast } from '@shared/ui';
export function AppProviders({ children }: { children: ReactNode }) {
  const goals = useGoals(state => state.items); const loaded = useGoals(state => state.loaded);
  useEffect(() => { void useAccounts.getState().load(); void useCards.getState().load(); void useLoans.getState().load(); void useTransactions.getState().load(); void useCategories.getState().load(); void useBudgets.getState().load(); void useGoals.getState().load(); void useUser.getState().load(); void useNotifications.getState().load(); }, []);
  useEffect(() => { if (!loaded) return; for (const goal of goals) { if (goal.status !== 'achieved' || goal.achievementAnnounced) continue; void announceGoalAchievement(goal).then(announced => { if (announced) toast('You can now afford ' + goal.name + ' based on your salary and savings.'); }).catch(() => toast('Your goal is funded. Reopen Goals to retry the achievement alert.', 'info')); } }, [goals, loaded]);
  useFinancialNotifications();
  return <>{children}<ToastHost /></>;
}
