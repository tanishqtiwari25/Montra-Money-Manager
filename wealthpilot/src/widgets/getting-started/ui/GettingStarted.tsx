import { Link } from 'react-router-dom';
import { Check, ArrowUpRight, Wallet, ListPlus, Target } from 'lucide-react';
import { useAccounts } from '@entities/account';
import { useTransactions } from '@entities/transaction';
import { useGoals } from '@entities/goal';
export function GettingStarted(){
 const accounts=useAccounts();const transactions=useTransactions();const goals=useGoals();
 if(!accounts.loaded||!transactions.loaded||!goals.loaded)return null;
 const steps=[{title:'Add your first account',description:'Bank, wallet or cash. Start with its current balance.',to:'/accounts',done:accounts.items.length>0,icon:Wallet},{title:'Record an expense',description:'Add something you spent money on today.',to:'/transactions',done:transactions.items.some(item=>item.type==='expense'),icon:ListPlus},{title:'Choose a savings goal',description:'Give your next purchase a price and priority.',to:'/goals',done:goals.items.length>0,icon:Target}];
 const completed=steps.filter(s=>s.done).length;if(completed===3)return null;
 return <section className="getting-started" aria-labelledby="setup-heading"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-medium text-muted">A little setup goes a long way</p><h2 id="setup-heading" className="mt-1 text-xl font-semibold text-ink">Make this space yours</h2></div><span className="text-sm text-muted">{completed} of 3 steps complete</span></div><div className="grid gap-3 md:grid-cols-3">{steps.map(step=><Link key={step.to} to={step.to} className={'setup-step '+(step.done?'is-complete':'')}><span className="setup-step-icon">{step.done?<Check size={20} aria-label="Complete"/>:<step.icon size={20} aria-hidden="true"/>}</span><span className="min-w-0"><span className="block font-semibold">{step.title}</span><span className="mt-1 block text-sm leading-relaxed text-muted">{step.description}</span></span>{!step.done&&<ArrowUpRight size={16} className="ml-auto shrink-0" aria-hidden="true"/>}</Link>)}</div></section>;
}
