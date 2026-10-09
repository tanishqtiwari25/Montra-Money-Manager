import { useEffect, type ReactNode } from 'react';
import { useAccounts } from '@entities/account';
import { useCards } from '@entities/card';
import { useLoans } from '@entities/loan';
import { useTransactions } from '@entities/transaction';
import { useCategories } from '@entities/category';
import { useBudgets } from '@entities/budget';
import { useGoals, useGoalPlan } from '@entities/goal';
import { useUser } from '@entities/user';
import { useNotifications } from '@entities/notification';
import { useFinancialNotifications } from '@features/sync-notifications';
import { useAuth } from '@entities/auth';
import { useOverview } from '@entities/overview';
import { useCfo } from '@features/ask-cfo';
import { IS_DEMO } from '@shared/config';
import { RecoveryCode } from '../ui/RecoveryCode';
import { clearTransactionVersions } from '@entities/transaction';
import { ToastHost } from '@shared/ui';
export function AppProviders({ children }: { children: ReactNode }) {
  const auth = useAuth();
  useEffect(() => { if (!IS_DEMO) void useAuth.getState().initialize(); }, []);
  useEffect(() => {
    const stores = [useAccounts, useCards, useLoans, useTransactions, useCategories, useBudgets, useGoals, useNotifications];
    if (!IS_DEMO) { stores.forEach(store => store.getState().reset()); useUser.getState().reset(); useOverview.getState().reset(); clearTransactionVersions(); useCfo.getState().clear(); useGoalPlan.getState().reset(); }
    if (!IS_DEMO && auth.status !== 'authenticated') return;
    if (!IS_DEMO) { void useOverview.getState().load(); void useCfo.getState().restore(auth.identity?.username ?? ''); }
    void useAccounts.getState().load(); void useCards.getState().load(); void useLoans.getState().load(); void useTransactions.getState().load(); void useCategories.getState().load(); void useBudgets.getState().load(); void useGoals.getState().load(); void useUser.getState().load(); void useNotifications.getState().load(); }, [auth.status, auth.epoch, auth.identity?.username]);
  useEffect(() => { if (IS_DEMO || auth.status !== 'authenticated') return; const unsubscribe = useTransactions.subscribe(() => { void useOverview.getState().load(true); }); const timer = window.setInterval(() => { void useOverview.getState().load(true); void useNotifications.getState().load(true); }, 60000); return () => { unsubscribe(); window.clearInterval(timer); }; }, [auth.status]);
  useEffect(() => { if (IS_DEMO || auth.status !== 'authenticated') return; let timer: ReturnType<typeof setTimeout> | undefined;
    const refresh = () => { useGoalPlan.getState().invalidate(); if(timer)clearTimeout(timer); timer=setTimeout(()=>{void useGoalPlan.getState().load();void useOverview.getState().load(true);},100); };
    const subscriptions = [useAccounts,useCards,useLoans,useTransactions,useBudgets,useGoals].map(store=>store.subscribe((state,previous)=>{if(state.items!==previous.items)refresh();}));
    subscriptions.push(useUser.subscribe((state,previous)=>{if(state.profile!==previous.profile)refresh();}));
    const focus=()=>{void useGoalPlan.getState().load();void useOverview.getState().load(true);};window.addEventListener('focus',focus);void useGoalPlan.getState().load();
    return ()=>{subscriptions.forEach(unsubscribe=>unsubscribe());if(timer)clearTimeout(timer);window.removeEventListener('focus',focus);};
  },[auth.status,auth.epoch]);
  useFinancialNotifications();
  return <>{children}<ToastHost />{!IS_DEMO && <RecoveryCode />}</>;
}
