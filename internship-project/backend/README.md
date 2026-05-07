# Backend README

This backend is an Express + Prisma API for India village-level geographical hierarchy data.

## What This Backend Can Do Right Now

- start an Express server
- expose versioned API routes
- return imported MDDS country/state/district/sub-district/village data
- filter villages by hierarchy with pagination
- search villages by name
- return one village with its full parent hierarchy
- protect geography routes with API key + secret auth
- track usage logs and expose admin analytics

## Current Backend Structure

```text
backend/
  package.json
  README.md
  src/
    app.js
    server.js
    data/
      geoData.js
    routes/
      geoRoutes.js
      healthRoutes.js
      homeRoutes.js
    services/
      geoService.js
    utils/
      responseHelpers.js
```

## Route List

- `GET /`
- `GET /api/v1/health`
- `GET /api/v1/health/db`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/api-keys`
- `POST /api/v1/auth/api-keys`
- `GET /api/v1/admin/usage-summary`
- `GET /api/v1/country`
- `GET /api/v1/states`
- `GET /api/v1/districts?stateCode=27`
- `GET /api/v1/sub-districts?districtCode=497`
- `GET /api/v1/villages?page=1&limit=50`
- `GET /api/v1/villages?districtCode=497`
- `GET /api/v1/villages/search?name=mani&limit=10`
- `GET /api/v1/villages/525002`

## API Key Auth (Now Enabled For Geo Routes)

All geography routes under `/api/v1/*` now require:

- `x-api-key` header
- `x-api-secret` header

Examples:

- `GET /api/v1/states` needs `x-api-key` and `x-api-secret`
- `GET /api/v1/districts?stateCode=27` needs `x-api-key` and `x-api-secret`

Health route remains open:

- `GET /api/v1/health`
- `GET /api/v1/health/db`

Auth routes (JWT-based) are open for login/registration:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

API key management routes require Bearer token:

- `GET /api/v1/auth/api-keys`
- `POST /api/v1/auth/api-keys`

## API Usage Logging (Now Enabled)

Every protected API call writes a usage log entry into `ApiLog` with:

- `apiKeyId`
- `endpoint` (method + url)
- `responseTime` (in milliseconds)

## Daily Rate Limiting (Now Enabled)

Rate limit is enforced per API key using Upstash Redis REST when configured, with an in-memory fallback for local demos.

Default limit:

- `5000` requests/day per API key

Configure in environment:

```env
DAILY_API_LIMIT=5000
```

## JWT Auth Setup

Add this in `.env`:

```env
JWT_SECRET="replace-with-a-long-random-secret"
```

## Create Test API Key

Run:

```bash
npm run seed:apikey
```

Create an admin user for analytics:

```bash
npm.cmd run seed:admin
```

This prints a usable `x-api-key` for testing protected routes.

Example requests:

```bash
curl -H "x-api-key: YOUR_KEY_HERE" -H "x-api-secret: YOUR_SECRET_HERE" http://localhost:3000/api/v1/states
```

```bash
curl -H "x-api-key: YOUR_KEY_HERE" -H "x-api-secret: YOUR_SECRET_HERE" "http://localhost:3000/api/v1/districts?stateCode=27"
```

## Important Note

The geography routes are now connected through Prisma, so they expect the PostgreSQL
tables from `prisma/schema.prisma` to exist and to contain imported MDDS data.

## Running Locally

When Node.js is available in the machine path:

```bash
npm install
npm run dev
```

Then open:

`http://localhost:3000`

## Where To Put The Real Dataset

Place your downloaded MDDS file in:

`backend/data/raw/`

Recommended filename:

`backend/data/raw/mdds-master.xlsx`

Expected extracted files path:

`backend/data/raw/mdds-master.xlsx/dataset`

## Import Script (Next Step)

Install dependencies:

```bash
npm install
```

Run a safe dry run first:

```bash
npm run import:mdds:dry
```

On Windows PowerShell, if `npm` is blocked by script policy, use:

```bash
npm.cmd run import:mdds:dry
```

Latest dry-run result on this project:

- Dataset files found: `30`
- Total rows read: `570435`
- Usable village rows: `564397`
- Skipped rows: `6038`

After `DATABASE_URL` is set and Prisma tables are ready, write to DB:

```bash
npm run import:mdds
```

Windows PowerShell equivalent:

```bash
npm.cmd run import:mdds
```

For faster imports over a remote database, pass a larger batch size:

```bash
npm.cmd run import:mdds -- --batch-size=10000
```

Check imported row counts:

```bash
npm.cmd run db:counts
```

The import also writes a reviewable report:

```text
backend/reports/mdds-import-summary.json
```

Before the real import, create/update the PostgreSQL tables:

```bash
npx prisma db push
```

If Prisma Client generation is blocked by a temporary Windows file lock, close any
running Node server and rerun:

```bash
npm.cmd run prisma:generate
```
