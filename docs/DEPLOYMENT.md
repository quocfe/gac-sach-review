# Deployment runbook

## Required services

1. Next.js web service with HTTPS and `NODE_ENV=production`.
2. PostgreSQL with daily encrypted backups and point-in-time recovery.
3. Redis for distributed rate limits.
4. S3-compatible private object storage for approved covers.
5. Auth.js Google OAuth callback URL registered for the deployed domain.

## Environment

Set the values named in `.env.example`; never commit them. Set the canonical domain by replacing `https://mocban.example` in metadata, sitemap and robots before deployment.

## Release steps

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Apply Prisma migrations once the Prisma repository adapter replaces the local demo storage. Health check `GET /api/health` before and after traffic cutover.

## Restore rehearsal

Restore an encrypted backup to isolated staging quarterly. Run migrations, compare catalog/review/audit record counts, authenticate a test moderator, then document the result and recovery time.

## Object storage

Allow only JPEG, PNG, WebP and AVIF covers under 8MB. Require alt text and a verified rights record. Expire abandoned drafts after 7 days; transition unused original versions after 90 days; preserve licensed published covers according to their rights term.
