import { z } from 'zod';
import { rupeeAmountSchema, rupeesToPaise } from '@shared/lib';
export function contributionSchema(remainingPaise: number) { return z.object({ amount: rupeeAmountSchema.refine(value => rupeesToPaise(value) <= remainingPaise, 'Contribution cannot exceed the amount remaining.') }); }
export type ContributionValues = { amount: number };
