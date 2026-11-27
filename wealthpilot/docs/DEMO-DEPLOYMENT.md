# WealthPilot customer demo and GitHub Pages

## Two branches, two experiences

- `main`: the live authenticated product, with its real backend connection. Shared branding has been updated; customer records and the API mode are preserved.
- `demo`: a fictional customer preview. Its production environment selects local sample data. No signup is needed. HTTP transport refuses live API operations in demo mode.

The demo follows the reference's customer-friendly entry and tour approach with WealthPilot's own branding and finance content. Oliver Bennett, Emma Bennett, the banks and all financial records are fictional. Amounts intentionally remain INR; this is not a currency-conversion feature. The scenario is fixed at 7 October 2026 and includes twelve months of activity.

## Customer links

- Live product: https://montra.realtanishqtiwari.in/
- Customer demo: https://montra.realtanishqtiwari.in/demo/

The demo has a welcome page, guided five-stop tour, free exploration, sample accounts/cards/loan, spending history, budgets, goals, reports, notifications, profile, themes and amount privacy. Customers can try transaction changes, budget edits, goal creation/priority/purchase and expense-impact previews. Account/card/loan administration is not exposed in the demo. The CFO remains Coming soon. Demo report export currently provides a preview.

Edits are saved locally in that browser and origin. They are not sent to the backend or shared with other customers. Reset restores sample records and clears pending purchase intents. Local sample goal planning illustrates shared allocations and is explicitly not the live backend's financial advice or authoritative policy. No real payments are executed.

## How hosting works

This repository uses **GitHub Actions** to build and publish Pages, rather than “Deploy from a branch.” Keep **Settings → Pages → Build and deployment → Source = GitHub Actions**.

The workflow builds `main` for the root website and `demo` for `/demo/`. Both builds are uploaded as one Pages artifact. A push to either branch refreshes the combined site. Production build environment values are explicitly set, so demo cannot silently replace the root's API mode.

The initial demo branch must exist before this combined workflow can build it. Do not delete or rename that branch without updating the workflow.

## Switch the root website to a selected branch

Usually leave the root as the live product and share `/demo/` with customers. To intentionally show the demo at the root:

1. Open the repository on GitHub.
2. Open **Actions → Deploy WealthPilot to GitHub Pages**.
3. Select **Run workflow**.
4. Leave the workflow's **Use workflow from** dropdown on `main`.
5. Set **Root website version** to `demo`.
6. Click **Run workflow** and wait for the build and deploy jobs to succeed.
7. Reload the root website. It will show the demo; `/demo/` remains the demo too.

To restore real login and API data at the root, run the same workflow with **Root website version = main**. Ordinary pushes deploy `main` at the root again. A manual root switch is an intentional temporary selection, not a persistent repository setting.

Do not change Pages to deploy raw source from `main` or `demo`: React/Vite source must be built first. Do not change DNS or the CNAME merely to choose a branch.

## Local development

From the `wealthpilot` directory, install dependencies with `npm ci`.

PowerShell demo preview:

```powershell
$env:VITE_DATA_MODE = 'demo'
$env:VITE_ROUTER_MODE = 'hash'
npm run dev
```

For a live API preview, remove those overrides or set data mode to `api`; local development uses the configured API/proxy. On the demo branch `.env.production` defaults production builds to demo, but development still needs the explicit environment setting above. Restart the dev server after changing environment variables.

## Updating safely

- Build product fixes on `main`, validate them, and merge/cherry-pick shared fixes into `demo` deliberately.
- Keep `demo`'s `.env.production` set to `VITE_DATA_MODE=demo` and `VITE_ROUTER_MODE=hash`.
- Avoid merging that environment file back into `main`.
- Maintain the same deployment workflow on both branches; it checks out the selected product branch and the demo branch explicitly.
- Never put credentials, tokens, recovery codes or actual customer records in sample files.
- After deployment, verify root login, demo entry/tour, mobile navigation, local reset and zero demo API calls.

## Customer walkthrough

Ask a reviewer to take the tour, search a sample transaction, try a small expense, compare accounts and cards, review a goal's priority, and inspect a monthly report. Ask where the next action felt unclear. The demo is designed to support a product conversation; it is not evidence of usability outcomes without collecting that feedback.
