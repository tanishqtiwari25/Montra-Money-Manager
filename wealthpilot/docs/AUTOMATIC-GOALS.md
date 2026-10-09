# Automatic goals frontend rollout

Implemented from automatic-goals-frontend.md supplied by the user on 9 October 2026.

## Changes

- Goals and dashboard cards render the same server plan, joined to goal metadata by goalId in server order. Historical savedPaise/status never authorize automatic progress or purchase.
- Manual contribution controls, equal-split estimates and automatic achievement acknowledgement/celebration effects are removed from the active frontend. Historical contributions remain readable in Settings. Legacy demo test helpers remain outside the production flow.
- Shared cash, emergency, living, debt and historical reserve summary; assumptions; conditional estimates; priority/date editing including null date clearing.
- Current readiness is required for purchase. Source account must be active bank/cash/wallet and cover the full price. Explicit confirmation records an expense only; it does not send money.
- One persisted request key/body per purchase intent, concurrent-click guard and retry after reload. Server errors remain visible; full plan and account state refetch after rejection.
- Full metadata/plan snapshots replace together. Read sequences discard outdated requests and requests from previous owners. Cards stay mounted during refresh so open form inputs/error state survive. Plan values are hidden during refresh.
- Financial store updates, goal writes, page entry and window focus refresh planning. Summary, report and current CFO snapshot views invalidate after writes; CFO message snapshots remain historical.

## Validation

Typecheck, lint, production build and full existing regression suite pass. Six additional automatic-plan checks verify server priority/shared allocations, metadata separation, debt/null-profile statuses, priority+null date payload, stale/owner read guards, refreshed summary ordering and explicit missing backend error.

Local isolated fixture browser checks: two Rs20,000 goals share Rs25,000 as Rs20,000 and Rs5,000; manual contribution control absent; desired date clearing sends null; insufficient wallet and investment accounts excluded; rapid click yields one purchase POST with key; purchased item moves to durable history. No POST contribution or achievement call occurred. Fixture is a controlled contract sample, not validation of backend financial calculations.

## Deployment dependency

Live backend https://montra-apis-w8pd.onrender.com/api/v1/goals/plan returned 404 in authenticated checks; Swagger lacks goals/plan and goals/{id}/priority. New backend must deploy before frontend rollout. Keep live main frontend unchanged until both routes and automatic purchase semantics are verified. The new frontend is saved on a separate review branch and in the downloadable automatic-goals ZIP.

After backend deployment, fetch updated OpenAPI, confirm exact plan wrapper/nullable fields and priority PATCH response, run synthetic owner-scoped plan/priority/purchase/replay tests, then promote frontend and verify deployed browser. Do not re-run the old live manual-contribution test script against the new contract.

Purchase retry fixture: temporary 503 preserves open dialog, source account and error; reload restores pending purchase; retry sends the exact original idempotency key and body.

## Missing planning API recovery

Goals metadata and planning requests settle separately. A 404 planning endpoint now leaves saved goal metadata and creation usable, with an explicit unavailable status. No progress, affordability or purchase readiness is invented. Priority and purchase controls stay unavailable until a complete automatic plan loads. Refresh automatically exits this state after backend recovery. Metadata and unexpected API failures remain visible. This safe fallback can deploy before the backend routes; full automatic planning still requires the backend update.
