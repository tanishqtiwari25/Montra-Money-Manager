import { z } from 'zod';
export const cfoMessageSchema = z.object({ message: z.string().trim().min(1, 'Ask your CFO a question.').max(2000, 'Keep your message under 2,000 characters.') });
export const cfoRequestSchema = cfoMessageSchema.extend({
  requestId: z.string().uuid(), conversationId: z.string().uuid(),
  replyId: z.enum(['purchase-phone', 'purchase-laptop', 'importance', 'reason-work', 'reason-status', 'reason-device', 'reason-other', 'device-minor', 'device-major', 'device-okay', 'payoff-plan', 'review-plan']).optional(),
  purchase: z.object({ name: z.string().trim().min(1).max(80), pricePaise: z.number().int().positive().max(99999999999), category: z.enum(['phone', 'work-equipment', 'other']) }).optional(),
});
export type CfoMessageValues = z.infer<typeof cfoMessageSchema>;
