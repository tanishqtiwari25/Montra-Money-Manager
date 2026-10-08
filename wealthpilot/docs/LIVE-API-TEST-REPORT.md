# MONTRA live API verification

Backend: https://montra-apis-w8pd.onrender.com/

Verified on 2026-10-08T11:59:17.978Z. All **65 method/route combinations** exercised using synthetic isolated test accounts and records. This is integration coverage, not a guarantee that every possible input or failure mode is covered.

## Result

All 25 integration groups now pass across the original suite and targeted retest. Backend cookie configuration was corrected; deployed browser login and full-page reload retain the authenticated dashboard.

**Resolved backend configuration:** `Auth__CrossSiteCookies=true` is active. Refresh cookie attributes verified as `HttpOnly; Secure; SameSite=None`. Browser policies can still block third-party cookies; hosting API under a same-site subdomain is the more reliable long-term option. Frontend code cannot change an HttpOnly server cookie.

**Frontend fixes:** logout now sends its bearer token, and card creation submits the accepted `indigo` display token, rendered as a CSS gradient. Optional debit-card limit defaults to empty.

## Checks

| Check | Result | Details |
|---|---|---|
| Health/live and readiness | PASS | Verified |
| Unauthenticated financial access denied | PASS | Verified |
| Register: private recovery code and secure refresh cookie | PASS | Targeted retest confirms SameSite=None, Secure and HttpOnly; browser reload retains login. |
| Identity, initial empty financial data and seeded categories | PASS | Verified |
| Auth CSRF missing header rejected | PASS | Verified |
| Login rejects wrong password and accepts username | PASS | Verified |
| Refresh rotates cookie and issues access token | PASS | Verified |
| Accounts create/read/update and opening position immutability | PASS | Verified |
| Financial create idempotent replay and changed-payload rejection | PASS | Verified |
| Categories create/update and budget create/update/list | PASS | Verified |
| Transaction create/get/update/delete with ETag and stale conflict | PASS | Verified |
| Transaction transfer, query validation and pagination | PASS | Verified |
| Cards create/read/update and bill create/list | PASS | Verified |
| Credit repayment changes debt and linked bill exactly once | PASS | Verified |
| Loans create/read/update and explicit principal/interest/fee payment | PASS | Verified |
| Profile contact/planning update with protected reserve validation | PASS | Verified |
| Goals create/read/contribution/history/achievement/purchase replay | PASS | Verified |
| Notifications newest/history/unread/read/read-all and reminders | PASS | Verified |
| Summary/dashboard/reports/reconciliation produce consistent totals | PASS | Summary net worth 50439000 paise; reconciliation retrieved |
| CFO snapshot, nullable clarification, replay, history and bound action | PASS | Nullable purchase, stable replay, finalized history and set-goal action verified |
| Secondary owner cannot read primary private records | PASS | Verified |
| Archive/delete account/card/loan/budget and unused category | PASS | Debt and bills must be paid before archival (409 verified); full settlement, card/loan archival, budget and category deletion succeeded. Ledger and journal reconcile exactly. |
| Password change, old-password rejection and email login | PASS | Verified |
| Recovery code resets password, rotates code and logs in | PASS | Verified |
| Logout revokes cookie and subsequent refresh is denied | PASS | Bearer logout succeeded; cookie refresh after logout returned 401. Burst auth calls returned 429 correctly; retry after rate-limit window succeeded. |

## Validation limits

API refresh passed with an explicitly supplied test cookie. That is separate from browser cookie delivery, which initially failed and now passes after the configuration update. Auth burst rate limiting correctly returned 429; delayed retry passed. Outstanding card/loan obligations correctly blocked archival until fully settled. Reconciliation returned balanced=true and journalBalanced=true, with exact expected/actual paise for all tested accounts, cards and loans. No real user financial records were modified. Synthetic test accounts remain because the contract exposes no account deletion endpoint. Credentials are excluded from this report.

Frontend typecheck, lint, automated regression tests and production build passed.

Final deployment: GitHub Actions run 37773760872 succeeded for commit 668ae35. Login and Settings → Sign out were verified in the deployed browser after release; sign out returned to the login page. Local proxy auth returned Origin is not allowed because localhost is outside the backend allowlist; deployed-origin authentication passed.


Session persistence retested: 2026-10-08T12:19:38.613Z. Production-origin CORS permits credentials and the exact frontend origin. Full browser reload remains on the authenticated dashboard. Empty CFO history now restores as a new conversation rather than a Resource not found error; regression test covers 404 handling and preserves actual 503 errors.
