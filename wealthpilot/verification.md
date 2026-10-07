# WealthPilot verification

Verified on 8 October 2026. Demo accounting and planning use the fixed 7 October 2026 snapshot.

## Automated checks

- Strict TypeScript compilation: passed.
- ESLint, including strict FSD layer and public API boundaries: passed with zero warnings.
- Domain tests: 9 behavior groups passed.
- Feature/CFO tests: 17 behavior groups passed.
- Architecture probes: all 6 forbidden-import cases rejected.
- Vite production build: passed, 2,923 modules transformed. Source, local fonts and compiled SPA are included in the final ZIP.

Vite reports one size warning: the shared Recharts chunk is about 553 kB minified (157 kB gzip). Pages are lazy-loaded and chart components are memoized. This is a performance consideration, not a build failure.

## Browser checks

All nine routes rendered: dashboard, transactions, accounts, budgets, loans, goals, reports, settings and Ask CFO.

- Dashboard snapshot: liquid balance ₹4,24,500; income ₹60,000; expenses ₹41,199; savings rate 31.3%; net worth ₹6,22,000. Income/expense, category donut and cash-flow charts rendered.
- Transaction form: created a ₹123.45 expense, edited it to ₹150, and found the updated row using global search while already on the transaction route. Pagination and payment-method labels rendered.
- Goal workflow: contributed ₹8,000 to the iPhone, observed the achieved banner and ₹1,00,000 progress, then recorded the purchase from HDFC. The goal became Purchased and HDFC/debit-card balances became ₹1,51,850, including the ₹150 test expense.
- Accounts, credit utilization/due dates, budget warnings, loan principal/EMI/rate/due date, monthly reports and category trends rendered. Yearly export preview showed the selected year totals; Escape dismissed its dialog.
- CFO: submitted the iPhone quick reply, observed the thinking status, rendered impact/payoff cards and a 7-month plan, then used the importance follow-up to obtain reason choices. All remaining branches and failure/idempotency cases are covered by the automated feature suite.
- Theme: dark mode survived reload; light and dark desktop layouts visually checked. Restored light mode.
- Notifications: dropdown displayed goal achievement, bill due and budget exceeded items; marking all as read worked.
- Reset: restored the initial financial snapshot after all test mutations.
- Responsive: desktop sidebar/five KPIs and narrow bottom navigation/stacked cards visually checked. The browser's narrow override reported a 470 CSS-pixel viewport with scrollWidth equal to clientWidth; it did not provide an exact 390 CSS-pixel viewport. Temporary viewport overrides were reset.
- Captured browser error/warning logs were empty after final checks. This was a functional and visual smoke test, not a complete accessibility audit or every-device test.

## Scope

Frontend demonstration only. All financial records and CFO reasoning are mock data. Reminders stay inside the app; export is a preview. No backend, authentication, external AI, real payments or public deployment was added. The original MONTRA project remains untouched.

The README lists run commands, mock files to replace, FSD rules and the CFO request/response contract. Screenshots are supplied alongside the ZIP.
