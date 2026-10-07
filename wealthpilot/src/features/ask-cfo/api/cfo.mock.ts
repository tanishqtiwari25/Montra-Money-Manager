import { ApiError, mockCollection, mockRequest, type RequestOptions } from '@shared/api';
import { DEMO_MONTH, DEMO_TODAY } from '@shared/config';
import { addMonths, formatMoney } from '@shared/lib';
import { accountApi, liquidBalance } from '@entities/account';
import { cardApi, creditCardDebt } from '@entities/card';
import { userApi, emergencyFundHealth, monthlyGoalCapacity } from '@entities/user';
import { goalApi, allocatedToGoals, type Goal } from '@entities/goal';
import { loanApi, activeLoanOutstanding, type Loan } from '@entities/loan';
import { transactionApi, transactionTotals } from '@entities/transaction';
import { notificationApi, type Reminder } from '@entities/notification';
import { cfoRequestSchema } from '../model/schema';
import { payoffMonths } from '../lib/loan-plan';
import type { CfoApi, CfoRequest, CfoResponse, CfoPurchase, CfoSnapshot, CfoStage, CfoQuickReply, CfoRichCard, CfoAction, CfoLoanPlanCard, CfoImpactCard, CfoSalaryCard } from '../model/types';

interface Context { snapshot: CfoSnapshot; goals: Goal[]; loans: Loan[] }
interface Session { id: string; state: CfoStage; purchase: CfoPurchase; revision: number; lastRequestId?: string; lastResponse?: CfoResponse }
interface ActionReceipt { id: string; kind: 'goal' | 'reminder'; resourceId: string }
const sessions = mockCollection<Session>('cfo-sessions', () => []);
const receipts = mockCollection<ActionReceipt>('cfo-actions', () => []);
const goalLocks = new Map<string, Promise<Goal>>();
const reminderLocks = new Map<string, Promise<Reminder>>();
function locked<T>(map: Map<string, Promise<T>>, key: string, operation: () => Promise<T>): Promise<T> {
  const existing = map.get(key); if (existing) return existing;
  const pending = operation(); map.set(key, pending);
  void pending.finally(() => map.delete(key)).catch(() => undefined);
  return pending;
}
async function collectContext(options?: RequestOptions): Promise<Context> {
  const [accounts, cards, user, goals, loans, transactions] = await Promise.all([
    accountApi.list(options), cardApi.list(options), userApi.get(options), goalApi.list(options), loanApi.list(options), transactionApi.list({ from: DEMO_MONTH + '-01', to: DEMO_MONTH + '-31', pageSize: 500 }, options),
  ]);
  const expenses = transactionTotals(transactions.items).expensePaise;
  return { goals, loans: loans.filter(loan => loan.status === 'active' && loan.outstandingPaise > 0), snapshot: {
    salaryPaise: user.monthlySalaryPaise, liquidSavingsPaise: liquidBalance(accounts), goalAllocationsPaise: allocatedToGoals(goals),
    emergencyFundPaise: user.emergencyFundPaise, emergencyTargetPaise: user.emergencyTargetPaise, emergencyProgressPercent: emergencyFundHealth(user),
    activeLoanOutstandingPaise: activeLoanOutstanding(loans), creditCardDebtPaise: creditCardDebt(cards), monthlyExpensesPaise: expenses,
    monthlySavingsPaise: Math.max(0, user.monthlySalaryPaise - expenses), monthlyGoalSavingsPaise: monthlyGoalCapacity(user, expenses),
  } };
}
const reasonReplies: CfoQuickReply[] = [
  { id: 'reason-work', label: 'For work', message: 'I need it for work and income.' },
  { id: 'reason-status', label: 'To show off to friends', message: 'I want to show off to my friends.' },
  { id: 'reason-device', label: 'Current device has a problem', message: 'My current device has a problem.' },
  { id: 'reason-other', label: 'Other', message: 'There is another reason.' },
];
const deviceReplies: CfoQuickReply[] = [
  { id: 'device-minor', label: 'Minor app or WhatsApp issues', message: 'It only has minor app or WhatsApp issues.' },
  { id: 'device-major', label: 'Major hardware problem', message: 'It has a major hardware problem.' },
  { id: 'device-okay', label: 'It works fine', message: 'My current phone works fine.' },
];
const followUpReplies: CfoQuickReply[] = [
  { id: 'importance', label: "It's very important for me", message: "It's very important for me." },
  { id: 'review-plan', label: 'Review my purchase plan', message: 'Review my purchase plan.' },
];
function inferPurchase(request: CfoRequest, previous: CfoPurchase, goals: Goal[]): CfoPurchase {
  if (request.purchase) return request.purchase;
  const phone = request.replyId === 'purchase-phone' || (!request.replyId && /\b(iphone|phone)\b/i.test(request.message));
  const laptop = request.replyId === 'purchase-laptop' || (!request.replyId && /\b(laptop|macbook)\b/i.test(request.message));
  const travel = !request.replyId && /\b(goa|trip|holiday)\b/i.test(request.message);
  if (!phone && !laptop && !travel) return previous;
  const goal = goals.find(item => item.status !== 'purchased' && (phone ? item.icon === 'phone' : laptop ? item.icon === 'laptop' : item.icon === 'plane'));
  const priceMatch = request.message.match(/(?:₹|rs\.?\s*|inr\s*|for\s+|costs?\s+|worth\s+)([\d,]+(?:\.\d{1,2})?)\s*(lakh|lac|crore|cr|k)?/i);
  const raw = priceMatch ? Number(priceMatch[1]?.replaceAll(',', '')) : 0;
  const suffix = priceMatch?.[2]?.toLowerCase();
  const scale = suffix === 'lakh' || suffix === 'lac' ? 100000 : suffix === 'cr' || suffix === 'crore' ? 10000000 : suffix === 'k' ? 1000 : 1;
  const inferred = Math.round(raw * scale * 100);
  const price = Number.isSafeInteger(inferred) && inferred > 0 && inferred <= 99999999999 ? inferred : goal?.targetPaise ?? (phone ? 10000000 : laptop ? 12000000 : 4000000);
  return { name: goal?.name ?? (phone ? 'iPhone' : laptop ? 'Work laptop' : 'Goa trip'), pricePaise: price, category: phone ? 'phone' : laptop ? 'work-equipment' : 'other' };
}
function loanPlan(context: Context): CfoLoanPlanCard {
  const extraPool = Math.min(context.snapshot.monthlyGoalSavingsPaise, Math.floor(context.snapshot.monthlySavingsPaise / 200) * 100);
  const extra = context.loans.length ? Math.floor(extraPool / context.loans.length / 100) * 100 : 0;
  return { kind: 'loan-payoff', title: 'Clear debt, then make the purchase', loans: context.loans.map(loan => {
    const monthlyPayment = loan.emiPaise + extra;
    const months = payoffMonths(loan.outstandingPaise, loan.annualInterestRate, monthlyPayment);
    return { name: loan.name, outstandingPaise: loan.outstandingPaise, emiPaise: loan.emiPaise, extraPaise: extra, monthlyPaymentPaise: monthlyPayment, months, payoffDate: months === null ? null : addMonths(DEMO_TODAY, months) };
  }), explanation: context.loans.length ? 'Redirect up to half of your current monthly surplus, capped at your goal savings plan, to extra repayments. Existing emergency savings stay reserved. Estimates assume a fixed rate and no prepayment fees; confirm lender terms before paying.' : 'You have no active loans. Your next purchase can be planned around savings and your emergency fund.' };
}
function impact(purchase: CfoPurchase, context: Context, plan: CfoLoanPlanCard): CfoImpactCard {
  const ownGoal = context.goals.find(goal => goal.status !== 'purchased' && goal.name.toLowerCase() === purchase.name.toLowerCase() && goal.targetPaise === purchase.pricePaise);
  const ownSavings = ownGoal?.savedPaise ?? 0;
  const unallocated = Math.max(0, context.snapshot.liquidSavingsPaise - context.snapshot.emergencyFundPaise - context.snapshot.goalAllocationsPaise);
  const emergencyGap = Math.max(0, context.snapshot.emergencyTargetPaise - context.snapshot.emergencyFundPaise);
  const reserveGap = Math.max(0, purchase.pricePaise - ownSavings + emergencyGap + context.snapshot.activeLoanOutstandingPaise - unallocated);
  const delayMonths = reserveGap > 0 && context.snapshot.monthlySavingsPaise > 0 ? Math.ceil(reserveGap / context.snapshot.monthlySavingsPaise) : 0;
  const slowestLoan = Math.max(0, ...plan.loans.map(loan => loan.months ?? 600));
  const blocked = plan.loans.some(loan => loan.months === null) || (reserveGap > 0 && context.snapshot.monthlySavingsPaise <= 0);
  const waitMonths = blocked ? null : reserveGap === 0 && context.loans.length === 0 ? 0 : Math.max(6, delayMonths, slowestLoan);
  const atRisk = purchase.pricePaise > unallocated + ownSavings;
  const affected = context.goals.find(goal => goal.id !== ownGoal?.id && goal.status === 'saving' && goal.priority === 'high');
  return { kind: 'impact', title: 'Your purchase impact', purchasePricePaise: purchase.pricePaise, unallocatedSavingsPaise: unallocated,
    goalDelays: affected && delayMonths > 0 ? [{ goalName: affected.name, months: delayMonths }] : [],
    emergencyLabel: atRisk ? 'Existing emergency savings could be at risk' : emergencyGap > 0 ? 'Current reserve protected · target not yet funded' : 'Emergency fund protected',
    emergencyTone: atRisk ? 'negative' : emergencyGap > 0 ? 'warning' : 'positive',
    recommendedBuyDate: waitMonths === null ? null : addMonths(DEMO_TODAY, waitMonths), waitMonths,
    explanation: 'Planning estimate reserves the full emergency target and loan payoff funds before discretionary purchases. Other goals keep their existing allocations; future savings are shared, so this is a scenario estimate rather than a promise.' };
}
function growthCard(snapshot: CfoSnapshot): CfoSalaryCard {
  const target = Math.max(7000000, snapshot.salaryPaise);
  return { kind: 'salary-growth', title: 'Grow income before upgrading', currentSalaryPaise: snapshot.salaryPaise, targetSalaryPaise: target, progressPercent: Math.min(100, snapshot.salaryPaise / target * 100), steps: ['Choose one skill that can improve your earning potential.', 'Build a portfolio or test a small paid project.', 'Review your monthly income and purchase plan after loan payoff.'] };
}
function actionsFor(request: CfoRequest, purchase: CfoPurchase, context: Context): CfoAction[] {
  const existing = context.goals.find(goal => goal.status !== 'purchased' && goal.name.toLowerCase() === purchase.name.toLowerCase() && goal.targetPaise === purchase.pricePaise);
  return [
    { kind: 'set-goal', label: 'Set as Goal', goal: { name: purchase.name, targetPaise: purchase.pricePaise, icon: purchase.category === 'phone' ? 'phone' : purchase.category === 'work-equipment' ? 'laptop' : 'sparkles', priority: 'high' }, existingGoalId: existing?.id, idempotencyKey: 'cfo-goal:' + request.requestId },
    { kind: 'show-payoff', label: 'Show payoff plan', message: 'Show my loan payoff plan.', replyId: 'payoff-plan' },
    { kind: 'remind', label: 'Remind me in 6 months', title: 'Review the ' + purchase.name + ' purchase plan', dueDate: addMonths(DEMO_TODAY, 6), idempotencyKey: 'cfo-reminder:' + request.requestId },
  ];
}
function isPurchaseRequest(request: CfoRequest): boolean { return Boolean(request.purchase) || request.replyId === 'purchase-phone' || request.replyId === 'purchase-laptop' || (!request.replyId && /\b(buy|purchase|afford)\b/i.test(request.message)); }
function decide(request: CfoRequest, session: Session, context: Context): CfoResponse {
  const plan = loanPlan(context);
  const purchase = session.purchase;
  const impactCard = impact(purchase, context, plan);
  const loanRule = context.loans.length ? 'Clear your active loan first, then make this purchase. ' : '';
  let state: CfoStage = 'advice';
  let text = '';
  let quickReplies = followUpReplies;
  let cards: CfoRichCard[] = [impactCard, ...(context.loans.length ? [plan] : [])];
  const important = request.replyId === 'importance' || (!request.replyId && /very important|really important/i.test(request.message));
  const newPurchase = isPurchaseRequest(request);
  const awaitingReason = session.state === 'awaiting-reason' || session.state === 'awaiting-detail';
  const isWork = request.replyId === 'reason-work' || (!request.replyId && awaitingReason && /work|income|job|business/i.test(request.message));
  const isStatus = request.replyId === 'reason-status' || (!request.replyId && awaitingReason && /show off|friends|impress|status/i.test(request.message));
  const isDevice = request.replyId === 'reason-device' || (!request.replyId && awaitingReason && /problem|broken|device/i.test(request.message));
  if (request.replyId === 'payoff-plan' || (!request.replyId && /payoff plan|clear my loan|repay my loan/i.test(request.message))) {
    text = context.loans.length ? 'Here is a repayment plan that preserves your current emergency savings. Once the loan is cleared, review the purchase alongside your emergency target.' : 'There are no active loans in your snapshot. Keep your emergency reserve intact and build your purchase goal.';
    cards = [plan];
  } else if (important) {
    state = 'awaiting-reason'; text = 'Why do you actually want it? Understanding the reason will help us make a plan you feel good about.'; quickReplies = reasonReplies;
  } else if (isStatus) {
    text = 'Wanting to fit in is understandable. A purchase just to impress friends is unlikely to improve your finances. Keep your current device or choose a lower-cost option after debt payoff.';
    cards.push({ kind: 'strategy', title: 'A calmer way forward', options: [{ name: 'Keep what you have', description: 'Put the upgrade money toward debt and your emergency target.', costPaise: 0 }, { name: 'A budget-friendly alternative', description: 'Use a ₹25,000 ceiling for a replacement only after the loan is cleared.', costPaise: 2500000 }, { name: 'Wait and review', description: 'Revisit the decision in six months with a clearer savings buffer.' }] });
  } else if (isWork) {
    text = 'An income-generating tool can be worthwhile. Validate how it will earn back its cost and plan the purchase after loan payoff.';
    cards.push({ kind: 'roi', title: 'Test the return on this purchase', purchasePricePaise: purchase.pricePaise, potentialMonthlyIncomePaise: 800000, breakEvenMonths: Math.ceil(purchase.pricePaise / 800000), explanation: 'Illustrative scenario: an additional ₹8,000 a month from paid work. Validate this opportunity before committing; extra income is not guaranteed.' });
    if (purchase.category === 'phone') { state = 'awaiting-device'; text += ' Is your current phone having a problem, such as WhatsApp or app issues?'; quickReplies = deviceReplies; }
  } else if (isDevice) {
    state = 'awaiting-device'; text = purchase.category === 'phone' ? 'Is your current phone having a problem, such as WhatsApp or app issues? Tell me whether it is a minor software issue or a major hardware problem.' : 'Is your current device having a minor software issue or a major hardware problem?'; quickReplies = deviceReplies;
  } else if (request.replyId === 'reason-other') {
    state = 'awaiting-detail'; text = 'What would this purchase change in your daily life? Tell me the reason in one sentence.'; quickReplies = [];
  } else if (session.state === 'awaiting-device' && !newPurchase) {
    const major = request.replyId === 'device-major' || (!request.replyId && /major|hardware|broken.*screen|screen.*broken|does not turn on|won.t turn on/i.test(request.message));
    const minor = request.replyId === 'device-minor' || (!request.replyId && /minor|whatsapp|app issue|software|slow/i.test(request.message));
    const okay = request.replyId === 'device-okay' || (!request.replyId && /works fine|no problem|working well/i.test(request.message));
    if (major) {
      const target = Math.max(7000000, context.snapshot.salaryPaise);
      text = context.snapshot.salaryPaise < target ? 'A major device problem deserves a practical plan. Increase your monthly income to about ' + formatMoney(target) + ', clear the loan, and review the purchase once your emergency target is covered.' : 'Your salary already meets the ₹70,000 planning threshold. Clear active debt and cover the emergency target before upgrading.';
      cards.push(growthCard(context.snapshot));
    } else if (minor) {
      text = 'For a minor WhatsApp or app issue, try updates, storage cleanup or a repair assessment before buying a new phone. Set a small repair budget and keep the upgrade savings working for your goals.';
      cards.push({ kind: 'strategy', title: 'Repair before replacing', options: [{ name: 'Start with software fixes', description: 'Update the app and operating system, review storage, and back up your data.', costPaise: 0 }, { name: 'Get a repair assessment', description: 'Use an illustrative ₹2,500 repair ceiling; compare a technician’s actual quote.', costPaise: 250000 }] });
    } else if (okay) text = 'If your current phone works well, keep it for now. Use the extra time to clear debt and finish your emergency buffer, then revisit the upgrade.';
    else { state = 'awaiting-device'; text = 'Tell me which best describes the problem with your current phone.'; quickReplies = deviceReplies; }
  } else if (session.state === 'awaiting-detail' && !newPurchase) {
    text = 'Thanks for explaining. Treat this as a planned purchase: keep essential savings reserved, clear active debt, then reassess whether it still improves your daily life.';
    cards.push({ kind: 'strategy', title: 'Make the decision deliberately', options: [{ name: 'Write down the benefit', description: 'Describe the everyday problem the purchase solves.' }, { name: 'Use a cooling-off period', description: 'Review the benefit alongside debt payoff and your emergency target.' }] });
  } else if (session.state === 'awaiting-reason' && !newPurchase) {
    state = 'awaiting-reason'; text = 'Which reason comes closest to what you need? You can also describe it in your own words.'; quickReplies = reasonReplies;
  } else {
    const delay = impactCard.goalDelays[0];
    text = 'For ' + purchase.name + ' at ' + formatMoney(purchase.pricePaise) + ', ';
    text += impactCard.waitMonths === null ? 'pause this purchase until you have a monthly surplus and a viable loan payoff plan. ' : impactCard.waitMonths > 0 ? 'waiting about ' + impactCard.waitMonths + ' months gives your debt and emergency plan more breathing room. ' : 'your current unallocated savings can cover the purchase while reserving your emergency target. ';
    text += delay ? 'Buying now could postpone your ' + delay.goalName + ' plan by about ' + delay.months + ' months.' : 'Your existing goal allocations stay protected in this scenario.';
  }
  return { id: crypto.randomUUID(), conversationId: request.conversationId, revision: session.revision + 1, state, text: loanRule + text, createdAt: new Date().toISOString(), purchase, snapshot: context.snapshot, quickReplies, cards, actions: actionsFor(request, purchase, context) };
}
export const cfoApi: CfoApi = {
  getSnapshot: async options => (await collectContext(options)).snapshot,
  ask: async (input, options) => {
    const parsed = cfoRequestSchema.safeParse(input);
    if (!parsed.success) throw new ApiError('VALIDATION', parsed.error.issues[0]?.message ?? 'Invalid CFO request.');
    const request: CfoRequest = parsed.data;
    const context = await collectContext(options);
    // Parallel entity mocks take 350 ms; this adds 550 ms for a 900 ms response.
    return mockRequest(() => {
      const items = sessions.read();
      const existing = items.find(session => session.id === request.conversationId);
      if (existing?.lastRequestId === request.requestId && existing.lastResponse) return existing.lastResponse;
      const previous = existing ?? { id: request.conversationId, state: 'ready' as const, purchase: { name: 'iPhone', pricePaise: 10000000, category: 'phone' as const }, revision: 0 };
      const isNewPurchase = isPurchaseRequest(request);
      const session: Session = { ...previous, purchase: isNewPurchase ? inferPurchase(request, previous.purchase, context.goals) : previous.purchase, state: isNewPurchase ? 'ready' : previous.state };
      const response = decide(request, session, context);
      const updated: Session = { ...session, state: response.state, revision: response.revision, lastRequestId: request.requestId, lastResponse: response };
      sessions.write([...items.filter(item => item.id !== session.id), updated].slice(-50));
      return response;
    }, options, 550);
  },
  setGoal: (action, options) => locked(goalLocks, action.goal.name.trim().toLowerCase() + ':' + action.goal.targetPaise, async () => {
    const receipt = receipts.read().find(item => item.id === action.idempotencyKey && item.kind === 'goal');
    if (receipt) return goalApi.get(receipt.resourceId, options);
    const goals = await goalApi.list(options);
    const existing = goals.find(goal => goal.status !== 'purchased' && goal.name.toLowerCase() === action.goal.name.trim().toLowerCase() && goal.targetPaise === action.goal.targetPaise);
    const goal = existing ?? await goalApi.create(action.goal, options);
    receipts.write([...receipts.read(), { id: action.idempotencyKey, kind: 'goal', resourceId: goal.id }]); return goal;
  }),
  remind: (action, options) => locked(reminderLocks, action.idempotencyKey, async () => {
    const receipt = receipts.read().find(item => item.id === action.idempotencyKey && item.kind === 'reminder');
    const existing = receipt ? (await notificationApi.listReminders(options)).find(item => item.id === receipt.resourceId) : undefined;
    const reminder = existing ?? await notificationApi.createReminder({ title: action.title, dueDate: action.dueDate }, options);
    if (!receipt) receipts.write([...receipts.read(), { id: action.idempotencyKey, kind: 'reminder', resourceId: reminder.id }]);
    await notificationApi.create({ kind: 'reminder', title: 'Purchase reminder set', message: action.title + ' · ' + action.dueDate, href: '/goals', sourceKey: 'reminder:' + reminder.id }, options);
    return reminder;
  }),
};
