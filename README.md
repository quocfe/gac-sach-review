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

## Limitations

This implementation is a local demo, not production authentication or persistent moderation. Google OAuth requires registered credentials and an Auth.js adapter; PostgreSQL/Prisma migrations are intentionally omitted to ensure the app runs without external services.
