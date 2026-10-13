# Swagger API integration — 13 October 2026

Backend: https://montra-apis-w8pd.onrender.com/api/v1

The current Swagger now includes automatic goals planning and priority updates. Authenticated QA requests returned 200 for the goal plan with `policyVersion: automatic-goals-v1`, priority update with a cleared target date, and expense shock preview. The existing frontend plan integration therefore activates automatically when a user refreshes Goals.

## Added frontend controls

- Goals: unexpected-expense preview, calculated entirely by the server. It does not write a transaction. Results are invalidated after finances change.
- Manage Finances: savings pockets, pocket editing/removal/release, emergency conversion, account balance correction, deposit terms, card billing schedule, loan details/corrections, and goal removal.
- Money inputs are converted from rupees to integer paise once. Writes require explicit confirmation, reject concurrent submission, surface server errors, and refresh account/loan/card/transaction/profile/summary/goal data.

Existing authentication, accounts, transactions, cards, budgets, categories, loans, notifications, reminders, reports, reconciliation and CFO API integrations remain connected.

## Verification

TypeScript, ESLint, regression suite and production build passed. The existing chart bundle size warning remains.

Disposable QA account only: planning, priority updates, shock preview, balance adjustment, card schedule, loan detail update, pocket creation (`general`), pocket edit/delete and goal delete passed. Deposit terms correctly rejected a cash account; emergency conversion correctly rejected a general pocket. These operations need an eligible fixed deposit/emergency pocket.

## Remaining contract gaps

Swagger does not specify the pocket funding `direction` enum or the loan void `confirmation` value. `release` is recognized by the backend and correctly rejects an empty pocket. Funding candidates tested were rejected with 422. Pocket funding and loan void controls are withheld pending exact accepted values. Their endpoint clients are present; successful end-to-end execution is not claimed.

Automatic purchase continues to use the server readiness gate, one source account, and stable purchase intent. A new successful automatic purchase was not exercised during this audit; previous frontend retry/double-click tests remain passing.

Health endpoints are operational checks, not end-user actions. Manual contribution and automatic achievement writes remain absent from the automatic Goals UI as required by the handoff.
