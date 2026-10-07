import { z } from 'zod';
export const purchaseGoalSchema = z.object({ paymentAccountId: z.string().min(1, 'Choose a payment account.') });
export type PurchaseGoalValues = z.infer<typeof purchaseGoalSchema>;
