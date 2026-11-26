# WealthPilot UI and usability audit

Date: 27 November 2026

## Requirement assessment

| User requirement | Delivered evidence | Status |
| --- | --- | --- |
| Install frontend design from GitHub | anthropics/skills, skills/frontend-design installed as frontend-design | Complete |
| Use “ultra Max” | Interpreted as UI/UX Pro Max; nextlevelbuilder/ui-ux-pro-max-skill installed as ui-ux-pro-max-github, preserving existing local version | Complete with stated interpretation |
| Apple material minimalism | dickwu/apple-design-skill installed as apple-design-github. Applied readable surfaces, restrained blue accents, spacing and glass only in navigation | Complete |
| Improve the whole interface | Shared visual tokens, forms, navigation, typography and page copy across all workspace routes; authentication copy corrected | Complete |
| Make starting clear | Three-step guide derived from actual account, expense and goal records | Complete |
| Make adding things clear | Persistent Add something action with task cards and descriptions, Back to choices, separate editing/archive paths | Complete |
| Make forms less technical | Friendly field labels; colour/gradient/icon implementation fields removed from ordinary financial forms; account and card hints added | Complete |
| Make mobile useful | Home, Activity, Accounts, Goals and More replace the unavailable CFO primary tab | Complete |
| Keep privacy and existing workflows | Privacy persistence, expense/goal/account entry and financial regression suite pass | Complete |
| Audit the result | Browser workflows, axe WCAG A/AA checks, responsive and dark-theme checks, build/type/lint/regressions | Complete within tested coverage |
| “Perfect” for non-technical users | Automated evidence supports the redesign; human usability testing is still required | Not claimed |

## Design decisions

- Retain WealthPilot identity and the existing Inter typeface; use white/soft grey surfaces, ink text and a consistent blue action colour.
- Reduce the management banner to a compact toolbar. Separate everyday recording from secondary corrections and audit downloads.
- Use larger readable labels and 48px financial inputs. Navigation keeps familiar web semantics and focus states.
- Do not market the pending CFO as available. Its route remains Coming soon, and dashboard promotional clutter is removed.
- Hide an empty cash-flow chart instead of displaying a large blank graph.
- Keep financial calculations on the server. No changes to allocation formulas, purchase gates, idempotency or auth contracts.
- Add a consistent help button with a beginner walkthrough and links to actual tasks.
- Archive requires an explicit review checkbox. Editing hidden appearance fields preserves their existing values.

## Skill guidance used

- Frontend Design: https://github.com/anthropics/skills/tree/main/skills/frontend-design
- UI/UX Pro Max: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- Apple Design: https://github.com/dickwu/apple-design-skill

Apple reference evidence: layout.md / Visual hierarchy (grouping and progressive disclosure), typography.md / Ensuring legibility, accessibility.md / Vision (larger text), materials.md / Liquid Glass (do not use glass in the content layer), plus color, entering-data, onboarding, desktop design and cross-platform guidance. These are design principles translated to a web app, not a claim that the site uses native Apple frameworks.

The UI/UX Pro Max finance query returned an appropriate minimal functional style; its sales/conversion layout recommendations were not adopted for a signed-in money dashboard. The React-specific form query had no direct match, so implementation followed the verified UX error/label guidance and existing React patterns.

## Validation

- TypeScript and ESLint: passed.
- Full existing regression suite: passed, including authentication/session transport, stale response handling, goal plan, financial command replay and amount privacy.
- Production build: passed; existing large Recharts chunk warning remains.
- Main local Edge audit: 27 workflow/responsive checks passed, no page errors, no axe violations in tested screens.
- Main axe sweep: login, empty dashboard, account form, all nine workspace routes, help dialog, chooser, all workspace routes in dark mode, four chooser widths and mobile Accounts.
- Tested widths: 375, 390, 768, 1024 and 1440px; landscape 812x375; 200% root text size; reduced motion enabled.
- Tested functional sequence: create account, record expense, create goal; setup progress follows the saved records and disappears when complete.
- Privacy toggles and survives reload. Help closes with Escape and returns focus. CFO remains unavailable.
- Supplemental dark-theme/form sweep: all nine workspace routes and all nine task forms returned zero axe violations.
- Two real accessibility issues were found and corrected: notification region ARIA semantics and a dark Goals link with insufficient text contrast.

## Limits

These are local fixture-backed UI tests, not a new exhaustive live backend audit. No real financial records were changed for this redesign audit. Empty/small synthetic datasets were used; every possible server error, long dataset and menu state is not exhaustively certified. Axe is a useful automated check, not proof of full WCAG compliance. Safari/Firefox, physical phones and actual non-technical user sessions were not tested. Historical API audit results remain separate.

Installed skills are available for automatic discovery from the next turn. Their instructions were read and applied during this implementation.
