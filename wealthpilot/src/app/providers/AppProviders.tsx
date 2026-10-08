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
import { useAuth } from '@entities/auth';
import { useOverview } from '@entities/overview';
import { useCfo } from '@features/ask-cfo';
import { IS_DEMO } from '@shared/config';
import { RecoveryCode } from '../ui/RecoveryCode';
import { clearTransactionVersions } from '@entities/transaction';
import { ToastHost, toast } from '@shared/ui';
export function AppProviders({ children }: { children: ReactNode }) {
  const auth = useAuth();
  useEffect(() => { if (!IS_DEMO) void useAuth.getState().initialize(); }, []);
  const goals = useGoals(state => state.items); const loaded = useGoals(state => state.loaded);
  useEffect(() => {
    const stores = [useAccounts, useCards, useLoans, useTransactions, useCategories, useBudgets, useGoals, useNotifications];
    if (!IS_DEMO) { stores.forEach(store => store.getState().reset()); useUser.getState().reset(); useOverview.getState().reset(); clearTransactionVersions(); useCfo.getState().clear(); }
    if (!IS_DEMO && auth.status !== 'authenticated') return;
    if (!IS_DEMO) { void useOverview.getState().load(); void useCfo.getState().restore(auth.identity?.username ?? ''); }
    void useAccounts.getState().load(); void useCards.getState().load(); void useLoans.getState().load(); void useTransactions.getState().load(); void useCategories.getState().load(); void useBudgets.getState().load(); void useGoals.getState().load(); void useUser.getState().load(); void useNotifications.getState().load(); }, [auth.status, auth.epoch, auth.identity?.username]);
  useEffect(() => { if (IS_DEMO || auth.status !== 'authenticated') return; const unsubscribe = useTransactions.subscribe(() => { void useOverview.getState().load(true); }); const timer = window.setInterval(() => { void useOverview.getState().load(true); void useNotifications.getState().load(true); }, 60000); return () => { unsubscribe(); window.clearInterval(timer); }; }, [auth.status]);
  useEffect(() => { if (!loaded) return; for (const goal of goals) { if (goal.status !== 'achieved' || goal.achievementAnnounced) continue; void announceGoalAchievement(goal).then(announced => { if (announced) toast('You can now afford ' + goal.name + ' based on your salary and savings.'); }).catch(() => toast('Your goal is funded. Reopen Goals to retry the achievement alert.', 'info')); } }, [goals, loaded]);
  useFinancialNotifications();
  return <>{children}<ToastHost />{!IS_DEMO && <RecoveryCode />}</>;
}
