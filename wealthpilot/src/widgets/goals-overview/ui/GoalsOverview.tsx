import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Target, ArrowUpRight } from 'lucide-react';
import { useGoals, GoalCard, goalAffordability, allocatedToGoals, estimatedGoalCompletion } from '@entities/goal';
import { useAccounts, liquidBalance } from '@entities/account';
import { useLoans, activeLoanOutstanding } from '@entities/loan';
import { useUser, monthlyGoalCapacity } from '@entities/user';
import { useTransactions, transactionTotals } from '@entities/transaction';
import { CreateGoal } from '@features/create-goal';
import { ContributeToGoal, GoalCelebration } from '@features/contribute-to-goal';
import { MarkGoalPurchased } from '@features/mark-goal-purchased';
import { PageHeader, Card, ProgressBar, AsyncState, EmptyState } from '@shared/ui';
import { DEMO_MONTH } from '@shared/config';
import { formatMoney } from '@shared/lib';
export function GoalsOverview({ compact = false }: { compact?: boolean }) {
  const goals = useGoals(); const accounts = useAccounts(); const loans = useLoans(); const user = useUser(); const transactions = useTransactions();
  useEffect(() => { if (!compact) void goals.load(true); }, [compact, goals.load]);
  const monthlyCapacity = user.profile ? monthlyGoalCapacity(user.profile, transactionTotals(transactions.items, DEMO_MONTH).expensePaise) : 0;
  const savingCount = Math.max(1, goals.items.filter(goal => goal.status === 'saving').length);
  const context = { liquidSavingsPaise: liquidBalance(accounts.items), emergencyReservedPaise: user.profile?.emergencyFundPaise ?? 0, emergencyTargetPaise: user.profile?.emergencyTargetPaise ?? 0, totalGoalAllocationsPaise: allocatedToGoals(goals.items), monthlySavingsPaise: monthlyCapacity, activeLoanOutstandingPaise: activeLoanOutstanding(loans.items) };
  const loading = !goals.loaded || !accounts.loaded || !loans.loaded || !user.profile || !transactions.loaded;
  const error = goals.error ?? accounts.error ?? loans.error ?? user.error ?? transactions.error;
  const retry = () => { void goals.load(true); void accounts.load(true); void loans.load(true); void user.load(true); void transactions.load(true); };
  if (compact) return <Card title="Little steps, big dreams" action={<Link to="/goals" className="flex items-center gap-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">All goals <ArrowUpRight size={14} /></Link>}><AsyncState loading={loading} error={error} onRetry={retry}>{goals.items.filter(goal => goal.status !== 'purchased').slice(0, 3).map(goal => <div key={goal.id} className="mb-5 last:mb-0"><div className="mb-2 flex items-center gap-3"><span className="rounded-lg bg-canvas p-2 text-indigo-600 dark:text-indigo-300"><Target size={16} aria-hidden="true" /></span><div className="flex-1"><p className="text-sm font-semibold text-ink">{goal.name}</p><p className="text-xs text-muted">{formatMoney(goal.savedPaise)} of {formatMoney(goal.targetPaise)}</p></div><span className="text-xs font-semibold text-ink">{Math.min(100, Math.round(goal.savedPaise / goal.targetPaise * 100))}%</span></div><ProgressBar value={goal.savedPaise / goal.targetPaise * 100} label={goal.name + ' savings progress'} tone={goal.status === 'achieved' ? 'positive' : 'brand'} /></div>)}</AsyncState></Card>;
  return <div className="space-y-6"><PageHeader eyebrow="MAKE SPACE FOR WHAT MATTERS" title="Your next chapter starts here." description="Save with intention. Celebrate the milestones. Keep your future in view." action={<CreateGoal />} /><AsyncState loading={loading} error={error} onRetry={retry}><div className="space-y-4">{goals.items.filter(goal => goal.status === 'achieved').map(goal => <GoalCelebration key={goal.id} goal={goal} action={<MarkGoalPurchased goal={goal} />} />)}</div><div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{goals.items.length ? goals.items.map(goal => <GoalCard key={goal.id} goal={goal} affordability={goalAffordability(goal, context)} estimatedDate={estimatedGoalCompletion(goal, monthlyCapacity / savingCount)} action={goal.status === 'saving' ? <ContributeToGoal goal={goal} /> : goal.status === 'achieved' ? <MarkGoalPurchased goal={goal} /> : undefined} />) : <EmptyState title="What would you love to save for?" description="Create a goal and make the first step feel smaller." action={<CreateGoal />} />}</div><p className="mt-5 text-xs leading-relaxed text-muted">Completion estimates share your monthly goal savings evenly across saving goals. Affordability estimates assess one purchase at a time after protecting the emergency target and reserving loan payoff funds.</p></AsyncState></div>;
}
