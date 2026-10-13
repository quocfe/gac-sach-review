# Gác Sách Review

Next.js + TypeScript V1 prototype for a moderated Vietnamese book-review community.

## Run

```bash
npm install
npm run dev
# http://localhost:3000
```

## Verify

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

## Demo behavior

- Development uses an intentionally local repository (`src/lib/catalog.ts`) and browser localStorage for session demo, ratings, shelves and composer drafts.
- Demo identity is a member. Admin and moderator screens expose role-oriented UI only; no credentials are embedded.
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` are present only as empty environment names in `.env.example`, so an Auth.js/Prisma adapter can replace the local seam.
- All cover art is rendered placeholder typography; no images were scraped or re-hosted.

## Data seam

`src/lib/catalog.ts` is the read repository seam; `src/lib/services.ts` owns the rating/bookshelf/review invariants. Replace those modules with Prisma/PostgreSQL repositories while retaining the UI contract. The planned database variables remain in `.env.example`.

## Operations (Phase 5)

- Health: `GET /api/health` reports uptime plus a request ID.
- API responses for moderation and reports include a request ID; logs can associate failures by that ID when a production logger is wired in.
- Demo rate limits: reports 5/minute per reporter; moderation actions 20/minute per actor. Replace memory storage with shared Redis/PostgreSQL enforcement in multi-instance deployment.
- **Backup runbook:** take a PostgreSQL point-in-time or `pg_dump` backup daily; encrypt it; retain daily 35 days/monthly 12 months; quarterly restore it to isolated staging, run migrations, and verify catalog, review and audit counts before recording the outcome.
- **Object storage lifecycle:** keep original authorized covers private; transition unused original versions to archive after 90 days; delete abandoned draft uploads after 7 days; never automatically delete published, licensed covers before their rights term.

## Limitations

This implementation is a local demo, not production authentication or persistent moderation. Google OAuth requires registered credentials and an Auth.js adapter; PostgreSQL/Prisma migrations are intentionally omitted to ensure the app runs without external services. Phase 5 route-level authorization uses demo actor values until Auth.js sessions replace them.
