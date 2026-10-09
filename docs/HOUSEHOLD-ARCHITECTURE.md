# Joint household architecture

## Model
- Independent user identities and MFA, with membership in a shared household.
- Owners and co-owners have equal read/write finance access. Revocation and deletion will need enhanced confirmation.
- All financial data is household-scoped. Account and category references are composite `(id, householdId)`.
- Transaction payer = actual person paying; splits = allocation of liability. The sum of split rows MUST equal the original expense amount (enforce atomically in application write service; PostgreSQL deferred constraint trigger can add defense-in-depth).
- Reimbursements are transfers/settlements, never a second expense. Income and expense analytics include only their matching `kind`.

## Authentication / authorization: NOT IMPLEMENTED
- A vetted authentication provider must bind server session to user id.
- Before each read/write, check active membership of user in requested household; never trust householdId from browser alone.
- Enable PostgreSQL RLS using transaction-scoped tenant context with dedicated non-bypass application role. Prisma schema alone does not supply RLS.
- Invitations: authenticated inviter; cryptographic random token; store token hash; 24-hour expiry; compare normalized verified email; one-time acceptance; rate limits and audit trail.
- Test cross-household and removed-user access on every endpoint.

## Money
- Store whole minor units as BigInt in database; use decimal-safe calculator for APR/amortization.
- Transfers require paired postings and atomic transactions in the eventual double-entry ledger.
- Shared expense of $200 always contributes $200 to aggregate spending even at 50/50 split.

## Migration sequence
1. Provision disposable PostgreSQL using Docker Compose. Do NOT use production data.
2. Install compatible Prisma CLI/client versions together; add `DATABASE_URL` to ignored `.env`.
3. Run `npx prisma validate` and review generated migration SQL before applying.
4. Add server-side auth/session and household membership middleware.
5. Add explicit RLS migrations, least-privilege roles and automated tenant-isolation tests.
6. Only then implement invitation endpoints and database writes.

## Development note
The `prisma/schema.prisma` defines target tables but is not integrated with the Next.js demo pages. Do not treat schema definition as an authenticated backend.
