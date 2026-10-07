import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Goal } from '@entities/goal';
export function GoalCelebration({ goal, action }: { goal: Goal; action?: ReactNode }) {
  const reduced = useReducedMotion();
  return <motion.div role="status" initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-card border border-emerald-300 bg-gradient-to-r from-emerald-50 to-teal-50 p-6 dark:border-emerald-800 dark:from-emerald-950 dark:to-teal-950"><div className="relative flex flex-wrap items-center gap-4"><span className="rounded-2xl bg-emerald-100 p-3 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"><Sparkles size={26} aria-hidden="true" /></span><div className="flex-1"><p className="mb-1 text-xs font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-200">Goal achieved</p><h3 className="font-semibold text-ink">You can now afford {goal.name} based on your salary and savings.</h3><p className="mt-1 text-sm text-muted">A little consistency brought you here. Enjoy this milestone.</p></div>{action}</div>{!reduced && <motion.span aria-hidden="true" animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: 2 }} className="pointer-events-none absolute -right-4 -top-4 text-emerald-500/15"><Sparkles size={120} /></motion.span>}</motion.div>;
}
