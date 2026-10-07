import { z } from 'zod';
import { calendarDateSchema, rupeeAmountSchema, rupeesToPaise } from '@shared/lib';
import { DEMO_TODAY } from '@shared/config';
import type { GoalInput } from '@entities/goal';
export const createGoalSchema = z.object({
  name: z.string().trim().min(1, 'Name your goal.').max(80), price: rupeeAmountSchema,
  targetDate: z.union([z.literal(''), calendarDateSchema.refine(value => value >= DEMO_TODAY, 'Choose today or a future date.')]),
  imageUrl: z.union([z.literal(''), z.string().url('Use a valid image URL.').refine(value => value.startsWith('https://'), 'Use an HTTPS image URL.')]),
  icon: z.enum(['phone', 'laptop', 'plane', 'headphones', 'sparkles']), priority: z.enum(['high', 'medium', 'low']),
});
export type CreateGoalValues = z.infer<typeof createGoalSchema>;
export function goalFormToInput(value: CreateGoalValues): GoalInput { return { name: value.name.trim(), targetPaise: rupeesToPaise(value.price), icon: value.icon, priority: value.priority, ...(value.targetDate ? { targetDate: value.targetDate } : {}), ...(value.imageUrl ? { imageUrl: value.imageUrl } : {}) }; }
