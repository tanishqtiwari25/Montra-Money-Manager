# Amount visibility

The top bar now includes a global **Hide amounts / Show amounts** control, accessible by keyboard and available on mobile.

Hidden amounts display as `₹••••` across dashboard totals, accounts/cards, loans, budgets, goals, transactions, reports, purchase confirmations and financial history. Chart axes, tooltips and data tables use the same masking preference. Money in CFO replies, notifications and error messages is redacted while dates and percentages remain readable.

Money fields render as masked password inputs while hidden and return to numeric inputs when shown. Their values are preserved. The preference persists in local storage across page reloads and route changes. Toggling does not write financial data or request a backend change.

Validation: TypeScript, ESLint, production build and privacy rendering tests. Tests verify masked/revealed amounts, financial inputs, chart data, notification text, stored preference, and unchanged domain currency formatting. The normal regression suite is also run.
