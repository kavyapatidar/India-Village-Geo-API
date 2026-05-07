# Problem Statement Compliance

## Implemented Core Requirements

- Node.js + Express backend with Prisma ORM.
- Neon/PostgreSQL schema for `Country`, `State`, `District`, `SubDistrict`, `Village`, `User`, `ApiKey`, and `ApiLog`.
- Normalized hierarchy with foreign keys and unique code constraints.
- MDDS Excel/ODS import pipeline with validation, deduplication, bulk insert, and summary reporting.
- API key authentication using `x-api-key` and `x-api-secret`.
- JWT user registration/login and API key creation.
- Daily API rate limiting with optional Upstash Redis REST storage and local fallback.
- Cache-aware geography reads with optional Upstash Redis REST storage and local fallback.
- Asynchronous API usage logging.
- Health checks for server and database.

## Extra Upgrades

- Paginated village APIs so large datasets do not overload clients.
- Standardized village address output on search/list/detail responses.
- Admin usage analytics endpoint at `GET /api/v1/admin/usage-summary`.
- Import summary report at `backend/reports/mdds-import-summary.json`.
- Database indexes for hierarchy lookups, village search, auth, and usage analytics.

## Current Imported Data

- Countries: `1`
- States: `29`
- Districts: `530`
- Sub-districts: `5354`
- Villages: `564179`

## Demo Flow

1. Start backend:

```bash
cd backend
npm.cmd run dev
```

2. Create a demo API key:

```bash
npm.cmd run seed:apikey
```

3. Create an admin user:

```bash
npm.cmd run seed:admin
```

4. Call a protected route:

```bash
curl -H "x-api-key: YOUR_KEY" -H "x-api-secret: YOUR_SECRET" "http://localhost:3000/api/v1/villages/search?name=Manibeli&limit=5"
```
