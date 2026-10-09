# FinanceHub v1.3 — Joint Household Foundation

This release **retains browser-only demo storage**. It adds configurable transaction payer and split percentages and a Prisma household model for the upcoming authenticated backend. **Do not use real financial data.** No multi-device synchronization, database migrations, account registration, invitation sending, or secure multi-user isolation is active yet.

See `docs/HOUSEHOLD-ARCHITECTURE.md` and `docs/HOUSEHOLD-RELEASE-GATES.md` before attempting to connect this schema to production.

# FinanceHub

Open-source, self-hosted personal finance application (early development starter).

> **Important:** The current app is a **fictional-data UI demo**, not a secure financial account product. PostgreSQL is provisioned but the dashboard is not yet connected to it. Sign-up, login, per-user authorization, uploads, and data entry are **not implemented**. Do not enter real finances or expose this version publicly.

## Prerequisites
- Node.js 22 or newer, npm, Git
- Docker Engine and Docker Compose (for containerized run)

## Run quickly (development UI)
```bash
npm install
npm run dev
```
Visit http://localhost:3000.

## Run using Docker
```bash
cp .env.example .env
# Edit .env with a long random POSTGRES_PASSWORD
# On Windows PowerShell: Copy-Item .env.example .env
docker compose up -d --build
```
Visit http://localhost:3000 **on the Docker host**. Docker binds the web port to localhost only, and the database has no host-facing port.

## Shutdown
```bash
docker compose down
```
Do not use `docker compose down -v` unless you intentionally want to delete persistent PostgreSQL data.

## Roadmap
1. Install and configure authentication library; sessions, password reset and protected routes.
2. Finalize account-owned database schema, run migrations, add authorization tests.
3. Implement actual account and transaction CRUD; ensure account ownership checks on every request.
4. Build budgets, debt, savings and calculators.
5. Encrypted document storage, import/export, backup restoration procedures.
6. Production deployment documentation with HTTPS reverse proxy and security review.

## Repository setup
```bash
git init
git add .
git commit -m "feat: initialize FinanceHub starter dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/financehub.git
git push -u origin main
```

## Notes
- `prisma/schema.prisma` is an illustrative **future** data model; the application does not use Prisma yet.
- `.env` is ignored by Git.
- This is not a production deployment template.

## Transactions module (development preview)

Choose **Transactions** from the FinanceHub sidebar to open an interactive fictional-data module. You can add, edit, delete, filter, search, and export CSV transactions. Income, expenses, net cash flow, and category totals respond to those changes. Demo records persist in this browser's `localStorage` (`financehub:fictional-transactions:v1`). Click **Reset sample data** to restore the sample records.

**Do not enter real financial or personal data.** This local preview has no authentication, encrypted storage, private accounts, or secure database-backed access. Its figures do not yet update the separate demo dashboard; that integration is planned for the database phase.

## v0.3 dashboard integration

- Dashboard and Transactions use the same browser-local fictional records (existing v0.2 data retained).
- Income, spending, cash flow, categories, and recent activity update after creating/editing/deleting transactions.
- Dashboard period selector changes monthly summaries and the six-month graph. Recent activity remains the latest four records across all months.
- Net cash flow is **not** an actual checking balance. Debt and savings figures remain fictional placeholders.
- **Never enter actual financial data**. The browser storage is not encrypted, authenticated, or multi-user.

## v0.4 — Debt & Loans (demo)

The Debt & Loans section allows fictional credit-card and loan records, shows aggregate debt and estimated payoff periods, and stores demo records in browser localStorage. These are **not** real or securely stored financial records. Estimated payoff uses a fixed monthly APR and payment and excludes fees or changing rates.


## v0.8 development bundle (v0.4–v0.8)

- **v0.4 Debt & Loans:** fictional account CRUD and monthly payoff estimates.
- **v0.5 Savings Goals:** fictional savings targets, contributions, progress and ETA.
- **v0.6 Budgets:** category-specific monthly limits compared with browser-stored fictional Transactions.
- **v0.7 Retirement:** fictional 401(k) and IRA accounts, monthly contributions and hypothetical compound-growth projections.
- **v0.8 Calculators:** fixed-rate student loan payoff with extra payments and first 24 amortization rows; mortgage P&I plus estimated tax, insurance, HOA and PMI.

**Security warning:** This is a localhost UI prototype. It has no authentication or user isolation. Savings, budgets, retirement and debts use localStorage. Never enter real financial records, W-2s, credentials or account numbers. Do not expose this app publicly.

**Testing:** `npm install`, `npm run build`, `npm run dev`; verify each module and refreshing/reopening tabs. Data from v0.2 Transactions is retained under its original browser key.


## v0.9 navigation, charts, subscriptions

The FinanceHub logo and breadcrumb labels navigate to the Dashboard. Debt, Savings, Budgets and Retirement have data-driven bar charts. The Subscriptions page manages fictional recurring charges and shows normalized monthly expenses by category. All changes remain browser-only demos; no real financial data.


## v1.0 — Appearance & integrated overview (development milestone)

- Settings → Appearance: Light, Dark, or System. Preference is local to each browser.
- Quick theme toggle in the top navigation.
- Dashboard debt balance and savings progress read demo planning-module browser records.
- Monthly commitments summarize active subscriptions and scheduled debt payments. They are **not** automatically posted as transactions, preventing misleading double-counting.
- Refreshed panels, forms, focus states, mobile styling and dark surfaces.

### Scope of the integration

Transactions remain the only source of actual *recorded* income/expense cash flow. Debt, subscriptions, savings and retirement remain independent planning data; creating a scheduled subscription does not mean it was paid. A full double-entry/transfer-aware unified ledger is intentionally deferred to the authenticated PostgreSQL phase. This is **not a production release** despite the v1.0 UI milestone name.

### Verification

Run `npm install`, `npm run build`, and `npm run dev`. Test all theme modes, refresh persistence, dashboard updates when returning from each planning module, and all existing create/edit/delete functions. Only use fictional data.


## v1.1 demo expansion

Adds Accounts, Net Worth, Bills & Payments, Reports & Analytics, Income & Paychecks and No-Spend Tracker. Income, reports and no-spend metrics derive from the existing transaction ledger; bills are planning commitments only and do not create duplicate transactions. Accounts are manual snapshots and not connected to transaction postings yet. **Net worth is approximate and will double count any retirement account also manually entered under Accounts.** No real financial records should be stored in this development version. See `docs/V1.1-QA.md`.
