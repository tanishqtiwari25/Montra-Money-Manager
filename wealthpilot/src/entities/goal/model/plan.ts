import { create } from 'zustand';
import { ApiError } from '@shared/api';
import { errorMessage, formatDate } from '@shared/lib';
import { goalApi } from '../api/goal.api';
import type { Goal } from './types';
export interface PlannedGoal { goalId: string; availablePaise: number; remainingPaise: number; canBuyNow: boolean; waitMonths: number | null; estimatedBuyDate: string | null; reason: string; targetDateFeasible: boolean | null }
export interface GoalPlan { policyVersion: string; liquidPaise: number; emergencyProtectedPaise: number; livingBufferPaise: number; debtProtectedPaise: number; legacyAllocatedPaise: number; automaticPoolPaise: number; monthlyCapacityPaise: number; goals: PlannedGoal[]; assumptions: string[] }
export interface GoalPlanView { revision: string | number; asOf: string; plan: GoalPlan }
interface State { data: GoalPlanView | null; goals: Goal[]; loading: boolean; error: string | null; sequence: number; version: number; load: () => Promise<void>; invalidate: () => void; reset: () => void }
export const useGoalPlan = create<State>((set,get) => ({ data: null, goals: [], loading: false, error: null, sequence: 0, version: 0,
 reset: () => set(s => ({ data: null, goals: [], loading: false, error: null, sequence: s.sequence+1, version: s.version+1 })),
 invalidate: () => set(s => ({ loading: true, error: null, sequence: s.sequence+1, version: s.version+1 })),
 load: async () => { const sequence=get().sequence+1; set({sequence, loading:true, error:null}); try { const [goals,data]=await Promise.all([goalApi.list(),goalApi.plan()]); if(get().sequence!==sequence)return; if(data.plan.policyVersion!=='automatic-goals-v1'||!Array.isArray(data.plan.goals))throw new Error('The automatic goal plan contract is unavailable.'); const ids=new Set(goals.map(g=>g.id)); if(data.plan.goals.some(g=>!ids.has(g.goalId)))throw new Error('Goal details changed while planning. Refresh the plan.'); set({goals,data,loading:false}); } catch(cause:unknown) { if(get().sequence===sequence)set({loading:false,error:cause instanceof ApiError && cause.status===404 ? 'Automatic goal planning is not deployed on the backend yet. Please retry after the backend update.' : errorMessage(cause)}); } }
}));
export function plannedGoalStatus(goal: PlannedGoal): {label:string; tone:'positive'|'warning'|'neutral'|'brand'} { if(goal.canBuyNow)return {label:'Ready to buy',tone:'positive'}; if(goal.reason==='needs-profile')return {label:'Complete your plan',tone:'warning'}; if(goal.reason==='debt-first')return {label:'Clear debt first',tone:'warning'}; if(goal.reason==='protect-emergency-and-living-costs')return {label:'Protect essentials first',tone:'warning'}; return {label:goal.estimatedBuyDate ? 'Estimated '+formatDate(goal.estimatedBuyDate) : 'No estimate yet',tone:goal.estimatedBuyDate?'brand':'neutral'}; }
