# WealthPilot

A complete frontend demo of a personal money manager and a scripted personal CFO. Rebuilt from MONTRA using React 18, TypeScript, Vite 5, Tailwind 3, React Router 6, Zustand, Recharts, Framer Motion, Lucide, React Hook Form and Zod. Inter is bundled locally. No original MONTRA files or authentication configuration were changed or copied.

## Run

Requires Node.js 20.19+ or a compatible newer release and npm.

~~~sh
npm ci
npm run dev
~~~

Open the local URL printed by Vite (normally http://localhost:3000). To check and preview a production build:

~~~sh
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
~~~

The ZIP includes source, configs, the dependency lockfile, portable behavior tests and build output. It excludes node_modules. No backend or credentials are needed.

## Routes and behavior

- /dashboard: five KPIs, 6/12-month income/expense trend, category donut, cash-flow bars, recent activity, goals, emergency reserve, upcoming bills and embedded CFO chat.
- /transactions: search/date/category/account/card/type/amount filters, sorting, pagination, validated add/edit forms and payment badges.
- /accounts: three banks, credit/debit cards, wallet, cash, investments, utilization/due dates and payment-method spending.
- /budgets: category usage and over-budget warnings.
- /loans: outstanding principal, rate, EMI, due date, payoff progress and months remaining.
- /goals: creation, icons/images, contribution, completion estimate, affordability, celebration and purchased-goal expense.
- /reports: monthly/yearly totals, category trends, data tables and a UI-only export preview.
- /settings: profile, salary/savings/emergency targets, currency, saved theme preference and demo reset.
- /ask-cfo: the full conversation and financial snapshot. Dashboard and full-page chat share the same in-memory conversation.
- Bell: read/unread goal, bill, budget and reminder notifications.

The fixed demo snapshot is 7 October 2026, with history from November 2025 through October 2026. Times render in Asia/Kolkata. Account balances are snapshot balances; transaction additions/edits/deletions apply deltas against the original history. Transfers do not count as income/expenses. Debit cards reference their linked bank balance; credit balances are liabilities. Net worth is liquid funds plus investments minus loan and credit debt.

Goal savings and emergency reserves are allocations within liquid funds, not additional assets. Contributions cannot use emergency or another goal’s allocation. Goal purchase records one expense against a chosen bank/wallet/cash account and releases the allocation; repeated purchase calls are idempotent. Completion estimates split planned monthly goal savings across saving goals. Affordability evaluates one goal at a time while reserving loan payoff funds and the emergency target.

Demo mutations are locally persisted by the mock adapter. Settings can restore the seed snapshot; theme preference is preserved. Reminders are stored demo records, not real scheduled notifications. Report export is intentionally a preview only.

## FSD v2 rules

Layers: app > pages > widgets > features > entities > shared.

Every slice has an index.ts public API. External consumers import the alias plus slice name, never internals. A slice may import only lower layers; same-level slices do not import each other. Relative imports inside one slice are permitted. App is one composition layer; shared segments may cooperate and contain only generic UI, transport, persistence infrastructure, formatters, validation and design tokens.

Pages compose widgets without business decisions. App owns bootstrap, routing, providers, errors and the shell. Topbar receives the notifications control as a slot from AppShell rather than importing another widget. Transaction form schema/presentation live in the transaction entity so independent add/edit features can reuse them. Financial notification synchronization is a feature. The CFO’s financial and conversational decisions live only in its mock API and private mock payoff helper.

eslint-plugin-boundaries enforces downward dependencies and index.ts entry points. Six intentional-import probes exercise entity, feature, widget and page peer rejection, upward imports and internal imports. Ambient vite-env.d.ts is the only unknown-file exception. Steiger is not installed; boundary enforcement is active through ESLint.

## Real API swap points

Replace the implementations while preserving the interfaces exported from model/types.ts and each slice’s index.ts:

| Mock file | Intended REST endpoints |
| --- | --- |
| src/entities/transaction/api/transaction.mock.ts | GET/POST /transactions, GET/PATCH/DELETE /transactions/:id |
| src/entities/account/api/account.mock.ts | GET /accounts, GET /accounts/:id |
| src/entities/card/api/card.mock.ts | GET /cards, GET /cards/:id |
| src/entities/loan/api/loan.mock.ts | GET /loans, GET /loans/:id |
| src/entities/goal/api/goal.mock.ts | GET/POST /goals, GET /goals/:id, POST /goals/:id/contributions, POST /goals/:id/purchase, PATCH /goals/:id/achievement |
| src/entities/budget/api/budget.mock.ts | GET /budgets?month=, PATCH /budgets/:id |
| src/entities/category/api/category.mock.ts | GET /categories |
| src/entities/user/api/user.mock.ts | GET/PATCH /profile |
| src/entities/notification/api/notification.mock.ts | GET/POST /notifications, PATCH /notifications/:id/read, PATCH /notifications/read-all, GET/POST /reminders |
| src/features/ask-cfo/api/cfo.mock.ts | POST /cfo/ask, GET /cfo/snapshot; goal/reminder actions use their corresponding real endpoints |

Use the typed shared/api/http.ts transport. Set VITE_API_BASE_URL through .env.local based on .env.example. Keep abort signals, integer-paise values, ISO/date-only strings, consistent ApiError failures, list pagination and returned updated resources. Real endpoints must make financial mutations atomic and enforce the same reserve constraints. Mock resource projections, browser persistence, failure injection and the CFO mock algorithm can be removed after the swap. Stores and components continue using the same service interfaces.

## CFO contract

The full contract is src/features/ask-cfo/model/types.ts.

~~~ts
interface CfoRequest {
  requestId: string;
  conversationId: string;
  message: string;
  replyId?: CfoReplyId;
  purchase?: { name: string; pricePaise: number; category: 'phone' | 'work-equipment' | 'other' };
}
~~~

CfoResponse contains id, conversationId, revision, state, text, createdAt, purchase, snapshot, quickReplies, cards and actions. Rich card kinds are impact, loan-payoff, strategy, roi and salary-growth. Action kinds are set-goal, show-payoff and remind. The server owns the state transition. The UI formats values, renders cards and dispatches actions; it does not decide affordability, purchase dates, reasons or debt policy.

The mock response takes approximately 900 ms: parallel entity reads (350 ms) plus a 550 ms reasoning delay. Immediate same-request retries return the latest cached response. Goal and reminder actions carry idempotency keys and deduplicate concurrent clicks. Active-loan guidance precedes purchase advice; work motivation offers an illustrative ROI plan; status motivation offers a delayed/lower-cost plan; phone issues branch to repair or the ₹70,000 salary-growth plan. Unsupported purchase dates are null when there is no surplus or the payment cannot amortize a loan. No external AI service is called.

## Accessibility and responsive design

Semantic landmarks, labelled fields, real buttons/links, skip link, route focus, keyboard-operated tabs, native modal dialogs, Escape handling, reduced-motion support, live statuses, text labels alongside chart colors, and expandable chart data tables are included. Light/dark design tokens use readable contrasting text colors. Sidebar switches to bottom navigation below 1100 px; charts/cards become one column on narrow screens. Ctrl/Cmd K focuses transaction search.

## Hosting

Root hosting is the default. BrowserRouter requires an SPA fallback to index.html. vercel.json supplies the rewrite for a Vercel project; no deployment was performed. For a GitHub Pages project path, set VITE_BASE_PATH=/Montra-Money-Manager/ in .env.local or the build environment. A host-specific history fallback is still necessary for direct nested routes. The router uses import.meta.env.BASE_URL.

## Tests

tests/domain.test.ts checks money/date formatting, transaction filtering, transfer accounting, bank/card balance deltas, protected contributions, idempotent purchases, notification/reminder mutations, cancellation and reset. tests/features.test.ts checks form boundaries, theme preference, achievement deduplication, every CFO branch, action/request idempotency, retries, zero-surplus/non-amortizing cases and card rendering. tests/boundaries.cjs probes six prohibited imports. The small Node harness transpiles test TypeScript and resolves the same FSD aliases without a separate test framework. Application source is checked by strict tsc and ESLint.

See verification.md in the delivery for final build and browser results.
