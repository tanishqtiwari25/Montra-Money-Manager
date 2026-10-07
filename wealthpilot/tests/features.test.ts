import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { StaticRouter } from 'react-router-dom/server';
import { ApiError, resetMockData, failNextMockRequests, writeMockResource } from '../src/shared/api';
import { rupeeAmountSchema } from '../src/shared/lib';
import { transactionFormSchema, transactionFormToInput } from '../src/entities/transaction';
import { accountApi } from '../src/entities/account';
import { userApi } from '../src/entities/user';
import { loanApi, type Loan } from '../src/entities/loan';
import { goalApi, useGoals } from '../src/entities/goal';
import { notificationApi } from '../src/entities/notification';
import { createGoalSchema, goalFormToInput } from '../src/features/create-goal';
import { contributionSchema, announceGoalAchievement } from '../src/features/contribute-to-goal';
import { profileSchema, profileToForm, profileFormToInput } from '../src/features/edit-profile';
import { transactionFilterSchema, filtersToQuery, initialTransactionFilters } from '../src/features/filter-transactions';
import { useTheme } from '../src/features/toggle-theme';
import { cfoApi, useCfo, type CfoReplyId, type CfoRequest, type CfoResponse } from '../src/features/ask-cfo';
import { CfoRichCard } from '../src/features/ask-cfo/ui/CfoRichCard';

const storage = new Map<string, string>();
Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
  key: (index: number) => [...storage.keys()][index] ?? null,
  get length() { return storage.size; },
} });
let count = 0;
async function check(name: string, test: () => void | Promise<void>) { await test(); count++; console.log('PASS ' + name); }
function conversation() {
  const conversationId = crypto.randomUUID();
  return { conversationId, ask: (message: string, replyId?: CfoReplyId) => cfoApi.ask({ requestId: crypto.randomUUID(), conversationId, message, replyId }) };
}
function assertActions(response: CfoResponse) {
  assert.deepEqual(response.actions.map(action => action.kind), ['set-goal', 'show-payoff', 'remind']);
  assert.equal(response.actions.find(action => action.kind === 'remind')?.dueDate, '2027-04-07');
}
async function main() {
  resetMockData();
  await check('transaction validation, transfer account identity and exact paise conversion', () => {
    const values = { amount: 100.35, type: 'expense' as const, categoryId: 'shopping', date: '2026-10-07', note: ' Test ', paymentMethodId: 'hdfc', tags: 'personal, essential', destinationAccountId: '' };
    const parsed = transactionFormSchema.parse(values);
    assert.equal(transactionFormToInput(parsed).amountPaise, 10035);
    assert.deepEqual(transactionFormToInput(parsed).tags, ['personal', 'essential']);
    assert.equal(transactionFormSchema.safeParse({ ...values, amount: NaN }).success, false);
    assert.equal(transactionFormSchema.safeParse({ ...values, amount: -1 }).success, false);
    assert.equal(transactionFormSchema.safeParse({ ...values, amount: 1.005 }).success, false);
    assert.equal(transactionFormSchema.safeParse({ ...values, date: '2026-02-31' }).success, false);
    assert.equal(transactionFormSchema.safeParse({ ...values, type: 'transfer', paymentMethodId: 'hdfc-debit', destinationAccountId: 'hdfc' }).success, false);
    assert.equal(transactionFormSchema.safeParse({ ...values, type: 'transfer', paymentMethodId: 'hdfc-credit', destinationAccountId: 'sbi' }).success, false);
    assert.equal(transactionFormSchema.safeParse({ ...values, tags: '1,2,3,4,5,6,7,8,9' }).success, false);
    assert.equal(rupeeAmountSchema.safeParse(999999999.99).success, true);
  });
  await check('filter ranges reject contradictory dates/amounts and preserve zero minima', () => {
    assert.equal(transactionFilterSchema.safeParse({ ...initialTransactionFilters, from: '2026-10-07', to: '2026-10-01' }).success, false);
    assert.equal(transactionFilterSchema.safeParse({ ...initialTransactionFilters, min: '1000', max: '100' }).success, false);
    assert.equal(transactionFilterSchema.safeParse({ ...initialTransactionFilters, min: '1.005' }).success, false);
    const query = filtersToQuery(transactionFilterSchema.parse({ ...initialTransactionFilters, min: '0', max: '1000.25', type: 'expense' }));
    assert.equal(query.minPaise, 0); assert.equal(query.maxPaise, 100025); assert.equal(query.type, 'expense');
  });
  await check('goal, contribution and profile form boundary validation', async () => {
    const goal = { name: 'Camera', price: 25000, icon: 'sparkles', priority: 'high', targetDate: '', imageUrl: '' };
    assert.equal(goalFormToInput(createGoalSchema.parse(goal)).targetPaise, 2500000);
    assert.equal(createGoalSchema.safeParse({ ...goal, targetDate: '2026-10-01' }).success, false);
    assert.equal(createGoalSchema.safeParse({ ...goal, imageUrl: 'http://example.com/photo.png' }).success, false);
    assert.equal(contributionSchema(800000).safeParse({ amount: 8000.01 }).success, false);
    assert.equal(contributionSchema(800000).safeParse({ amount: 8000 }).success, true);
    const profile = profileToForm(await userApi.get());
    assert.equal(profileSchema.safeParse({ ...profile, monthlyGoalSavings: 70000 }).success, false);
    await assert.rejects(userApi.update(profileFormToInput({ ...profile, emergencyFund: 400000 })), (error: unknown) => error instanceof ApiError && error.code === 'VALIDATION');
    assert.equal((await userApi.get()).emergencyFundPaise, 4500000);
  });
  await check('achievement announcement is deduplicated under concurrent mounts', async () => {
    const goal = await goalApi.get('headphones'); useGoals.getState().upsert(goal);
    const results = await Promise.all([announceGoalAchievement(goal), announceGoalAchievement(goal)]);
    assert.equal(results.filter(Boolean).length, 1);
    assert.equal((await notificationApi.list()).filter(item => item.sourceKey === 'goal:headphones').length, 1);
    assert.equal(await announceGoalAchievement(goal), false);
  });
  await check('theme updates the document and persists the selected preference', () => {
    const classes = new Set<string>(); const style = { colorScheme: '' };
    Object.defineProperty(globalThis, 'document', { configurable: true, value: { documentElement: { classList: { toggle: (name: string, enabled: boolean) => enabled ? classes.add(name) : classes.delete(name) }, style } } });
    useTheme.getState().setTheme('dark'); assert.ok(classes.has('dark')); assert.equal(storage.get('wealthpilot.theme'), 'dark'); assert.equal(style.colorScheme, 'dark');
    useTheme.getState().toggle(); assert.equal(classes.has('dark'), false); assert.equal(storage.get('wealthpilot.theme'), 'light');
    Reflect.deleteProperty(globalThis, 'document');
  });
  resetMockData();
  await check('CFO initial loan rule, purchase impact, snapshot and simulated latency', async () => {
    const chat = conversation(); const started = performance.now(); const response = await chat.ask('Can I buy an iPhone?');
    const elapsed = performance.now() - started; assert.ok(elapsed >= 800 && elapsed < 2500, 'CFO elapsed ' + elapsed);
    assert.match(response.text, /clear your active loan first/i);
    assert.equal(response.snapshot.salaryPaise, 6000000);
    assert.equal(response.snapshot.liquidSavingsPaise, 42450000);
    assert.equal(response.snapshot.goalAllocationsPaise, 17400000);
    assert.equal(response.snapshot.creditCardDebtPaise, 3250000);
    const impact = response.cards.find(card => card.kind === 'impact'); assert.ok(impact);
    assert.equal(response.snapshot.monthlyExpensesPaise, 4119900);
    assert.equal(impact.goalDelays[0]?.months, 2); assert.equal(impact.waitMonths, 7);
    const payoff = response.cards.find(card => card.kind === 'loan-payoff'); assert.ok(payoff);
    assert.equal(payoff.loans[0]?.months, 7); assert.ok((payoff.loans[0]?.extraPaise ?? 0) > 0);
    assertActions(response);
  });
  await check('importance and status branch gently discourage and offer an alternative', async () => {
    const chat = conversation(); await chat.ask('Can I buy an iPhone?');
    const why = await chat.ask("It's very important for me.", 'importance'); assert.equal(why.state, 'awaiting-reason'); assert.equal(why.quickReplies.length, 4); assert.match(why.text, /why do you actually want it/i);
    const response = await chat.ask('For work', 'reason-status');
    assert.match(response.text, /impress friends/i); assert.match(response.text, /clear your active loan first/i);
    assert.ok(response.cards.some(card => card.kind === 'strategy' && card.options.some(option => option.costPaise === 2500000))); assertActions(response);
  });
  await check('work ROI and minor phone issue branch prefer repair', async () => {
    const chat = conversation(); await chat.ask('Can I buy an iPhone?'); await chat.ask('Important', 'importance');
    const work = await chat.ask('For work and income', 'reason-work'); assert.equal(work.state, 'awaiting-device'); assert.match(work.text, /whatsapp/i); assert.ok(work.cards.some(card => card.kind === 'roi' && card.breakEvenMonths === 13));
    const minor = await chat.ask('It has a major problem', 'device-minor');
    assert.match(minor.text, /repair assessment/i); assert.ok(minor.cards.some(card => card.kind === 'strategy' && card.options.some(option => option.costPaise === 250000))); assertActions(minor);
  });
  await check('major device issue offers the ₹70,000 salary-growth plan', async () => {
    const chat = conversation(); await chat.ask('Can I buy an iPhone?'); await chat.ask('Important', 'importance'); await chat.ask('Device problem', 'reason-device');
    const major = await chat.ask('My screen is broken'); const growth = major.cards.find(card => card.kind === 'salary-growth'); assert.ok(growth); assert.equal(growth.targetSalaryPaise, 7000000); assert.ok(growth.progressPercent > 85 && growth.progressPercent < 86); assert.match(major.text, /clear your active loan first/i); assertActions(major);
  });
  await check('other-reason free text and a new purchase reset the conversation branch', async () => {
    const chat = conversation(); await chat.ask('Can I buy an iPhone?'); await chat.ask('Important', 'importance');
    assert.equal((await chat.ask('Other', 'reason-other')).state, 'awaiting-detail');
    assert.equal((await chat.ask('It is a personal milestone.')).state, 'advice');
    const changed = await chat.ask('Can I buy a laptop for ₹1.5 lakh?'); assert.equal(changed.purchase.category, 'work-equipment'); assert.equal(changed.purchase.pricePaise, 15000000);
  });
  await check('Set as Goal and reminder actions are idempotent under repeated/concurrent clicks', async () => {
    const response = await conversation().ask('Can I buy an iPhone?');
    const goalAction = response.actions.find(action => action.kind === 'set-goal'); const reminderAction = response.actions.find(action => action.kind === 'remind'); assert.ok(goalAction); assert.ok(reminderAction);
    const [firstGoal, secondGoal] = await Promise.all([cfoApi.setGoal(goalAction), cfoApi.setGoal(goalAction)]); assert.equal(firstGoal.id, 'iphone'); assert.equal(firstGoal.id, secondGoal.id); assert.equal((await goalApi.list()).length, 4);
    const [firstReminder, secondReminder] = await Promise.all([cfoApi.remind(reminderAction), cfoApi.remind(reminderAction)]); assert.equal(firstReminder.id, secondReminder.id); assert.equal((await cfoApi.remind(reminderAction)).id, firstReminder.id);
    assert.equal((await notificationApi.listReminders()).length, 1); assert.equal((await notificationApi.list()).filter(item => item.sourceKey === 'reminder:' + firstReminder.id).length, 1);
  });
  await check('immediate request retries return the same response and revision', async () => {
    const request: CfoRequest = { requestId: crypto.randomUUID(), conversationId: crypto.randomUUID(), message: 'Can I buy an iPhone?' };
    const first = await cfoApi.ask(request); const second = await cfoApi.ask(request); assert.equal(first.id, second.id); assert.equal(first.revision, second.revision);
  });
  await check('cancelled and invalid requests do not advance the conversation', async () => {
    const request: CfoRequest = { requestId: crypto.randomUUID(), conversationId: crypto.randomUUID(), message: 'Can I buy an iPhone?' };
    const controller = new AbortController(); const pending = cfoApi.ask(request, { signal: controller.signal }); setTimeout(() => controller.abort(), 450);
    await assert.rejects(pending, (error: unknown) => error instanceof ApiError && error.code === 'ABORTED'); assert.equal((await cfoApi.ask(request)).revision, 1);
    await assert.rejects(cfoApi.ask({ ...request, message: '' }), (error: unknown) => error instanceof ApiError && error.code === 'VALIDATION');
  });
  await check('chat store retry recovers a failed message without duplicate bubbles', async () => {
    useCfo.getState().reset(); failNextMockRequests(); await useCfo.getState().send('Can I buy an iPhone?');
    const failed = useCfo.getState().messages[0]; assert.ok(failed && failed.role === 'user'); assert.equal(failed.status, 'failed');
    await useCfo.getState().retry(failed.id); assert.equal(useCfo.getState().messages.length, 2); assert.equal(useCfo.getState().error, null);
    useCfo.getState().reset(); await Promise.all([useCfo.getState().send('Can I buy an iPhone?'), useCfo.getState().send('Can I buy a laptop?')]); assert.equal(useCfo.getState().messages.length, 2);
  });
  resetMockData();
  await check('without loans and with full emergency reserve, purchase advice reflects affordability', async () => {
    const loans = await loanApi.list(); writeMockResource<Loan>('loans', loans.map(loan => ({ ...loan, status: 'paid', outstandingPaise: 0 })));
    const user = await userApi.get(); await userApi.update({ name: user.name, email: user.email, occupation: user.occupation, monthlySalaryPaise: user.monthlySalaryPaise, monthlyGoalSavingsPaise: user.monthlyGoalSavingsPaise, emergencyFundPaise: user.emergencyTargetPaise, emergencyTargetPaise: user.emergencyTargetPaise });
    const response = await conversation().ask('Can I buy an iPhone?'); assert.doesNotMatch(response.text, /clear your active loan first/i); assert.equal(response.cards.find(card => card.kind === 'impact')?.waitMonths, 0); assert.equal(response.snapshot.emergencyProgressPercent, 100);
  });
  resetMockData();
  await check('zero surplus or a non-amortizing loan yields no invented safe purchase date', async () => {
    const user = await userApi.get(); await userApi.update({ name: user.name, email: user.email, occupation: user.occupation, monthlySalaryPaise: 2000000, monthlyGoalSavingsPaise: 1000000, emergencyFundPaise: user.emergencyFundPaise, emergencyTargetPaise: user.emergencyTargetPaise });
    const lowIncome = await conversation().ask('Can I buy an iPhone?'); assert.equal(lowIncome.cards.find(card => card.kind === 'impact')?.recommendedBuyDate, null); assert.match(lowIncome.text, /pause this purchase/i);
    resetMockData(); const loans = await loanApi.list(); writeMockResource<Loan>('loans', loans.map(loan => ({ ...loan, annualInterestRate: 200 })));
    const costlyDebt = await conversation().ask('Can I buy an iPhone?'); const plan = costlyDebt.cards.find(card => card.kind === 'loan-payoff'); assert.ok(plan); assert.equal(plan.loans[0]?.months, null); assert.equal(costlyDebt.cards.find(card => card.kind === 'impact')?.recommendedBuyDate, null);
  });
  await check('rich-card renderer handles the typed response and null-date state', async () => {
    const response = await conversation().ask('Can I buy an iPhone?');
    for (const card of response.cards) {
      const markup = renderToStaticMarkup(createElement(StaticRouter, { location: '/ask-cfo' }, createElement(CfoRichCard, { card })));
      assert.ok(markup.includes(card.title));
      if (card.kind === 'impact') assert.ok(markup.includes('No safe date yet'));
    }
  });
  resetMockData();
  assert.equal((await accountApi.get('hdfc')).balancePaise, 25200000);
  console.log('Completed ' + count + ' behavior groups.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
