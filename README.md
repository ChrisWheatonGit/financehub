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
