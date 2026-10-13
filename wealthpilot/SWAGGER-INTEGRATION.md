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

## Funding and loan void follow-up

Both previously withheld controls are now enabled using the supplied backend contract. Pocket funding uses direction `set-aside`; release uses `release`. Amounts must be positive integer paise. Loan void requires a trimmed 8–200 character reason and a case-sensitive match to the selected loan name.

Live disposable QA verification passed: ₹100 funding reserved exactly once on replay; release restored the pocket amount to zero; account cash remained unchanged. Incorrect loan confirmation returned 422. Exact-name loan void and same-key replay returned 200 without changing account cash. Frontend tests cover rejected amounts/directions, reason limits, name capitalization, and identical retry payload/key.

Uncertain requests retain an explicit command key and frozen inputs until retry resolves. Success refreshes financial data; refresh errors do not resubmit a successful command.

Automatic purchase continues to use the server readiness gate, one source account, and stable purchase intent. A new successful automatic purchase was not exercised during this audit; previous frontend retry/double-click tests remain passing.

Health endpoints are operational checks, not end-user actions. Manual contribution and automatic achievement writes remain absent from the automatic Goals UI as required by the handoff.
