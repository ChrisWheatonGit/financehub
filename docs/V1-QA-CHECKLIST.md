# FinanceHub v1.0 — Development QA checklist

This is a UI milestone, **not** a production security approval. Only use fictional data.

## Build and regression

- [ ] `npm install` completes
- [ ] `npm run build` succeeds without TypeScript errors
- [ ] `npm run lint` succeeds (or documented warnings are reviewed)
- [ ] Dashboard loads with no browser-console errors
- [ ] Transactions CRUD works and totals persist across refresh
- [ ] Debt, savings, budgets, retirement, calculators, and subscriptions remain usable
- [ ] Sidebar and breadcrumbs navigate correctly on desktop and mobile

## Appearance

- [ ] Settings > Light updates all pages, dialogs and tables
- [ ] Settings > Dark updates all pages, dialogs and tables
- [ ] Settings > System follows the OS setting and responds to OS theme changes
- [ ] Theme remains selected after refreshing
- [ ] Quick toggle in header works
- [ ] Text, form fields, charts, and action buttons have adequate contrast in both themes
- [ ] Keyboard tab navigation exposes visible focus rings

## Integrated overview

- [ ] Add/edit a fictional debt, return to Dashboard, and confirm debt total changes
- [ ] Add/edit a fictional savings goal, return to Dashboard, and confirm savings goals change
- [ ] Add/edit an active fictional subscription, return to Dashboard, and confirm monthly commitment changes
- [ ] Disable a fictional subscription; it should no longer count as an active commitment
- [ ] Change transaction amounts; monthly cash flow updates without importing planning-only commitments
- [ ] Verify Dashboard shows no duplicate transaction posting for debt/subscription commitments

## Known limitations

- Browser storage only; not user-isolated or encrypted.
- No automatic posting or reconciliation of recurring transactions. Planning records are separate from actual transactions.
- No production security audit, accessibility audit, or automated browser test suite completed.
