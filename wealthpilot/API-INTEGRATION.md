# WealthPilot — MONTRA Money Manager frontend

React 18 + TypeScript + Vite 5 frontend connected to the MONTRA API. Production uses real authenticated data. Demo adapters run only when explicitly enabled with VITE_DATA_MODE=demo.

## Run and validate

Requires Node.js 20.19+ and npm. Run npm ci, npm run dev. Vite normally opens http://localhost:3000. Run npm run typecheck, npm run lint, npm test, npm run build and npm run preview to validate a production build.

Default backend: https://montra-apis-w8pd.onrender.com/api/v1. Override VITE_API_BASE_URL in .env.local when using another server. See .env.example. Frontend origins must be allowed by backend CORS; the deployed https://montra.realtanishqtiwari.in origin was verified. Localhost and 127.0.0.1 use the Vite API proxy automatically when VITE_API_BASE_URL is unset. Explicit direct API URLs require that local origin in backend CORS. Restart Vite after changing proxy configuration. Set VITE_ROUTER_MODE=hash for GitHub Pages and static hosting. VITE_BASE_PATH controls subdirectory deployment.

## Authentication

- /login, /signup and /recover are public. All financial routes require a session.
- Login/register send the exact identity payload, credentials: include and X-WealthPilot-CSRF: 1.
- Access tokens stay in memory. Refresh uses the backend HttpOnly cookie. Parallel 401s share one refresh and retry once; offline refresh failures do not silently clear the session.
- Refresh is serialized within a tab and, where navigator.locks exists, across tabs. Browsers without Web Locks guarantee only within-tab serialization.
- Signup displays the private recovery code until the user acknowledges saving it. Recovery and password changes show replacement codes without persisting them in browser storage.
- Settings supports password change, identity check and logout. Financial stores clear when the session owner changes; late responses cannot restore another owner’s data.
- Cross-site refresh cookies require Auth__CrossSiteCookies=true, SameSite=None/Secure and browser cookie support. A same-site API subdomain is preferable if browsers block third-party cookies.

## Financial features

- Dashboard uses complete server summaries, trends, spending categories and upcoming bills.
- Transactions support filters, sorting, paged history loading, add/edit/delete, debit-linked transfers, exact rupee-to-paise conversion and viewed ETags for conflict-safe edits.
- Manage finances supports account/card/category/loan create, edit and archive, budget create/update/remove, card bill creation, bill-selectable repayment, explicit principal/interest/fees loan payments and reminders.
- Opening balances and positions are immutable. Edit forms ask for the original opening amount rather than assuming the current balance is the opening balance.
- Goals support creation, contribution, achievement acknowledgement and purchase recording. Settings provides contribution history.
- Reports fetch complete monthly/yearly server totals and category trends, and export CSV.
- Server notification read state, history and complete unread count are wired. Financial alerts and reminder scheduling belong to the backend.
- Profile uses contact email; changing it does not change login identity. Zero planning income/targets are supported.
- New accounts start empty. Onboarding prompts for opening accounts instead of inventing sample financial data.
- Reconciliation is available through Account audit; settings includes reminders, card bills, goal contributions and notification history.

## CFO

Production requests go to cfo/ask and cfo/snapshot. Nullable-purchase clarification, optional explicit purchase facts and expected additional income, rich cards, server decision assumptions, paginated durable history and request retry are supported. Only the conversation identifier is stored locally, scoped by authenticated username. Content and decisions stay on the backend. Failed messages must be retried or the conversation restarted before a new send.

Set-goal/remind actions POST to the exact server response ID and action index with its action key. No editable action payload or client-generated affordability decision is sent. Older response buttons disable; server conflicts remain authoritative. The payoff action asks the server for a new payoff plan.

## Transport and architecture

FSD layers: app > pages > widgets > features > entities > shared. Each slice exposes an index.ts public API; lint enforces boundaries. shared/api/contracts.ts was generated from the deployed Swagger schema. The API adapters live in their owning entity/feature slices.

Financial POST commands carry a stable UUID per request intention. Concurrent identical writes join one promise; ambiguous failures retain the key and identical payload for in-session retry. Changed payloads receive new keys. Reloads discard in-memory pending write keys: inspect server history before re-creating an ambiguous write. The API must expose ETag in CORS response headers for browser transaction editing.

Monetary values are integer paise; dates use YYYY-MM-DD and IST planning dates. Optional wire fields normalize to the existing UI models; nullable CFO purchase facts remain null. Backend errors preserve fieldErrors, requestId and retryability metadata. Field errors are displayed alongside the server message.

## Verification and limits

Strict TypeScript, zero-warning ESLint, 26 existing behavior groups, six architecture probes and seven production transport/security groups are included in npm test. Browser fixture checks cover login validation, empty onboarding, account creation/summary refresh, CFO clarification, settings/logout and public signup navigation. Fixtures perform no production financial writes.

Live Swagger, backend availability and the deployed frontend CORS origin were verified. Full authenticated production mutation testing requires a real account and was not performed. Render cold starts, API availability and cross-site-cookie browser policy remain deployment dependencies. The existing Recharts chunk is over Vite’s 500 kB advisory threshold.

## Deployed API route inventory

- GET /api/v1/accounts
- POST /api/v1/accounts
- GET /api/v1/accounts/{id}
- PATCH /api/v1/accounts/{id}
- DELETE /api/v1/accounts/{id}
- GET /api/v1/summary
- GET /api/v1/dashboard
- GET /api/v1/reports/summary
- GET /api/v1/reconciliation
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/refresh
- POST /api/v1/auth/logout
- POST /api/v1/auth/recover
- POST /api/v1/auth/password
- GET /api/v1/auth/me
- GET /api/v1/budgets
- POST /api/v1/budgets
- PATCH /api/v1/budgets/{id}
- DELETE /api/v1/budgets/{id}
- GET /api/v1/cards
- POST /api/v1/cards
- GET /api/v1/cards/{id}
- PATCH /api/v1/cards/{id}
- DELETE /api/v1/cards/{id}
- GET /api/v1/cards/{id}/bills
- POST /api/v1/cards/{id}/bills
- POST /api/v1/cards/{id}/repayments
- GET /api/v1/categories
- POST /api/v1/categories
- PATCH /api/v1/categories/{id}
- DELETE /api/v1/categories/{id}
- GET /api/v1/cfo/snapshot
- POST /api/v1/cfo/ask
- GET /api/v1/cfo/conversations/{id}/history
- POST /api/v1/cfo/responses/{id}/actions/{index}
- GET /health/live
- GET /health/ready
- GET /api/v1/goals
- POST /api/v1/goals
- GET /api/v1/goals/{id}
- GET /api/v1/goals/{id}/contributions
- POST /api/v1/goals/{id}/contributions
- POST /api/v1/goals/{id}/purchase
- PATCH /api/v1/goals/{id}/achievement
- GET /api/v1/loans
- POST /api/v1/loans
- GET /api/v1/loans/{id}
- PATCH /api/v1/loans/{id}
- DELETE /api/v1/loans/{id}
- POST /api/v1/loans/{id}/payments
- GET /api/v1/notifications
- GET /api/v1/notifications/history
- GET /api/v1/notifications/unread-count
- PATCH /api/v1/notifications/read-all
- PATCH /api/v1/notifications/{id}/read
- GET /api/v1/profile
- PATCH /api/v1/profile
- GET /api/v1/reminders
- POST /api/v1/reminders
- GET /api/v1/transactions
- POST /api/v1/transactions
- GET /api/v1/transactions/{id}
- PATCH /api/v1/transactions/{id}
- DELETE /api/v1/transactions/{id}

Latest live verification: see [LIVE-API-TEST-REPORT.md](docs/LIVE-API-TEST-REPORT.md). All 65 routes were exercised; cross-site refresh cookie configuration and browser session restoration are now verified.

Automatic-goals replacement: see [AUTOMATIC-GOALS.md](docs/AUTOMATIC-GOALS.md). The frontend handles a missing planning service by keeping saved goals and creation available; automatic allocations require the new backend routes.
